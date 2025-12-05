import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { Recommendation } from './recommendation.entity';
import { AuthGuard } from '@nestjs/passport';
import { QiniuService } from '../qiniu/qiniu.service';

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
    private readonly qiniuService: QiniuService,
  ) { }

  @Get()
  @ApiOperation({ summary: '获取所有推荐', description: '获取推荐列表，无需认证' })
  @ApiResponse({ status: 200, description: '成功返回推荐列表', type: [Recommendation] })
  findAll(): Recommendation[] {
    return this.recommendationsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10)) // 最多上传10张图片
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '创建推荐', description: '创建新的推荐，支持上传最多10张图片' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '推荐数据和图片文件',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'GitHub' },
        url: { type: 'string', example: 'https://github.com' },
        icon: { type: 'string', example: '🐙' },
        category: { type: 'string', example: 'Development' },
        description: { type: 'string', example: 'Code hosting platform' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: '图片文件（最多10张）',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: '创建成功', type: Recommendation })
  @ApiResponse({ status: 401, description: '未授权' })
  async create(
    @Body() recommendation: Omit<Recommendation, 'id'>,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<Recommendation> {
    // 如果有上传的图片，先上传到七牛云
    if (files && files.length > 0) {
      const uploadResults = await this.qiniuService.uploadFiles(files);
      recommendation.images = uploadResults.map((result) => result.url);
    }

    return this.recommendationsService.create(recommendation);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '更新推荐', description: '更新推荐信息，支持追加图片' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '更新的推荐数据和新图片',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        url: { type: 'string' },
        icon: { type: 'string' },
        category: { type: 'string' },
        description: { type: 'string' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: '新增图片（会与现有图片合并）',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: '更新成功', type: Recommendation })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '推荐不存在' })
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Recommendation>,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<Recommendation | null> {
    // 如果有新上传的图片
    if (files && files.length > 0) {
      const uploadResults = await this.qiniuService.uploadFiles(files);
      const newImages = uploadResults.map((result) => result.url);

      // 合并新旧图片
      const existingRecommendation = this.recommendationsService.findAll().find((r) => r.id === id);
      if (existingRecommendation && existingRecommendation.images) {
        updateData.images = [...existingRecommendation.images, ...newImages];
      } else {
        updateData.images = newImages;
      }
    }

    return this.recommendationsService.update(id, updateData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '删除推荐', description: '删除推荐，会自动删除关联的所有图片' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '推荐不存在' })
  async delete(@Param('id') id: string): Promise<void> {
    // 删除推荐时，同时删除关联的图片
    const recommendation = this.recommendationsService.findAll().find((r) => r.id === id);
    if (recommendation && recommendation.images && recommendation.images.length > 0) {
      const keys = recommendation.images.map((url) => this.qiniuService.extractKeyFromUrl(url));
      await this.qiniuService.deleteFiles(keys);
    }

    this.recommendationsService.delete(id);
  }
}

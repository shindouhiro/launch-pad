import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { QiniuService } from '../qiniu/qiniu.service';

@ApiTags('upload')
@Controller('upload')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class UploadController {
  constructor(private readonly qiniuService: QiniuService) { }

  /**
   * 上传单个文件
   */
  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '上传单个图片', description: '上传单个图片到七牛云' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '图片文件',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '图片文件',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '上传成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            url: { type: 'string', example: 'http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/xxx.jpg' },
            key: { type: 'string', example: 'uploads/xxx.jpg' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: '上传失败' })
  @ApiResponse({ status: 401, description: '未授权' })
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const result = await this.qiniuService.uploadFile(file);
      // Sign the URL immediately for preview
      result.url = this.qiniuService.getPrivateDownloadUrl(result.url);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  /**
   * 上传多个文件
   */
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // 最多10个文件
  @ApiOperation({ summary: '上传多个图片', description: '批量上传图片到七牛云，最多10个' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '图片文件数组',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: '图片文件（最多10个）',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '上传成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              url: { type: 'string' },
              key: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: '上传失败' })
  @ApiResponse({ status: 401, description: '未授权' })
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    try {
      const results = await this.qiniuService.uploadFiles(files);
      // Sign the URLs immediately for preview
      results.forEach(result => {
        result.url = this.qiniuService.getPrivateDownloadUrl(result.url);
      });
      return {
        success: true,
        data: results,
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  /**
   * 删除单个文件
   */
  @Delete('single')
  @ApiOperation({ summary: '删除单个图片', description: '从七牛云删除单个图片' })
  @ApiBody({
    description: '图片URL',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/xxx.jpg',
          description: '要删除的图片URL',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '删除成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'File deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 400, description: '删除失败' })
  @ApiResponse({ status: 401, description: '未授权' })
  async deleteSingle(@Body('url') url: string) {
    if (!url) {
      throw new BadRequestException('URL is required');
    }

    try {
      const key = this.qiniuService.extractKeyFromUrl(url);
      await this.qiniuService.deleteFile(key);
      return {
        success: true,
        message: 'File deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }

  /**
   * 删除多个文件
   */
  @Delete('multiple')
  @ApiOperation({ summary: '删除多个图片', description: '从七牛云批量删除图片' })
  @ApiBody({
    description: '图片URL数组',
    schema: {
      type: 'object',
      properties: {
        urls: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/xxx1.jpg',
            'http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/xxx2.jpg',
          ],
          description: '要删除的图片URL数组',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '删除成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Files deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 400, description: '删除失败' })
  @ApiResponse({ status: 401, description: '未授权' })
  async deleteMultiple(@Body('urls') urls: string[]) {
    if (!urls || urls.length === 0) {
      throw new BadRequestException('URLs are required');
    }

    try {
      const keys = urls.map((url) => this.qiniuService.extractKeyFromUrl(url));
      await this.qiniuService.deleteFiles(keys);
      return {
        success: true,
        message: 'Files deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }

  /**
   * 获取上传凭证（用于前端直传）
   */
  @Post('token')
  @ApiOperation({ summary: '获取上传凭证', description: '获取七牛云上传凭证，用于前端直传' })
  @ApiBody({
    description: '可选的自定义文件key',
    required: false,
    schema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          example: 'custom-key',
          description: '自定义文件key（可选）',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '获取成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            token: { type: 'string', description: '上传凭证' },
            domain: { type: 'string', example: 'http://t6mfwj8xf.hn-bkt.clouddn.com' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授权' })
  getUploadToken(@Body('key') key?: string) {
    const token = this.qiniuService.getUploadToken(key);
    return {
      success: true,
      data: {
        token,
        domain: this.qiniuService['domain'],
      },
    };
  }
}


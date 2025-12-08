import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './category.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  @ApiOperation({ summary: '获取所有分类' })
  @ApiResponse({ status: 200, type: [CategoryEntity] })
  async findAll(): Promise<CategoryEntity[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取分类详情' })
  @ApiResponse({ status: 200, type: CategoryEntity })
  async findOne(@Param('id') id: string): Promise<CategoryEntity> {
    const category = await this.categoriesService.findOne(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: '创建分类' })
  @ApiResponse({ status: 201, type: CategoryEntity })
  async create(@Body() category: Partial<CategoryEntity>): Promise<CategoryEntity> {
    return this.categoriesService.create(category);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  @ApiOperation({ summary: '更新分类' })
  @ApiResponse({ status: 200, type: CategoryEntity })
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CategoryEntity>,
  ): Promise<CategoryEntity> {
    const updated = await this.categoriesService.update(id, updateData);
    if (!updated) {
      throw new NotFoundException('Category not found');
    }
    return updated;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({ summary: '删除分类' })
  @ApiResponse({ status: 200 })
  async delete(@Param('id') id: string): Promise<void> {
    return this.categoriesService.delete(id);
  }
}

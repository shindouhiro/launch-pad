import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) { }

  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CategoryEntity | null> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async create(category: Partial<CategoryEntity>): Promise<CategoryEntity> {
    const newCategory = this.categoryRepository.create(category);
    return this.categoryRepository.save(newCategory);
  }

  async update(id: string, updateData: Partial<CategoryEntity>): Promise<CategoryEntity | null> {
    await this.categoryRepository.update(id, updateData);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}

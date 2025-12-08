import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RecommendationEntity } from '../recommendations/recommendation.entity';

@Entity('categories')
export class CategoryEntity {
  @ApiProperty({ description: '分类ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '分类名称', example: 'Development' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ description: '排序', example: 0, default: 0 })
  @Column({ default: 0 })
  sortOrder: number;

  @OneToMany(() => RecommendationEntity, (recommendation) => recommendation.categoryRelation)
  recommendations: RecommendationEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('recommendations')
export class RecommendationEntity {
  @ApiProperty({ description: '推荐ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '标题', example: 'GitHub' })
  @Column()
  title: string;

  @ApiProperty({ description: 'URL链接', example: 'https://github.com' })
  @Column()
  url: string;

  @ApiProperty({ description: '图标', example: '🐙' })
  @Column({ nullable: true })
  icon: string;

  @ApiProperty({ description: '分类', example: 'Development' })
  @Column()
  category: string;

  @ApiProperty({ description: '描述', example: 'Code hosting and collaboration' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiPropertyOptional({
    description: '图片URL数组',
    type: [String],
    example: [
      'http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/xxx1.jpg',
      'http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/xxx2.jpg',
    ],
  })
  @Column('simple-array', { nullable: true })
  images: string[];

  @ApiPropertyOptional({
    description: '封面图片URL',
    type: String,
    example: 'http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/cover.jpg',
  })
  @Column({ nullable: true })
  coverImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

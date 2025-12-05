import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendationEntity } from './recommendation.entity';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(RecommendationEntity)
    private recommendationRepository: Repository<RecommendationEntity>,
  ) { }

  async findAll(): Promise<RecommendationEntity[]> {
    return this.recommendationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<RecommendationEntity | null> {
    return this.recommendationRepository.findOne({ where: { id } });
  }

  async create(
    recommendation: Partial<RecommendationEntity>,
  ): Promise<RecommendationEntity> {
    const newRecommendation = this.recommendationRepository.create(recommendation);
    return this.recommendationRepository.save(newRecommendation);
  }

  async update(
    id: string,
    updateData: Partial<RecommendationEntity>,
  ): Promise<RecommendationEntity | null> {
    await this.recommendationRepository.update(id, updateData);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.recommendationRepository.delete(id);
  }
}

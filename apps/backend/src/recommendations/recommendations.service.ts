import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendationEntity } from './recommendation.entity';
import { QiniuService } from '../qiniu/qiniu.service';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(RecommendationEntity)
    private recommendationRepository: Repository<RecommendationEntity>,
    private qiniuService: QiniuService,
  ) { }

  private signUrls(entity: RecommendationEntity): RecommendationEntity {
    if (!entity) return entity;

    // Sign cover image
    if (entity.coverImage) {
      entity.coverImage = this.qiniuService.getPrivateDownloadUrl(entity.coverImage);
    }

    // Sign images array
    if (entity.images && entity.images.length > 0) {
      entity.images = entity.images.map(url => this.qiniuService.getPrivateDownloadUrl(url));
    }

    // Sign image groups
    if (entity.imageGroups && entity.imageGroups.length > 0) {
      entity.imageGroups = entity.imageGroups.map(group => ({
        ...group,
        images: group.images.map(url => this.qiniuService.getPrivateDownloadUrl(url))
      }));
    }

    return entity;
  }

  async findAll(): Promise<RecommendationEntity[]> {
    const items = await this.recommendationRepository.find({
      order: { createdAt: 'DESC' },
    });
    return items.map(item => this.signUrls(item));
  }

  async findOne(id: string): Promise<RecommendationEntity | null> {
    const item = await this.recommendationRepository.findOne({ where: { id } });
    return item ? this.signUrls(item) : null;
  }

  async create(
    recommendation: Partial<RecommendationEntity>,
  ): Promise<RecommendationEntity> {
    const newRecommendation = this.recommendationRepository.create(recommendation);
    const saved = await this.recommendationRepository.save(newRecommendation);
    return this.signUrls(saved);
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

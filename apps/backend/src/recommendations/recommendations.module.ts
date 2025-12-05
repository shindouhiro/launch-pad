import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { RecommendationEntity } from './recommendation.entity';
import { QiniuModule } from '../qiniu/qiniu.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecommendationEntity]),
    QiniuModule,
  ],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
})
export class RecommendationsModule { }

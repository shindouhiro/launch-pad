import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { Recommendation } from './recommendation.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) { }

  @Get()
  findAll(): Recommendation[] {
    return this.recommendationsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() recommendation: Omit<Recommendation, 'id'>): Recommendation {
    return this.recommendationsService.create(recommendation);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<Recommendation>): Recommendation | null {
    return this.recommendationsService.update(id, updateData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string): void {
    this.recommendationsService.delete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { Recommendation } from './recommendation.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RecommendationsService {
  private recommendations: Recommendation[] = [
    {
      id: '1',
      title: 'GitHub',
      url: 'https://github.com',
      icon: '🐙',
      category: 'Development',
      description: 'Code hosting and collaboration',
    },
    {
      id: '2',
      title: 'Vercel',
      url: 'https://vercel.com',
      icon: '▲',
      category: 'Development',
      description: 'Develop. Preview. Ship.',
    },
  ];

  findAll(): Recommendation[] {
    return this.recommendations;
  }

  create(recommendation: Omit<Recommendation, 'id'>): Recommendation {
    const newRecommendation = { id: uuidv4(), ...recommendation };
    this.recommendations.push(newRecommendation);
    return newRecommendation;
  }

  update(id: string, updateData: Partial<Recommendation>): Recommendation | null {
    const index = this.recommendations.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.recommendations[index] = { ...this.recommendations[index], ...updateData };
      return this.recommendations[index];
    }
    return null;
  }

  delete(id: string): void {
    this.recommendations = this.recommendations.filter((r) => r.id !== id);
  }
}

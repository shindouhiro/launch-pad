export class CreateRecommendationDto {
  title: string;
  url: string;
  icon: string;
  category: string;
  description: string;
  images?: string[];
}

export class UpdateRecommendationDto {
  title?: string;
  url?: string;
  icon?: string;
  category?: string;
  description?: string;
  images?: string[];
}

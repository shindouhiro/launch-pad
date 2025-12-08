/**
 * 分类接口
 */
export interface Category {
  id: string;
  name: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 推荐项接口
 */
export interface Recommendation {
  id: string;
  title: string;
  url: string;
  icon: string;
  category: string; // Keep for backward compatibility or display
  categoryId?: string;
  categoryRelation?: Category;
  description: string;
  images?: string[];
  coverImage?: string;
  imageGroups?: { name: string; images: string[] }[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 创建推荐项数据
 */
export interface CreateRecommendationDto {
  title: string;
  url: string;
  icon?: string;
  category: string;
  categoryId?: string;
  description: string;
  images?: string[];
  coverImage?: string;
  imageGroups?: { name: string; images: string[] }[];
}

/**
 * 更新推荐项数据
 */
export interface UpdateRecommendationDto extends Partial<CreateRecommendationDto> {
  existingImages?: string[];
}

/**
 * 用户登录数据
 */
export interface LoginDto {
  username: string;
  password: string;
}

/**
 * 登录响应
 */
export interface LoginResponse {
  access_token: string;
}

/**
 * 上传响应
 */
export interface UploadResponse {
  url: string;
  key: string;
}

import { http } from '@/lib/http';
import type {
  Recommendation,
  CreateRecommendationDto,
  UpdateRecommendationDto,
} from './types';

/**
 * 推荐相关 API
 */
export const recommendationApi = {
  /**
   * 获取所有推荐
   */
  getAll: () => {
    return http.get<Recommendation[]>('/recommendations');
  },

  /**
   * 根据 ID 获取推荐
   */
  getById: (id: string) => {
    return http.get<Recommendation>(`/recommendations/${id}`);
  },

  /**
   * 创建推荐
   */
  create: (data: CreateRecommendationDto, files?: File[]) => {
    if (files && files.length > 0) {
      const formData = new FormData();

      // 添加文本字段
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // 添加图片文件
      files.forEach((file) => {
        formData.append('images', file);
      });

      return http.upload<Recommendation>('/recommendations', formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
    }

    return http.post<Recommendation>('/recommendations', data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  },

  /**
   * 更新推荐
   */
  update: (id: string, data: UpdateRecommendationDto, files?: File[]) => {
    if (files && files.length > 0) {
      const formData = new FormData();

      // 添加文本字段
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // 添加图片文件
      files.forEach((file) => {
        formData.append('images', file);
      });

      return http.upload<Recommendation>(`/recommendations/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
    }

    return http.put<Recommendation>(`/recommendations/${id}`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  },

  /**
   * 删除推荐
   */
  delete: (id: string) => {
    return http.delete(`/recommendations/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  },
};

/**
 * 获取 Token
 */
function getToken(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || '';
  }
  return '';
}

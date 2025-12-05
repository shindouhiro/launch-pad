/**
 * 七牛云图片上传 API 工具函数
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * 获取认证 token
 */
const getAuthToken = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || '';
  }
  return '';
};

/**
 * 上传单个文件
 */
export const uploadSingleImage = async (file: File): Promise<{ url: string; key: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload/single`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('上传失败');
  }

  const result = await response.json();
  return result.data;
};

/**
 * 上传多个文件
 */
export const uploadMultipleImages = async (
  files: File[]
): Promise<Array<{ url: string; key: string }>> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('上传失败');
  }

  const result = await response.json();
  return result.data;
};

/**
 * 删除单个文件
 */
export const deleteSingleImage = async (url: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/upload/single`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error('删除失败');
  }
};

/**
 * 删除多个文件
 */
export const deleteMultipleImages = async (urls: string[]): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({ urls }),
  });

  if (!response.ok) {
    throw new Error('删除失败');
  }
};

/**
 * 获取上传凭证（用于前端直传）
 */
export const getUploadToken = async (key?: string): Promise<{ token: string; domain: string }> => {
  const response = await fetch(`${API_BASE_URL}/upload/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({ key }),
  });

  if (!response.ok) {
    throw new Error('获取上传凭证失败');
  }

  const result = await response.json();
  return result.data;
};

/**
 * 创建推荐（带图片）
 */
export interface CreateRecommendationData {
  title: string;
  url: string;
  icon: string;
  category: string;
  description: string;
}

export const createRecommendationWithImages = async (
  data: CreateRecommendationData,
  images?: File[]
): Promise<any> => {
  const formData = new FormData();

  // 添加文本字段
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key as keyof CreateRecommendationData]);
  });

  // 添加图片文件
  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await fetch(`${API_BASE_URL}/recommendations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('创建推荐失败');
  }

  return await response.json();
};

/**
 * 更新推荐（带图片）
 */
export const updateRecommendationWithImages = async (
  id: string,
  data: Partial<CreateRecommendationData>,
  images?: File[]
): Promise<any> => {
  const formData = new FormData();

  // 添加文本字段
  Object.keys(data).forEach((key) => {
    const value = data[key as keyof CreateRecommendationData];
    if (value !== undefined) {
      formData.append(key, value);
    }
  });

  // 添加图片文件
  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await fetch(`${API_BASE_URL}/recommendations/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('更新推荐失败');
  }

  return await response.json();
};

/**
 * 删除推荐（会自动删除关联图片）
 */
export const deleteRecommendation = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/recommendations/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('删除推荐失败');
  }
};

/**
 * 获取所有推荐
 */
export const getAllRecommendations = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/recommendations`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('获取推荐列表失败');
  }

  return await response.json();
};

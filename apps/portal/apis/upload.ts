import { http } from '@/lib/http';
import type { UploadResponse } from './types';

/**
 * 上传相关 API
 */
export const uploadApi = {
  /**
   * 上传单个文件
   */
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return http.upload<UploadResponse>('/upload', formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  },

  /**
   * 上传多个文件
   */
  uploadFiles: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    return http.upload<UploadResponse[]>('/upload/multiple', formData, {
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

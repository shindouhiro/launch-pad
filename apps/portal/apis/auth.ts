import { http } from '@/lib/http';
import type { LoginDto, LoginResponse } from './types';

/**
 * 认证相关 API
 */
export const authApi = {
  /**
   * 用户登录
   */
  login: (data: LoginDto) => {
    return http.post<LoginResponse>('/auth/login', data);
  },

  /**
   * 用户注册
   */
  register: (data: LoginDto) => {
    return http.post<LoginResponse>('/auth/register', data);
  },

  /**
   * 登出
   */
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  /**
   * 获取当前 Token
   */
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  /**
   * 保存 Token
   */
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  /**
   * 检查是否已登录
   */
  isAuthenticated: (): boolean => {
    return !!authApi.getToken();
  },
};

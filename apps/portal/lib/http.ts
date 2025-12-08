/**
 * HTTP 请求方法类型
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * 请求配置接口
 */
interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  timeout?: number;
}

/**
 * API 响应接口
 */
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
}

/**
 * API 错误类
 */
class ApiError extends Error {
  status: number;
  statusText: string;
  data?: unknown;

  constructor(message: string, status: number, statusText: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

/**
 * 构建 URL 查询参数
 */
function buildQueryString(params: Record<string, string | number | boolean>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });
  return searchParams.toString();
}

/**
 * 统一的 fetch 封装
 */
async function request<T = unknown>(
  url: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    params,
    data,
    headers = {},
    timeout = 30000,
    ...restConfig
  } = config;

  // 构建完整 URL
  let fullUrl = url.startsWith('http') ? url : `/api${url}`;

  // 添加查询参数
  if (params) {
    const queryString = buildQueryString(params);
    fullUrl += `${fullUrl.includes('?') ? '&' : '?'}${queryString}`;
  }

  // 构建请求配置
  const requestConfig: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...restConfig,
  };

  // 自动添加 JWT token（如果存在）
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      (requestConfig.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  // 添加请求体
  if (data) {
    if (data instanceof FormData) {
      // FormData 自动设置 Content-Type
      delete (requestConfig.headers as Record<string, string>)['Content-Type'];
      requestConfig.body = data;
    } else {
      requestConfig.body = JSON.stringify(data);
    }
  }

  // 创建超时控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  requestConfig.signal = controller.signal;

  try {
    const response = await fetch(fullUrl, requestConfig);
    clearTimeout(timeoutId);

    // 解析响应
    let responseData: any;
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // 检查响应状态
    if (!response.ok) {
      throw new ApiError(
        responseData?.message || `HTTP Error: ${response.status}`,
        response.status,
        response.statusText,
        responseData
      );
    }

    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'Request Timeout');
      }
      throw new ApiError(error.message, 0, 'Network Error');
    }

    throw new ApiError('Unknown error', 0, 'Unknown Error');
  }
}

/**
 * HTTP 请求方法封装
 */
const http = {
  /**
   * GET 请求
   */
  get: <T = any>(url: string, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'GET' }),

  /**
   * POST 请求
   */
  post: <T = any>(url: string, data?: any, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'POST', data }),

  /**
   * PUT 请求
   */
  put: <T = any>(url: string, data?: any, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'PUT', data }),

  /**
   * DELETE 请求
   */
  delete: <T = any>(url: string, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'DELETE' }),

  /**
   * PATCH 请求
   */
  patch: <T = any>(url: string, data?: any, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'PATCH', data }),

  /**
   * 上传文件
   */
  upload: <T = any>(url: string, formData: FormData, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'POST', data: formData }),
};

export { http, ApiError };
export type { ApiResponse, RequestConfig };

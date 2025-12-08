# API 封装使用指南

## 📋 概述

本项目已实现统一的 API 封装，包括：
- ✅ 统一的 HTTP 请求封装
- ✅ API 代理转发配置
- ✅ TypeScript 类型定义
- ✅ 错误处理和超时控制
- ✅ 文件上传支持

## 🏗️ 项目结构

```
apps/portal/
├── apis/                    # API 接口目录
│   ├── index.ts            # 统一导出
│   ├── types.ts            # TypeScript 类型定义
│   ├── auth.ts             # 认证相关 API
│   ├── recommendation.ts   # 推荐相关 API
│   └── upload.ts           # 上传相关 API
├── lib/
│   └── http.ts             # HTTP 请求封装
└── next.config.ts          # Next.js 配置（包含代理）
```

## 🔧 配置说明

### 1. Next.js 代理配置

在 `next.config.ts` 中配置了 API 代理：

```typescript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
        : 'http://localhost:3001/:path*',
    },
  ];
}
```

**作用：**
- 前端请求 `/api/recommendations` 会自动转发到 `http://localhost:3001/recommendations`
- 避免跨域问题
- 统一 API 路径管理

### 2. 环境变量

在 `.env.local` 中配置：

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📚 使用方法

### 1. 推荐相关 API

#### 获取所有推荐

```typescript
import { recommendationApi } from '@/apis';

// 在组件中使用
const fetchRecommendations = async () => {
  try {
    const response = await recommendationApi.getAll();
    console.log(response.data); // Recommendation[]
  } catch (error) {
    console.error('获取推荐失败:', error);
  }
};
```

#### 获取单个推荐

```typescript
const fetchRecommendation = async (id: string) => {
  try {
    const response = await recommendationApi.getById(id);
    console.log(response.data); // Recommendation
  } catch (error) {
    console.error('获取推荐失败:', error);
  }
};
```

#### 创建推荐（带图片上传）

```typescript
import { recommendationApi } from '@/apis';
import type { CreateRecommendationDto } from '@/apis';

const createRecommendation = async (
  data: CreateRecommendationDto,
  files?: File[]
) => {
  try {
    const response = await recommendationApi.create(data, files);
    console.log('创建成功:', response.data);
  } catch (error) {
    console.error('创建失败:', error);
  }
};

// 使用示例
const handleSubmit = async (values: any, fileList: File[]) => {
  await createRecommendation(
    {
      title: values.title,
      url: values.url,
      icon: values.icon,
      category: values.category,
      description: values.description,
    },
    fileList
  );
};
```

#### 更新推荐

```typescript
const updateRecommendation = async (
  id: string,
  data: UpdateRecommendationDto,
  files?: File[]
) => {
  try {
    const response = await recommendationApi.update(id, data, files);
    console.log('更新成功:', response.data);
  } catch (error) {
    console.error('更新失败:', error);
  }
};
```

#### 删除推荐

```typescript
const deleteRecommendation = async (id: string) => {
  try {
    await recommendationApi.delete(id);
    console.log('删除成功');
  } catch (error) {
    console.error('删除失败:', error);
  }
};
```

### 2. 认证相关 API

#### 用户登录

```typescript
import { authApi } from '@/apis';

const handleLogin = async (username: string, password: string) => {
  try {
    const response = await authApi.login({ username, password });
    authApi.setToken(response.data.access_token);
    console.log('登录成功');
  } catch (error) {
    console.error('登录失败:', error);
  }
};
```

#### 用户注册

```typescript
const handleRegister = async (username: string, password: string) => {
  try {
    const response = await authApi.register({ username, password });
    authApi.setToken(response.data.access_token);
    console.log('注册成功');
  } catch (error) {
    console.error('注册失败:', error);
  }
};
```

#### 登出

```typescript
const handleLogout = () => {
  authApi.logout();
  // 跳转到登录页
  router.push('/login');
};
```

#### 检查登录状态

```typescript
const isLoggedIn = authApi.isAuthenticated();

if (!isLoggedIn) {
  router.push('/login');
}
```

### 3. 文件上传 API

#### 上传单个文件

```typescript
import { uploadApi } from '@/apis';

const handleFileUpload = async (file: File) => {
  try {
    const response = await uploadApi.uploadFile(file);
    console.log('上传成功:', response.data.url);
  } catch (error) {
    console.error('上传失败:', error);
  }
};
```

#### 上传多个文件

```typescript
const handleMultipleUpload = async (files: File[]) => {
  try {
    const response = await uploadApi.uploadFiles(files);
    console.log('上传成功:', response.data);
  } catch (error) {
    console.error('上传失败:', error);
  }
};
```

### 4. 直接使用 HTTP 封装

如果需要调用其他 API：

```typescript
import { http } from '@/lib/http';

// GET 请求
const getData = async () => {
  const response = await http.get('/custom-endpoint');
  return response.data;
};

// POST 请求
const postData = async (data: any) => {
  const response = await http.post('/custom-endpoint', data);
  return response.data;
};

// 带查询参数
const getWithParams = async () => {
  const response = await http.get('/users', {
    params: { page: 1, limit: 10 },
  });
  return response.data;
};

// 带请求头
const getWithHeaders = async () => {
  const response = await http.get('/protected', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 设置超时
const getWithTimeout = async () => {
  const response = await http.get('/slow-endpoint', {
    timeout: 5000, // 5秒超时
  });
  return response.data;
};
```

## 🎯 在 React 组件中使用

### 示例：获取推荐列表

```typescript
'use client';
import { useState, useEffect } from 'react';
import { recommendationApi, Recommendation } from '@/apis';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await recommendationApi.getAll();
        setRecommendations(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div>
      {recommendations.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

## 🔐 错误处理

### ApiError 类

所有 API 错误都会抛出 `ApiError` 实例：

```typescript
import { ApiError } from '@/lib/http';

try {
  await recommendationApi.getAll();
} catch (error) {
  if (error instanceof ApiError) {
    console.log('状态码:', error.status);
    console.log('状态文本:', error.statusText);
    console.log('错误消息:', error.message);
    console.log('响应数据:', error.data);
    
    // 根据状态码处理
    if (error.status === 401) {
      // 未授权，跳转登录
      router.push('/login');
    } else if (error.status === 404) {
      // 资源不存在
      message.error('资源不存在');
    }
  }
}
```

## 📝 TypeScript 类型

### Recommendation 类型

```typescript
interface Recommendation {
  id: string;
  title: string;
  url: string;
  icon: string;
  category: string;
  description: string;
  images?: string[];
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### CreateRecommendationDto 类型

```typescript
interface CreateRecommendationDto {
  title: string;
  url: string;
  icon?: string;
  category: string;
  description: string;
  images?: string[];
  coverImage?: string;
}
```

### UpdateRecommendationDto 类型

```typescript
interface UpdateRecommendationDto extends Partial<CreateRecommendationDto> {
  existingImages?: string[];
}
```

## 🚀 最佳实践

### 1. 使用自定义 Hook

```typescript
// hooks/useRecommendations.ts
import { useState, useEffect } from 'react';
import { recommendationApi, Recommendation } from '@/apis';

export function useRecommendations() {
  const [data, setData] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await recommendationApi.getAll();
      setData(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}

// 使用
function MyComponent() {
  const { data, loading, error, refetch } = useRecommendations();
  
  // ...
}
```

### 2. 统一错误处理

```typescript
// lib/errorHandler.ts
import { ApiError } from '@/lib/http';
import { message } from 'antd';

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        message.error('请先登录');
        // 跳转登录页
        break;
      case 403:
        message.error('没有权限');
        break;
      case 404:
        message.error('资源不存在');
        break;
      case 500:
        message.error('服务器错误');
        break;
      default:
        message.error(error.message || '请求失败');
    }
  } else {
    message.error('未知错误');
  }
}

// 使用
try {
  await recommendationApi.create(data);
} catch (error) {
  handleApiError(error);
}
```

### 3. 请求拦截器（可选）

如果需要全局请求拦截，可以扩展 `http.ts`：

```typescript
// lib/http.ts 中添加
const requestInterceptor = (config: RequestConfig) => {
  // 自动添加 token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
};
```

## 🎉 总结

现在你可以：
- ✅ 使用统一的 API 封装
- ✅ 自动代理转发到后端
- ✅ 完整的 TypeScript 类型支持
- ✅ 统一的错误处理
- ✅ 文件上传支持
- ✅ 超时控制

所有 API 调用都通过 `@/apis` 导入，代码更加清晰和易于维护！

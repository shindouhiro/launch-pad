# API 封装和代理配置完成总结

## ✅ 已完成的工作

### 1. Next.js API 代理配置

**文件：** `apps/portal/next.config.ts`

- ✅ 配置 `rewrites` 实现 API 代理
- ✅ 将 `/api/*` 请求自动转发到后端服务器
- ✅ 支持环境变量配置后端地址
- ✅ 避免跨域问题

**配置内容：**
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

### 2. 统一 HTTP 请求封装

**文件：** `apps/portal/lib/http.ts`

- ✅ 封装 fetch API
- ✅ 支持 GET、POST、PUT、DELETE、PATCH 方法
- ✅ 自动处理 JSON 和 FormData
- ✅ 超时控制（默认 30 秒）
- ✅ 统一错误处理（ApiError 类）
- ✅ 查询参数自动构建
- ✅ 文件上传支持

**主要功能：**
```typescript
// GET 请求
http.get('/recommendations')

// POST 请求
http.post('/recommendations', data)

// 文件上传
http.upload('/upload', formData)

// 带参数
http.get('/users', { params: { page: 1 } })

// 超时控制
http.get('/api', { timeout: 5000 })
```

### 3. TypeScript 类型定义

**文件：** `apps/portal/apis/types.ts`

- ✅ Recommendation 接口
- ✅ CreateRecommendationDto 接口
- ✅ UpdateRecommendationDto 接口
- ✅ LoginDto 接口
- ✅ LoginResponse 接口
- ✅ UploadResponse 接口

### 4. API 接口封装

#### 推荐 API (`apis/recommendation.ts`)
- ✅ `getAll()` - 获取所有推荐
- ✅ `getById(id)` - 获取单个推荐
- ✅ `create(data, files)` - 创建推荐（支持图片上传）
- ✅ `update(id, data, files)` - 更新推荐
- ✅ `delete(id)` - 删除推荐

#### 认证 API (`apis/auth.ts`)
- ✅ `login(data)` - 用户登录
- ✅ `register(data)` - 用户注册
- ✅ `logout()` - 登出
- ✅ `getToken()` - 获取 Token
- ✅ `setToken(token)` - 保存 Token
- ✅ `isAuthenticated()` - 检查登录状态

#### 上传 API (`apis/upload.ts`)
- ✅ `uploadFile(file)` - 上传单个文件
- ✅ `uploadFiles(files)` - 上传多个文件

### 5. 统一导出

**文件：** `apis/index.ts`

```typescript
export * from './types';
export { authApi } from './auth';
export { recommendationApi } from './recommendation';
export { uploadApi } from './upload';
```

### 6. 更新主页面

**文件：** `apps/portal/app/page.tsx`

- ✅ 移除直接的 fetch 调用
- ✅ 使用 `recommendationApi.getAll()`
- ✅ 添加 loading 状态
- ✅ 改进错误处理

### 7. 文档

**文件：** `apps/portal/API_GUIDE.md`

- ✅ 完整的使用指南
- ✅ 代码示例
- ✅ 最佳实践
- ✅ 错误处理说明

## 📊 项目结构

```
apps/portal/
├── apis/                      # API 接口目录 ✨ 新增
│   ├── index.ts              # 统一导出
│   ├── types.ts              # TypeScript 类型定义
│   ├── auth.ts               # 认证相关 API
│   ├── recommendation.ts     # 推荐相关 API
│   └── upload.ts             # 上传相关 API
├── lib/
│   └── http.ts               # HTTP 请求封装 ✨ 新增
├── app/
│   └── page.tsx              # 主页面（已更新）
├── next.config.ts            # Next.js 配置（已更新）
└── API_GUIDE.md              # API 使用指南 ✨ 新增
```

## 🚀 使用方法

### 1. 基本使用

```typescript
import { recommendationApi } from '@/apis';

// 获取所有推荐
const response = await recommendationApi.getAll();
console.log(response.data); // Recommendation[]
```

### 2. 带文件上传

```typescript
import { recommendationApi } from '@/apis';

const createWithImages = async (data, files: File[]) => {
  const response = await recommendationApi.create(data, files);
  return response.data;
};
```

### 3. 错误处理

```typescript
import { ApiError } from '@/lib/http';

try {
  await recommendationApi.getAll();
} catch (error) {
  if (error instanceof ApiError) {
    console.log('状态码:', error.status);
    console.log('错误消息:', error.message);
  }
}
```

## 🎯 优势

### 1. 代码组织
- ✅ API 调用集中管理
- ✅ 类型定义统一
- ✅ 易于维护和扩展

### 2. 开发体验
- ✅ TypeScript 类型提示
- ✅ 自动补全
- ✅ 编译时类型检查

### 3. 错误处理
- ✅ 统一的错误类型
- ✅ 详细的错误信息
- ✅ 易于调试

### 4. 性能优化
- ✅ 请求超时控制
- ✅ 自动重试（可扩展）
- ✅ 请求缓存（可扩展）

### 5. 安全性
- ✅ 自动添加 Token
- ✅ 统一的认证处理
- ✅ CSRF 防护（可扩展）

## 📝 迁移指南

### 旧代码

```typescript
// ❌ 旧的方式
fetch('http://localhost:3001/recommendations')
  .then(res => res.json())
  .then(data => setApps(data))
  .catch(err => console.error(err));
```

### 新代码

```typescript
// ✅ 新的方式
import { recommendationApi } from '@/apis';

const response = await recommendationApi.getAll();
setApps(response.data);
```

## 🔧 环境变量

在 `.env.local` 中配置：

```env
# 后端 API 地址
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📚 相关文档

- [API 使用指南](./apps/portal/API_GUIDE.md)
- [HTTP 封装源码](./apps/portal/lib/http.ts)
- [API 接口定义](./apps/portal/apis/)

## 🎉 总结

现在你的项目拥有：
- ✅ 统一的 API 调用方式
- ✅ 完整的 TypeScript 类型支持
- ✅ 自动代理转发
- ✅ 统一的错误处理
- ✅ 文件上传支持
- ✅ 超时控制
- ✅ 详细的使用文档

所有 API 调用都通过 `@/apis` 导入，代码更加清晰、类型安全、易于维护！🚀

# 七牛云图片上传 - 快速开始

## 🚀 快速开始

### 1. 环境配置

确保 `apps/backend/.env` 文件已配置：

```bash
cd apps/backend
cp .env.example .env
```

编辑 `.env` 文件，确保七牛云配置正确：

```env
QINIU_ACCESS_KEY=dC3A-WosVq6wbQOJPTfY-DQff08hkcXj_KK8byKI
QINIU_SECRET_KEY=2sCgq3fS_ZSykVZ3IcpcBN-Mfow09utOb8_mEQ0U
QINIU_BUCKET=-launch-pad
QINIU_DOMAIN=http://t6mfwj8xf.hn-bkt.clouddn.com
QINIU_ZONE=z2
```

### 2. 启动后端服务

```bash
cd apps/backend
pnpm dev
```

后端将在 `http://localhost:3001` 运行。

### 3. 测试上传功能

#### 使用 curl 测试单文件上传

```bash
# 先登录获取 token
TOKEN="your-jwt-token"

# 上传单个文件
curl -X POST http://localhost:3001/upload/single \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.jpg"
```

#### 使用 curl 测试多文件上传

```bash
curl -X POST http://localhost:3001/upload/multiple \
  -H "Authorization: Bearer $TOKEN" \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg"
```

### 4. 前端集成

#### 方式一：使用提供的 API 工具函数

```typescript
import {
  uploadSingleImage,
  uploadMultipleImages,
  createRecommendationWithImages,
} from '@/lib/qiniu-api';

// 上传单个图片
const handleUpload = async (file: File) => {
  try {
    const result = await uploadSingleImage(file);
    console.log('上传成功:', result.url);
  } catch (error) {
    console.error('上传失败:', error);
  }
};

// 创建推荐并上传图片
const handleCreate = async (data: any, images: File[]) => {
  try {
    const result = await createRecommendationWithImages(data, images);
    console.log('创建成功:', result);
  } catch (error) {
    console.error('创建失败:', error);
  }
};
```

#### 方式二：使用 Ant Design Upload 组件

参考 `apps/portal/app/admin/recommendations/components/RecommendationImageUpload.tsx`

```tsx
import RecommendationImageUpload from './components/RecommendationImageUpload';

export default function RecommendationsPage() {
  return <RecommendationImageUpload />;
}
```

## 📋 API 端点

### 上传相关

- `POST /upload/single` - 上传单个文件
- `POST /upload/multiple` - 上传多个文件
- `DELETE /upload/single` - 删除单个文件
- `DELETE /upload/multiple` - 删除多个文件
- `POST /upload/token` - 获取上传凭证

### 推荐管理

- `GET /recommendations` - 获取所有推荐
- `POST /recommendations` - 创建推荐（支持图片上传）
- `PUT /recommendations/:id` - 更新推荐（支持图片上传）
- `DELETE /recommendations/:id` - 删除推荐（自动删除关联图片）

## 🔧 已实现的功能

✅ 七牛云 SDK 集成  
✅ 单文件和多文件上传  
✅ 文件删除（单个和批量）  
✅ 自动生成唯一文件名  
✅ 支持多个七牛云区域  
✅ JWT 认证保护  
✅ 推荐管理集成图片上传  
✅ 删除推荐时自动清理图片  
✅ 前端 API 工具函数  
✅ Ant Design Upload 组件示例  

## 📁 文件结构

```
apps/
├── backend/
│   ├── src/
│   │   ├── qiniu/                    # 七牛云模块
│   │   │   ├── qiniu.module.ts
│   │   │   └── qiniu.service.ts
│   │   ├── upload/                   # 上传模块
│   │   │   ├── upload.module.ts
│   │   │   └── upload.controller.ts
│   │   └── recommendations/          # 推荐模块（已集成图片上传）
│   │       ├── recommendation.entity.ts
│   │       ├── recommendations.controller.ts
│   │       ├── recommendations.service.ts
│   │       ├── recommendations.module.ts
│   │       └── dto/
│   │           └── recommendation.dto.ts
│   ├── .env.example                  # 环境变量示例
│   ├── .env                          # 环境变量（需手动创建）
│   └── QINIU_UPLOAD_GUIDE.md        # 详细使用文档
└── portal/
    ├── lib/
    │   └── qiniu-api.ts              # API 工具函数
    └── app/admin/recommendations/
        └── components/
            └── RecommendationImageUpload.tsx  # 上传组件示例
```

## 🎯 使用场景

### 场景 1: 创建推荐时上传图片

```typescript
const data = {
  title: 'GitHub',
  url: 'https://github.com',
  icon: '🐙',
  category: 'Development',
  description: 'Code hosting platform',
};

const images = [file1, file2, file3]; // File 对象数组

await createRecommendationWithImages(data, images);
```

### 场景 2: 更新推荐时追加图片

```typescript
const newImages = [file4, file5]; // 新的图片文件

await updateRecommendationWithImages('recommendation-id', {}, newImages);
// 新图片会追加到现有图片列表
```

### 场景 3: 单独上传图片

```typescript
const files = [file1, file2];
const results = await uploadMultipleImages(files);
// results: [{ url: '...', key: '...' }, ...]
```

### 场景 4: 删除图片

```typescript
// 删除单个图片
await deleteSingleImage('http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/xxx.jpg');

// 删除多个图片
await deleteMultipleImages([url1, url2, url3]);
```

## ⚠️ 注意事项

1. **认证**: 所有上传接口都需要 JWT 认证
2. **文件限制**: 单次最多上传 10 个文件
3. **文件大小**: 建议在前端限制文件大小（如 5MB）
4. **文件类型**: 建议在前端验证文件类型
5. **环境变量**: 生产环境请妥善保管七牛云密钥

## 🔐 安全建议

- 将 `.env` 添加到 `.gitignore`（已添加）
- 定期更换七牛云密钥
- 在前端添加文件类型和大小验证
- 考虑添加上传频率限制
- 生产环境使用 HTTPS

## 📚 更多文档

详细文档请查看：`apps/backend/QINIU_UPLOAD_GUIDE.md`

## 🐛 故障排查

### 问题 1: 上传失败

- 检查七牛云配置是否正确
- 检查 JWT token 是否有效
- 检查文件大小和类型

### 问题 2: 图片无法访问

- 检查七牛云域名配置
- 检查七牛云存储空间权限
- 检查防火墙设置

### 问题 3: 编译错误

```bash
cd apps/backend
pnpm build
```

查看具体错误信息并修复。

## 🎉 完成！

现在你可以在 Recommendation Management 中使用七牛云上传多张图片了！

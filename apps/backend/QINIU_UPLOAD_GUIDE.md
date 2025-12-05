# 七牛云图片上传功能

## 概述

本项目已集成七牛云作为图片上传服务，支持在 Recommendation Management 中上传多张图片。

## 配置

### 1. 环境变量配置

在 `apps/backend/.env` 文件中配置七牛云相关参数：

```env
QINIU_ACCESS_KEY=dC3A-WosVq6wbQOJPTfY-DQff08hkcXj_KK8byKI
QINIU_SECRET_KEY=2sCgq3fS_ZSykVZ3IcpcBN-Mfow09utOb8_mEQ0U
QINIU_BUCKET=-launch-pad
QINIU_DOMAIN=http://t6mfwj8xf.hn-bkt.clouddn.com
QINIU_ZONE=z2
```

### 2. 区域配置说明

- `z0`: 华东
- `z1`: 华北
- `z2`: 华南
- `na0`: 北美
- `as0`: 东南亚

## API 接口

### 通用上传接口

#### 1. 上传单个文件

```http
POST /upload/single
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- file: 图片文件
```

响应：
```json
{
  "success": true,
  "data": {
    "url": "http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/1234567890-uuid.jpg",
    "key": "uploads/1234567890-uuid.jpg"
  }
}
```

#### 2. 上传多个文件

```http
POST /upload/multiple
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- files: 图片文件数组（最多10个）
```

响应：
```json
{
  "success": true,
  "data": [
    {
      "url": "http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/1234567890-uuid1.jpg",
      "key": "uploads/1234567890-uuid1.jpg"
    },
    {
      "url": "http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/1234567890-uuid2.jpg",
      "key": "uploads/1234567890-uuid2.jpg"
    }
  ]
}
```

#### 3. 删除单个文件

```http
DELETE /upload/single
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "url": "http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/1234567890-uuid.jpg"
}
```

#### 4. 删除多个文件

```http
DELETE /upload/multiple
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "urls": [
    "http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/1234567890-uuid1.jpg",
    "http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/1234567890-uuid2.jpg"
  ]
}
```

#### 5. 获取上传凭证（用于前端直传）

```http
POST /upload/token
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "key": "optional-custom-key" // 可选
}
```

响应：
```json
{
  "success": true,
  "data": {
    "token": "upload-token-string",
    "domain": "http://t6mfwj8xf.hn-bkt.clouddn.com"
  }
}
```

### Recommendations 接口

#### 1. 创建推荐（带图片）

```http
POST /recommendations
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- title: 标题
- url: 链接
- icon: 图标
- category: 分类
- description: 描述
- images: 图片文件数组（最多10个）
```

#### 2. 更新推荐（带图片）

```http
PUT /recommendations/:id
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- title: 标题（可选）
- url: 链接（可选）
- icon: 图标（可选）
- category: 分类（可选）
- description: 描述（可选）
- images: 新增图片文件数组（可选，会与现有图片合并）
```

#### 3. 删除推荐

```http
DELETE /recommendations/:id
Authorization: Bearer <token>
```

**注意**：删除推荐时会自动删除关联的所有图片。

## 前端使用示例

### 使用 FormData 上传

```typescript
// 上传单个文件
const uploadSingle = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/upload/single', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return await response.json();
};

// 上传多个文件
const uploadMultiple = async (files: File[]) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch('/upload/multiple', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return await response.json();
};

// 创建推荐并上传图片
const createRecommendation = async (data: any, images: File[]) => {
  const formData = new FormData();
  
  // 添加文本字段
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  
  // 添加图片文件
  images.forEach(image => {
    formData.append('images', image);
  });

  const response = await fetch('/recommendations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return await response.json();
};
```

### 使用 Ant Design Upload 组件

```tsx
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const ImageUpload = () => {
  const [fileList, setFileList] = useState([]);

  const uploadProps = {
    name: 'images',
    action: '/upload/multiple',
    headers: {
      authorization: `Bearer ${token}`,
    },
    multiple: true,
    maxCount: 10,
    onChange(info) {
      setFileList(info.fileList);
      
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  return (
    <Upload {...uploadProps} fileList={fileList}>
      <Button icon={<UploadOutlined />}>上传图片</Button>
    </Upload>
  );
};
```

## 技术架构

### 模块结构

```
apps/backend/src/
├── qiniu/                    # 七牛云模块
│   ├── qiniu.module.ts      # 模块定义
│   └── qiniu.service.ts     # 七牛云服务
├── upload/                   # 上传模块
│   ├── upload.module.ts     # 模块定义
│   └── upload.controller.ts # 上传控制器
└── recommendations/          # 推荐模块
    ├── recommendation.entity.ts    # 实体定义
    ├── recommendations.controller.ts # 控制器
    ├── recommendations.service.ts    # 服务
    ├── recommendations.module.ts     # 模块定义
    └── dto/
        └── recommendation.dto.ts     # 数据传输对象
```

### 核心功能

1. **QiniuService**: 封装七牛云 SDK，提供文件上传、删除等功能
2. **UploadController**: 提供通用的文件上传接口
3. **RecommendationsController**: 集成图片上传功能到推荐管理

### 特性

- ✅ 支持单文件和多文件上传
- ✅ 自动生成唯一文件名
- ✅ 支持多个七牛云区域
- ✅ 删除推荐时自动清理关联图片
- ✅ 更新推荐时支持追加图片
- ✅ JWT 认证保护
- ✅ 完整的错误处理

## 注意事项

1. 所有上传接口都需要 JWT 认证
2. 单次最多上传 10 个文件
3. 文件会自动重命名为 `uploads/{timestamp}-{uuid}.{ext}` 格式
4. 删除推荐时会自动删除关联的所有图片
5. 更新推荐时上传的新图片会与现有图片合并，不会覆盖

## 安全建议

1. 在生产环境中，建议将 `.env` 文件添加到 `.gitignore`
2. 定期更换七牛云的 AccessKey 和 SecretKey
3. 考虑添加文件大小限制和文件类型验证
4. 建议在前端也添加文件类型和大小的验证

## 扩展功能

如需添加以下功能，可以参考：

1. **图片压缩**: 在上传前使用 sharp 库压缩图片
2. **文件类型验证**: 添加 MIME 类型检查
3. **文件大小限制**: 配置 multer 的 limits 选项
4. **图片水印**: 使用七牛云的图片处理功能
5. **CDN 加速**: 配置七牛云的 CDN 域名

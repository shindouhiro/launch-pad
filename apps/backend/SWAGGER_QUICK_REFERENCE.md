# Swagger API 文档 - 快速参考

## 🚀 快速访问

```
http://localhost:3001/api-docs
```

## 📋 接口概览

### 认证接口 (auth)
- `POST /auth/login` - 用户登录

### 推荐管理 (recommendations)
- `GET /recommendations` - 获取所有推荐 ⭐ 无需认证
- `POST /recommendations` - 创建推荐（支持图片上传）🔐
- `PUT /recommendations/{id}` - 更新推荐（支持追加图片）🔐
- `DELETE /recommendations/{id}` - 删除推荐（自动删除关联图片）🔐

### 图片上传 (upload)
- `POST /upload/single` - 上传单个图片 🔐
- `POST /upload/multiple` - 上传多个图片 🔐
- `DELETE /upload/single` - 删除单个图片 🔐
- `DELETE /upload/multiple` - 删除多个图片 🔐
- `POST /upload/token` - 获取上传凭证 🔐

🔐 = 需要 JWT 认证

## 🔑 认证流程

### 1. 获取 Token

**请求：**
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```

**响应：**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. 设置认证

在 Swagger 页面：
1. 点击右上角 **Authorize** 按钮
2. 输入：`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. 点击 **Authorize**
4. 点击 **Close**

## 📤 文件上传示例

### 上传单个图片

**接口：** `POST /upload/single`

**步骤：**
1. 点击 "Try it out"
2. 点击 "Choose File" 选择图片
3. 点击 "Execute"

**响应：**
```json
{
  "success": true,
  "data": {
    "url": "http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/1733370000000-uuid.jpg",
    "key": "uploads/1733370000000-uuid.jpg"
  }
}
```

### 创建推荐并上传图片

**接口：** `POST /recommendations`

**步骤：**
1. 点击 "Try it out"
2. 填写表单：
   - title: `GitHub`
   - url: `https://github.com`
   - icon: `🐙`
   - category: `Development`
   - description: `Code hosting platform`
3. 选择图片文件（可选，最多10张）
4. 点击 "Execute"

**响应：**
```json
{
  "id": "uuid-here",
  "title": "GitHub",
  "url": "https://github.com",
  "icon": "🐙",
  "category": "Development",
  "description": "Code hosting platform",
  "images": [
    "http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/xxx1.jpg",
    "http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/xxx2.jpg"
  ]
}
```

## 🎯 常用操作

### 查看所有推荐

**接口：** `GET /recommendations`

**特点：** 无需认证

**响应：**
```json
[
  {
    "id": "1",
    "title": "GitHub",
    "url": "https://github.com",
    "icon": "🐙",
    "category": "Development",
    "description": "Code hosting and collaboration",
    "images": []
  }
]
```

### 更新推荐并追加图片

**接口：** `PUT /recommendations/{id}`

**说明：** 新上传的图片会追加到现有图片列表，不会覆盖

**步骤：**
1. 在路径参数中输入推荐 ID
2. 填写要更新的字段（可选）
3. 选择新图片（可选）
4. 点击 "Execute"

### 删除推荐

**接口：** `DELETE /recommendations/{id}`

**说明：** 删除推荐时会自动删除七牛云上的所有关联图片

**步骤：**
1. 在路径参数中输入推荐 ID
2. 点击 "Execute"

## 💡 提示

### Swagger UI 功能

- **Try it out** - 启用接口测试
- **Execute** - 执行请求
- **Clear** - 清除输入
- **Download** - 下载响应

### 查看请求详情

执行接口后可以看到：
- **Request URL** - 实际请求的 URL
- **Curl** - 等效的 curl 命令
- **Request headers** - 请求头
- **Request body** - 请求体
- **Response body** - 响应体
- **Response headers** - 响应头
- **Response code** - HTTP 状态码

### 导出 API 定义

访问以下地址获取 OpenAPI JSON：
```
http://localhost:3001/api-docs-json
```

可以导入到：
- Postman
- Insomnia
- API 测试工具

## 🐛 故障排查

### 401 Unauthorized

**原因：** 未设置认证或 token 过期

**解决：**
1. 重新登录获取新 token
2. 点击 Authorize 设置认证

### 400 Bad Request

**原因：** 请求参数错误

**解决：**
1. 检查必填字段
2. 检查数据格式
3. 查看错误消息

### 文件上传失败

**原因：** 文件字段名称错误或文件过大

**解决：**
1. 单个文件使用 `file` 字段
2. 多个文件使用 `files` 字段
3. 检查文件大小限制

## 📚 相关文档

- [Swagger 详细使用指南](./SWAGGER_GUIDE.md)
- [七牛云上传文档](./QINIU_UPLOAD_GUIDE.md)
- [快速开始](../../QINIU_QUICK_START.md)

## ✨ 总结

Swagger 提供了：
- ✅ 完整的 API 文档
- ✅ 交互式测试界面
- ✅ JWT 认证支持
- ✅ 文件上传测试
- ✅ 实时响应预览

立即访问 `http://localhost:3001/api-docs` 开始使用！

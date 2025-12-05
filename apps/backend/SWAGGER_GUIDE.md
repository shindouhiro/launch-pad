# Swagger API 文档使用指南

## 访问 Swagger 文档

启动后端服务后，访问以下地址查看 API 文档：

```
http://localhost:3001/api-docs
```

## 功能特性

### ✨ 主要功能

- 📚 **交互式 API 文档** - 可视化的 API 接口文档
- 🔐 **JWT 认证支持** - 直接在文档中测试需要认证的接口
- 🧪 **在线测试** - 直接在浏览器中测试所有 API
- 📝 **详细说明** - 每个接口都有完整的参数说明和示例
- 🏷️ **接口分类** - 按功能模块分类展示

### 📋 接口分类

#### 1. **auth** - 认证相关接口
- 用户登录
- 用户注册

#### 2. **recommendations** - 推荐管理接口
- 获取所有推荐
- 创建推荐（支持图片上传）
- 更新推荐（支持追加图片）
- 删除推荐（自动删除关联图片）

#### 3. **upload** - 七牛云图片上传接口
- 上传单个图片
- 上传多个图片
- 删除单个图片
- 删除多个图片
- 获取上传凭证

## 使用步骤

### 1. 启动后端服务

```bash
cd apps/backend
pnpm dev
```

### 2. 访问 Swagger 文档

打开浏览器访问：`http://localhost:3001/api-docs`

### 3. 获取 JWT Token

#### 方法一：使用 Swagger 界面

1. 找到 **auth** 分类下的 **POST /auth/login** 接口
2. 点击 "Try it out"
3. 输入登录信息：
   ```json
   {
     "username": "admin",
     "password": "admin"
   }
   ```
4. 点击 "Execute"
5. 从响应中复制 `access_token`

#### 方法二：使用 curl

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### 4. 设置认证

1. 点击页面右上角的 **Authorize** 按钮（或锁形图标）
2. 在弹出的对话框中输入：`Bearer <your-token>`
3. 点击 "Authorize"
4. 点击 "Close"

现在你可以测试所有需要认证的接口了！

### 5. 测试上传接口

#### 上传单个图片

1. 找到 **upload** 分类下的 **POST /upload/single** 接口
2. 点击 "Try it out"
3. 点击 "Choose File" 选择图片
4. 点击 "Execute"
5. 查看响应中的图片 URL

#### 上传多个图片

1. 找到 **upload** 分类下的 **POST /upload/multiple** 接口
2. 点击 "Try it out"
3. 点击 "Add string item" 添加多个文件
4. 为每个文件选择图片
5. 点击 "Execute"

#### 创建推荐并上传图片

1. 找到 **recommendations** 分类下的 **POST /recommendations** 接口
2. 点击 "Try it out"
3. 填写推荐信息：
   - title: GitHub
   - url: https://github.com
   - icon: 🐙
   - category: Development
   - description: Code hosting platform
4. 选择要上传的图片文件
5. 点击 "Execute"

## Swagger 配置说明

### main.ts 配置

```typescript
const config = new DocumentBuilder()
  .setTitle('Launch Pad API')
  .setDescription('Launch Pad 应用的 API 文档')
  .setVersion('1.0')
  .addTag('auth', '认证相关接口')
  .addTag('recommendations', '推荐管理接口')
  .addTag('upload', '七牛云图片上传接口')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: '输入 JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .build();
```

### 控制器装饰器

#### 类级别装饰器

```typescript
@ApiTags('recommendations')  // 设置接口分类
@Controller('recommendations')
@ApiBearerAuth('JWT-auth')  // 标记需要 JWT 认证
export class RecommendationsController {}
```

#### 方法级别装饰器

```typescript
@Get()
@ApiOperation({ 
  summary: '获取所有推荐', 
  description: '获取推荐列表，无需认证' 
})
@ApiResponse({ 
  status: 200, 
  description: '成功返回推荐列表', 
  type: [Recommendation] 
})
findAll(): Recommendation[] {
  return this.recommendationsService.findAll();
}
```

#### 文件上传装饰器

```typescript
@Post()
@ApiConsumes('multipart/form-data')
@ApiBody({
  description: '推荐数据和图片文件',
  schema: {
    type: 'object',
    properties: {
      title: { type: 'string', example: 'GitHub' },
      images: {
        type: 'array',
        items: { type: 'string', format: 'binary' },
      },
    },
  },
})
async create(@Body() data, @UploadedFiles() files) {}
```

### 实体装饰器

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Recommendation {
  @ApiProperty({ description: '推荐ID', example: '1' })
  id: string;

  @ApiProperty({ description: '标题', example: 'GitHub' })
  title: string;

  @ApiPropertyOptional({ description: '图片URL数组', type: [String] })
  images?: string[];
}
```

## 常见问题

### Q1: 如何测试需要认证的接口？

A: 先调用登录接口获取 token，然后点击右上角的 "Authorize" 按钮，输入 `Bearer <token>`。

### Q2: 上传文件时显示 400 错误？

A: 确保：
1. 已经设置了认证 token
2. 文件字段名称正确（单个文件用 `file`，多个文件用 `files`）
3. 文件大小不超过限制

### Q3: 如何查看请求和响应的详细信息？

A: 执行接口后，Swagger 会显示：
- Request URL - 请求地址
- Request Headers - 请求头
- Request Body - 请求体
- Response - 响应内容
- Response Headers - 响应头

### Q4: 如何导出 API 文档？

A: Swagger 提供了导出功能：
1. 访问 `http://localhost:3001/api-docs-json` 获取 JSON 格式
2. 可以导入到 Postman 或其他 API 工具

### Q5: 生产环境是否应该开启 Swagger？

A: 建议：
- 开发环境：开启
- 测试环境：开启
- 生产环境：根据需要决定，可以通过环境变量控制

```typescript
// 仅在非生产环境开启 Swagger
if (process.env.NODE_ENV !== 'production') {
  const config = new DocumentBuilder()...
  SwaggerModule.setup('api-docs', app, document);
}
```

## 高级功能

### 1. 持久化认证

Swagger 配置中已启用 `persistAuthorization: true`，这意味着刷新页面后认证信息会保留。

### 2. 接口排序

```typescript
swaggerOptions: {
  tagsSorter: 'alpha',      // 按字母顺序排序标签
  operationsSorter: 'alpha', // 按字母顺序排序操作
}
```

### 3. 自定义主题

可以通过 `customCss` 选项自定义 Swagger UI 的样式：

```typescript
SwaggerModule.setup('api-docs', app, document, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Launch Pad API 文档',
});
```

## 相关资源

- [Swagger 官方文档](https://swagger.io/docs/)
- [NestJS Swagger 文档](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI 规范](https://spec.openapis.org/oas/latest.html)

## 总结

Swagger 为我们提供了：

✅ 自动生成的 API 文档  
✅ 交互式的接口测试  
✅ 清晰的接口说明  
✅ 便捷的认证测试  
✅ 文件上传测试支持  

现在你可以通过访问 `http://localhost:3001/api-docs` 来查看和测试所有 API 接口了！

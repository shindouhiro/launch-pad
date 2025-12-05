# Launch Pad

[![CI Tests](https://github.com/shindouhiro/launch-pad/workflows/CI%20Tests/badge.svg)](https://github.com/shindouhiro/launch-pad/actions)
[![Docker Build](https://github.com/shindouhiro/launch-pad/workflows/Build%20and%20Push%20Docker%20Images/badge.svg)](https://github.com/shindouhiro/launch-pad/actions)
[![Release](https://github.com/shindouhiro/launch-pad/workflows/Release/badge.svg)](https://github.com/shindouhiro/launch-pad/actions)

一个基于 Monorepo 架构的全栈应用，包含推荐管理系统和七牛云图片上传功能。

## 技术栈

+ 使用 Monorepo 架构
+ 前端使用 Next.js + Ant Design Pro
+ 后端使用 NestJS + TypeORM
+ 数据库使用 PostgreSQL
+ 图片存储使用七牛云
+ 容器化部署使用 Docker

## 功能特性

+ ✅ 用户登录认证
+ ✅ 后台管理系统
+ ✅ 推荐管理（支持多图片上传和封面设置）
+ ✅ 推荐展示页面（无需登录）
+ ✅ 七牛云图片上传
+ ✅ 国际化支持（中英文）
+ ✅ Swagger API 文档
+ ✅ Docker 容器化部署
+ ✅ GitHub Actions CI/CD

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

```bash
cd apps/backend
cp .env.example .env
# 编辑 .env 文件，配置七牛云密钥
```

### 3. 启动开发服务器

```bash
# 启动前后端
pnpm dev
```

前端: http://localhost:3000  
后端: http://localhost:3001  
**API 文档: http://localhost:3001/api-docs** 📚

## API 文档

本项目使用 Swagger/OpenAPI 提供交互式 API 文档。

### 访问 Swagger 文档

启动后端服务后，访问：`http://localhost:3001/api-docs`

### 主要功能

- 📚 可视化的 API 接口文档
- 🔐 支持 JWT 认证测试
- 🧪 在线测试所有 API
- 📝 详细的参数说明和示例
- 📤 支持文件上传测试

### 使用步骤

1. 访问 Swagger 文档页面
2. 使用登录接口获取 JWT token
3. 点击右上角 "Authorize" 按钮设置认证
4. 测试各个 API 接口

详细使用指南：[Swagger 使用文档](./apps/backend/SWAGGER_GUIDE.md)

## 七牛云图片上传

本项目已集成七牛云作为图片存储服务，支持在推荐管理中上传多张图片。

### 快速开始

查看详细文档：
- [快速开始指南](./QINIU_QUICK_START.md)
- [详细使用文档](./apps/backend/QINIU_UPLOAD_GUIDE.md)
- [实现总结](./IMPLEMENTATION_SUMMARY.md)

### API 测试

导入 `Qiniu_Upload_API.postman_collection.json` 到 Postman 进行 API 测试。

### 测试脚本

```bash
./test-qiniu-setup.sh
```

## 项目结构

```
launch-pad/
├── apps/
│   ├── backend/          # NestJS 后端
│   │   ├── src/
│   │   │   ├── qiniu/    # 七牛云模块
│   │   │   ├── upload/   # 上传模块
│   │   │   └── recommendations/  # 推荐管理
│   │   └── .env          # 环境配置
│   └── portal/           # Next.js 前端
│       ├── app/
│       └── lib/
├── QINIU_QUICK_START.md  # 七牛云快速开始
└── package.json
```

## 文档

- [国际化指南](./I18N_GUIDE.md)
- [使用说明](./USAGE.md)
- [七牛云快速开始](./QINIU_QUICK_START.md)
- [七牛云详细文档](./apps/backend/QINIU_UPLOAD_GUIDE.md)
- [Swagger API 文档](./apps/backend/SWAGGER_GUIDE.md)
- [Docker 部署指南](./DOCKER_DEPLOYMENT_GUIDE.md)
- [GitHub Actions CI/CD 指南](./GITHUB_ACTIONS_GUIDE.md)

## 🚀 CI/CD

本项目使用 GitHub Actions 实现自动化 CI/CD：

### 自动化流程

- ✅ **持续集成** - 自动运行测试和代码检查
- ✅ **Docker 构建** - 自动构建和推送镜像到 Docker Hub
- ✅ **版本发布** - 创建 tag 自动发布新版本

### 快速开始

1. **配置 Secrets**
   ```
   GitHub 仓库 → Settings → Secrets → Actions
   添加 DOCKER_PASSWORD
   ```

2. **推送代码触发构建**
   ```bash
   git push origin main
   ```

3. **创建版本发布**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

详细配置：[GitHub Actions 指南](./GITHUB_ACTIONS_GUIDE.md)

## 🐳 Docker 部署

### 快速启动

```bash
# 启动所有服务（PostgreSQL + 后端 + 前端）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 构建和推送镜像

```bash
# 构建并推送到 Docker Hub
./docker-build-push.sh

# 或指定版本
./docker-build-push.sh v1.0.0
```

### Docker Hub 镜像

- 后端: `shindouhiro/launchpad-backend`
- 前端: `shindouhiro/launchpad-frontend`

详细部署文档：[Docker 部署指南](./DOCKER_DEPLOYMENT_GUIDE.md)

## License

UNLICENSED



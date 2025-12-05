# Docker 部署指南

## 📋 概述

本项目使用 Docker 和 Docker Compose 进行容器化部署，包含以下服务：
- **PostgreSQL**: 数据库服务
- **Backend**: NestJS 后端服务
- **Frontend**: Next.js 前端服务

## 🚀 快速开始

### 1. 环境准备

确保已安装：
- Docker (>= 20.10)
- Docker Compose (>= 2.0)

### 2. 配置环境变量

复制环境变量示例文件：

```bash
cp apps/backend/.env.example apps/backend/.env
```

编辑 `.env` 文件，配置必要的环境变量（特别是七牛云配置）。

### 3. 启动服务

使用 Docker Compose 启动所有服务：

```bash
docker-compose up -d
```

服务访问地址：
- 前端: http://localhost:3000
- 后端: http://localhost:3001
- API 文档: http://localhost:3001/api-docs
- PostgreSQL: localhost:5432

### 4. 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### 5. 停止服务

```bash
# 停止服务
docker-compose stop

# 停止并删除容器
docker-compose down

# 停止并删除容器和数据卷
docker-compose down -v
```

## 🏗️ 构建和推送镜像

### 自动构建和推送

使用提供的脚本一键构建和推送：

```bash
# 构建并推送 latest 版本
./docker-build-push.sh

# 构建并推送指定版本
./docker-build-push.sh v1.0.0
```

### 手动构建

#### 构建后端镜像

```bash
cd apps/backend
docker build -t shindouhiro/launchpad-backend:latest .
docker push shindouhiro/launchpad-backend:latest
```

#### 构建前端镜像

```bash
cd apps/portal
docker build -t shindouhiro/launchpad-frontend:latest .
docker push shindouhiro/launchpad-frontend:latest
```

## 📦 Docker Hub 镜像

### 镜像地址

- **后端**: `shindouhiro/launchpad-backend`
- **前端**: `shindouhiro/launchpad-frontend`

### 拉取镜像

```bash
# 拉取后端镜像
docker pull shindouhiro/launchpad-backend:latest

# 拉取前端镜像
docker pull shindouhiro/launchpad-frontend:latest
```

### 使用预构建镜像

修改 `docker-compose.yml`，将 `build` 部分替换为 `image`：

```yaml
services:
  backend:
    image: shindouhiro/launchpad-backend:latest
    # 移除 build 配置
    ...

  frontend:
    image: shindouhiro/launchpad-frontend:latest
    # 移除 build 配置
    ...
```

然后运行：

```bash
docker-compose up -d
```

## 🗄️ 数据库管理

### 连接数据库

```bash
# 进入 PostgreSQL 容器
docker-compose exec postgres psql -U postgres -d launchpad

# 或使用外部工具连接
# Host: localhost
# Port: 5432
# Database: launchpad
# Username: postgres
# Password: postgres
```

### 备份数据库

```bash
# 备份数据库
docker-compose exec postgres pg_dump -U postgres launchpad > backup.sql

# 恢复数据库
docker-compose exec -T postgres psql -U postgres launchpad < backup.sql
```

### 数据持久化

数据库数据存储在 Docker volume `postgres_data` 中，即使删除容器数据也不会丢失。

要完全清除数据：

```bash
docker-compose down -v
```

## 🔧 配置说明

### 环境变量

#### 后端环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `DB_HOST` | 数据库主机 | `postgres` |
| `DB_PORT` | 数据库端口 | `5432` |
| `DB_USERNAME` | 数据库用户名 | `postgres` |
| `DB_PASSWORD` | 数据库密码 | `postgres` |
| `DB_DATABASE` | 数据库名称 | `launchpad` |
| `PORT` | 后端端口 | `3001` |
| `NODE_ENV` | 运行环境 | `production` |
| `JWT_SECRET` | JWT 密钥 | - |
| `QINIU_ACCESS_KEY` | 七牛云 AccessKey | - |
| `QINIU_SECRET_KEY` | 七牛云 SecretKey | - |
| `QINIU_BUCKET` | 七牛云存储桶 | - |
| `QINIU_DOMAIN` | 七牛云域名 | - |
| `QINIU_ZONE` | 七牛云区域 | `z2` |

#### 前端环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_API_URL` | 后端 API 地址 | `http://backend:3001` |

### 端口映射

| 服务 | 容器端口 | 主机端口 |
|------|----------|----------|
| Frontend | 3000 | 3000 |
| Backend | 3001 | 3001 |
| PostgreSQL | 5432 | 5432 |

## 🔍 故障排查

### 后端无法连接数据库

1. 检查数据库容器是否正常运行：
   ```bash
   docker-compose ps postgres
   ```

2. 检查数据库健康状态：
   ```bash
   docker-compose exec postgres pg_isready -U postgres
   ```

3. 查看后端日志：
   ```bash
   docker-compose logs backend
   ```

### 前端无法访问后端

1. 检查后端容器是否正常运行：
   ```bash
   docker-compose ps backend
   ```

2. 测试后端 API：
   ```bash
   curl http://localhost:3001
   ```

3. 检查环境变量配置

### 镜像构建失败

1. 清理 Docker 缓存：
   ```bash
   docker system prune -a
   ```

2. 重新构建：
   ```bash
   docker-compose build --no-cache
   ```

## 📊 性能优化

### 多阶段构建

Dockerfile 使用多阶段构建，减小镜像大小：
- 后端镜像: ~200MB
- 前端镜像: ~150MB

### 健康检查

所有服务都配置了健康检查，确保服务正常运行后才接受流量。

### 资源限制

可以在 `docker-compose.yml` 中添加资源限制：

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## 🚢 生产部署建议

### 1. 使用环境变量文件

创建 `.env.production` 文件：

```bash
# 数据库配置
DB_PASSWORD=strong-password-here

# JWT 配置
JWT_SECRET=strong-secret-here

# 七牛云配置
QINIU_ACCESS_KEY=your-access-key
QINIU_SECRET_KEY=your-secret-key
```

### 2. 使用 HTTPS

配置 Nginx 反向代理或使用 Traefik 自动管理 SSL 证书。

### 3. 数据库备份

设置定时任务备份数据库：

```bash
# 添加到 crontab
0 2 * * * docker-compose exec postgres pg_dump -U postgres launchpad > /backup/launchpad-$(date +\%Y\%m\%d).sql
```

### 4. 监控和日志

- 使用 Prometheus + Grafana 监控
- 使用 ELK Stack 收集日志
- 配置告警通知

### 5. 更新策略

```bash
# 拉取最新镜像
docker-compose pull

# 重启服务
docker-compose up -d
```

## 📝 开发模式

本地开发时，可以使用 volume 挂载实现热重载：

```yaml
services:
  backend:
    volumes:
      - ./apps/backend/src:/app/src
    command: pnpm dev
```

## 🔗 相关链接

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [PostgreSQL Docker 镜像](https://hub.docker.com/_/postgres)
- [Node.js Docker 最佳实践](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

## ✅ 检查清单

部署前检查：

- [ ] 环境变量已配置
- [ ] 七牛云配置正确
- [ ] JWT 密钥已设置
- [ ] 数据库密码已修改
- [ ] 端口未被占用
- [ ] Docker 和 Docker Compose 已安装
- [ ] 有足够的磁盘空间

## 🎉 完成

现在你可以使用 Docker 轻松部署 Launch Pad 应用了！

如有问题，请查看日志或提交 Issue。

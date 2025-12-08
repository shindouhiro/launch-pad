# Docker 构建说明

## 构建策略

两个 Dockerfile 都采用了**在容器内安装依赖**的策略，而不是从宿主机复制 node_modules。

### 优点

1. **避免平台差异** - 确保依赖在目标平台（Linux）上正确编译
2. **简化构建** - 不需要处理 monorepo 的复杂 lockfile 路径
3. **缓存友好** - Docker 层缓存可以加速重复构建
4. **更小的镜像** - 生产阶段只安装生产依赖

## Backend Dockerfile

### 构建阶段
```dockerfile
FROM node:20-alpine AS builder
RUN npm install -g pnpm@8
COPY . .
RUN pnpm install --no-frozen-lockfile
RUN pnpm build
```

### 生产阶段
```dockerfile
FROM node:20-alpine
COPY package.json ./
RUN pnpm install --prod --no-frozen-lockfile
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main.js"]
```

**特点:**
- 使用 `--no-frozen-lockfile` 避免 lockfile 路径问题
- 生产阶段只安装生产依赖 (`--prod`)
- 包含健康检查
- 暴露 3001 端口

## Frontend Dockerfile

### 构建阶段
```dockerfile
FROM node:20-alpine AS builder
RUN npm install -g pnpm@8
COPY . .
RUN pnpm install --no-frozen-lockfile
RUN pnpm build
```

### 生产阶段
```dockerfile
FROM node:20-alpine AS runner
COPY package.json ./
RUN pnpm install --prod --no-frozen-lockfile
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
CMD ["node", "server.js"]
```

**特点:**
- Next.js standalone 输出模式
- 创建非 root 用户运行
- 包含健康检查
- 暴露 3000 端口

## .dockerignore 配置

两个应用都忽略以下内容：

```
node_modules      # 不复制本地依赖
.next            # 不复制本地构建产物
.git             # 不复制 git 历史
.env*            # 不复制环境变量文件
dist             # 不复制本地构建产物
```

## 本地构建测试

### Backend
```bash
cd apps/backend
docker build -t launchpad-backend .
docker run -p 3001:3001 launchpad-backend
```

### Frontend
```bash
cd apps/portal
docker build -t launchpad-frontend .
docker run -p 3000:3000 launchpad-frontend
```

## CI/CD 构建

GitHub Actions 会自动：
1. 在 `main`, `develop`, `dev` 分支推送时构建
2. 推送到 Docker Hub
3. 打上对应的标签 (`latest`, `develop`, `dev`)

## 优化建议

### 当前策略（开发阶段）
- ✅ 简单直接
- ✅ 避免 monorepo lockfile 问题
- ⚠️ 每次都重新安装依赖（较慢）

### 未来优化（生产阶段）
可以考虑：
1. 使用 pnpm fetch 预下载依赖
2. 使用 Docker 缓存挂载
3. 使用 workspace 协议优化 monorepo 构建

```dockerfile
# 示例：使用缓存挂载
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
```

## 故障排查

### 问题：依赖安装失败
**解决：** 检查 package.json 中的依赖版本

### 问题：构建产物缺失
**解决：** 确保 `pnpm build` 成功执行

### 问题：运行时错误
**解决：** 检查环境变量配置

## 环境变量

### Backend
- `NODE_ENV=production`
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `JWT_SECRET`

### Frontend  
- `NODE_ENV=production`
- `NEXT_PUBLIC_API_URL`
- `PORT=3000`
- `HOSTNAME=0.0.0.0`

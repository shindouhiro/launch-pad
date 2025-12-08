# 多阶段构建 - 构建阶段
FROM node:20-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm@8

WORKDIR /app

# 复制所有文件
COPY . .

# 安装依赖（不使用 frozen-lockfile，因为是 monorepo）
RUN pnpm install --no-frozen-lockfile

# 构建应用
RUN pnpm build

# 生产阶段
FROM node:20-alpine

# 安装 pnpm
RUN npm install -g pnpm@8

WORKDIR /app

# 复制 package.json
COPY package.json ./

# 只安装生产依赖
RUN pnpm install --prod --no-frozen-lockfile

# 从构建阶段复制构建产物
COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE 3001

# 设置环境变量
ENV NODE_ENV=production

# 健康检查（使用 wget，alpine 自带）
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/ || exit 1

# 启动应用
CMD ["node", "dist/main.js"]

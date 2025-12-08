# 多阶段构建 - 构建阶段
FROM node:20-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm@8

WORKDIR /app

# 复制所有文件
COPY . .

# 安装依赖（不使用 frozen-lockfile）
RUN pnpm install --no-frozen-lockfile

# 构建应用
RUN pnpm build

# 生产阶段
FROM node:20-alpine AS runner

# 安装 pnpm
RUN npm install -g pnpm@8

WORKDIR /app

ENV NODE_ENV=production

# 创建用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制 package.json
COPY package.json ./

# 只安装生产依赖
RUN pnpm install --prod --no-frozen-lockfile

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 设置权限
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]

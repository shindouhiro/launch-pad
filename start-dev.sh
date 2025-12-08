#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  启动开发环境${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 1. 启动 PostgreSQL
echo -e "${YELLOW}1. 启动 PostgreSQL 容器...${NC}"
docker-compose up -d postgres

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ PostgreSQL 启动失败${NC}"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL 已启动${NC}"
echo ""

# 2. 等待 PostgreSQL 就绪
echo -e "${YELLOW}2. 等待 PostgreSQL 就绪...${NC}"
sleep 3

# 检查 PostgreSQL 健康状态
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PostgreSQL 已就绪${NC}"
        break
    fi
    
    if [ $i -eq 30 ]; then
        echo -e "${RED}✗ PostgreSQL 启动超时${NC}"
        exit 1
    fi
    
    echo -n "."
    sleep 1
done

echo ""
echo ""

# 3. 启动后端
echo -e "${YELLOW}3. 启动后端服务...${NC}"
cd apps/backend
pnpm dev &
BACKEND_PID=$!
cd ../..

echo -e "${GREEN}✓ 后端服务已启动 (PID: $BACKEND_PID)${NC}"
echo ""

# 4. 等待后端就绪
echo -e "${YELLOW}4. 等待后端就绪...${NC}"
sleep 5

echo ""

# 5. 启动前端
echo -e "${YELLOW}5. 启动前端服务...${NC}"
cd apps/portal
pnpm dev &
FRONTEND_PID=$!
cd ../..

echo -e "${GREEN}✓ 前端服务已启动 (PID: $FRONTEND_PID)${NC}"
echo ""

# 显示服务信息
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  服务信息${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}PostgreSQL:${NC} localhost:5432"
echo -e "${GREEN}后端:${NC}       http://localhost:3001"
echo -e "${GREEN}前端:${NC}       http://localhost:3000"
echo -e "${GREEN}API 文档:${NC}   http://localhost:3001/api-docs"
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  停止服务${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}停止所有服务:${NC}"
echo -e "  kill $BACKEND_PID $FRONTEND_PID"
echo -e "  docker-compose stop postgres"
echo ""
echo -e "${YELLOW}或使用 Ctrl+C 停止${NC}"
echo ""

# 等待用户中断
wait

#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Launch Pad 快速启动脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查 Docker 是否安装
echo -e "${YELLOW}检查 Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker 未安装，请先安装 Docker${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker 已安装${NC}"

# 检查 Docker Compose 是否安装
echo -e "${YELLOW}检查 Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}✗ Docker Compose 未安装，请先安装 Docker Compose${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose 已安装${NC}"
echo ""

# 检查环境变量文件
echo -e "${YELLOW}检查环境配置...${NC}"
if [ ! -f "apps/backend/.env" ]; then
    echo -e "${YELLOW}创建环境配置文件...${NC}"
    cp apps/backend/.env.example apps/backend/.env
    echo -e "${GREEN}✓ 已创建 .env 文件${NC}"
    echo -e "${YELLOW}⚠ 请编辑 apps/backend/.env 文件，配置七牛云密钥${NC}"
    echo ""
    read -p "是否现在编辑 .env 文件？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ${EDITOR:-vi} apps/backend/.env
    fi
else
    echo -e "${GREEN}✓ 环境配置文件已存在${NC}"
fi
echo ""

# 启动服务
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  启动服务${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "${YELLOW}启动 Docker Compose 服务...${NC}"
docker-compose up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ 服务启动失败${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 服务启动成功${NC}"
echo ""

# 等待服务就绪
echo -e "${YELLOW}等待服务就绪...${NC}"
sleep 5

# 检查服务状态
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  服务状态${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

docker-compose ps

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  访问地址${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}前端:${NC}      http://localhost:3000"
echo -e "${GREEN}后端:${NC}      http://localhost:3001"
echo -e "${GREEN}API 文档:${NC}  http://localhost:3001/api-docs"
echo -e "${GREEN}数据库:${NC}    localhost:5432"
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  常用命令${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}查看日志:${NC}"
echo -e "  docker-compose logs -f"
echo ""
echo -e "${YELLOW}停止服务:${NC}"
echo -e "  docker-compose stop"
echo ""
echo -e "${YELLOW}重启服务:${NC}"
echo -e "  docker-compose restart"
echo ""
echo -e "${YELLOW}删除服务:${NC}"
echo -e "  docker-compose down"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ Launch Pad 已启动！${NC}"
echo -e "${GREEN}========================================${NC}"

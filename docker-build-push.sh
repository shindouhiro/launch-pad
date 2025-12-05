#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Docker Hub 用户名
DOCKER_USERNAME="shindouhiro"

# 镜像名称和版本
BACKEND_IMAGE="${DOCKER_USERNAME}/launchpad-backend"
FRONTEND_IMAGE="${DOCKER_USERNAME}/launchpad-frontend"
VERSION="${1:-latest}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Launch Pad Docker 镜像构建和推送${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查是否登录 Docker Hub
echo -e "${YELLOW}检查 Docker 登录状态...${NC}"
if ! docker info | grep -q "Username: ${DOCKER_USERNAME}"; then
    echo -e "${YELLOW}请登录 Docker Hub...${NC}"
    docker login
    if [ $? -ne 0 ]; then
        echo -e "${RED}Docker 登录失败${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✓ Docker 已登录${NC}"
echo ""

# 构建后端镜像
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  构建后端镜像${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${YELLOW}镜像名称: ${BACKEND_IMAGE}:${VERSION}${NC}"
echo ""

cd apps/backend
docker build -t ${BACKEND_IMAGE}:${VERSION} -t ${BACKEND_IMAGE}:latest .
if [ $? -ne 0 ]; then
    echo -e "${RED}后端镜像构建失败${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 后端镜像构建成功${NC}"
cd ../..
echo ""

# 构建前端镜像
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  构建前端镜像${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${YELLOW}镜像名称: ${FRONTEND_IMAGE}:${VERSION}${NC}"
echo ""

cd apps/portal
docker build -t ${FRONTEND_IMAGE}:${VERSION} -t ${FRONTEND_IMAGE}:latest .
if [ $? -ne 0 ]; then
    echo -e "${RED}前端镜像构建失败${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 前端镜像构建成功${NC}"
cd ../..
echo ""

# 推送镜像到 Docker Hub
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  推送镜像到 Docker Hub${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "${YELLOW}推送后端镜像...${NC}"
docker push ${BACKEND_IMAGE}:${VERSION}
docker push ${BACKEND_IMAGE}:latest
if [ $? -ne 0 ]; then
    echo -e "${RED}后端镜像推送失败${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 后端镜像推送成功${NC}"
echo ""

echo -e "${YELLOW}推送前端镜像...${NC}"
docker push ${FRONTEND_IMAGE}:${VERSION}
docker push ${FRONTEND_IMAGE}:latest
if [ $? -ne 0 ]; then
    echo -e "${RED}前端镜像推送失败${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 前端镜像推送成功${NC}"
echo ""

# 显示镜像信息
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  镜像信息${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}后端镜像:${NC}"
echo -e "  - ${BACKEND_IMAGE}:${VERSION}"
echo -e "  - ${BACKEND_IMAGE}:latest"
echo ""
echo -e "${GREEN}前端镜像:${NC}"
echo -e "  - ${FRONTEND_IMAGE}:${VERSION}"
echo -e "  - ${FRONTEND_IMAGE}:latest"
echo ""

# 显示拉取命令
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  使用方法${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}拉取镜像:${NC}"
echo -e "  docker pull ${BACKEND_IMAGE}:${VERSION}"
echo -e "  docker pull ${FRONTEND_IMAGE}:${VERSION}"
echo ""
echo -e "${YELLOW}使用 docker-compose 运行:${NC}"
echo -e "  docker-compose up -d"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ 所有镜像构建和推送完成！${NC}"
echo -e "${GREEN}========================================${NC}"

#!/bin/bash

# 七牛云上传功能测试脚本

echo "🧪 七牛云上传功能测试"
echo "===================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置
API_URL="http://localhost:3001"
TOKEN=""

# 检查后端是否运行
echo "1️⃣  检查后端服务..."
if curl -s "$API_URL" > /dev/null; then
    echo -e "${GREEN}✓ 后端服务正在运行${NC}"
else
    echo -e "${RED}✗ 后端服务未运行，请先启动: cd apps/backend && pnpm dev${NC}"
    exit 1
fi

# 检查环境变量
echo ""
echo "2️⃣  检查环境配置..."
if [ -f "apps/backend/.env" ]; then
    echo -e "${GREEN}✓ .env 文件存在${NC}"
    
    # 检查必要的配置项
    if grep -q "QINIU_ACCESS_KEY" apps/backend/.env && \
       grep -q "QINIU_SECRET_KEY" apps/backend/.env && \
       grep -q "QINIU_BUCKET" apps/backend/.env && \
       grep -q "QINIU_DOMAIN" apps/backend/.env; then
        echo -e "${GREEN}✓ 七牛云配置完整${NC}"
    else
        echo -e "${RED}✗ 七牛云配置不完整${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ .env 文件不存在，请先创建: cp apps/backend/.env.example apps/backend/.env${NC}"
    exit 1
fi

# 检查模块文件
echo ""
echo "3️⃣  检查模块文件..."
files=(
    "apps/backend/src/qiniu/qiniu.service.ts"
    "apps/backend/src/qiniu/qiniu.module.ts"
    "apps/backend/src/upload/upload.controller.ts"
    "apps/backend/src/upload/upload.module.ts"
    "apps/backend/src/recommendations/dto/recommendation.dto.ts"
)

all_files_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ $file 不存在${NC}"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    echo -e "${RED}部分文件缺失，请检查实现${NC}"
    exit 1
fi

# 检查文档
echo ""
echo "4️⃣  检查文档..."
docs=(
    "QINIU_QUICK_START.md"
    "IMPLEMENTATION_SUMMARY.md"
    "apps/backend/QINIU_UPLOAD_GUIDE.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✓ $doc${NC}"
    else
        echo -e "${YELLOW}⚠ $doc 不存在${NC}"
    fi
done

# 测试 API 端点（需要 token）
echo ""
echo "5️⃣  测试 API 端点..."
echo -e "${YELLOW}注意: 上传接口需要 JWT token，跳过实际上传测试${NC}"

# 测试获取推荐列表（不需要认证）
echo ""
echo "测试 GET /recommendations..."
response=$(curl -s -w "\n%{http_code}" "$API_URL/recommendations")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ GET /recommendations 成功${NC}"
    echo "响应: $body"
else
    echo -e "${RED}✗ GET /recommendations 失败 (HTTP $http_code)${NC}"
fi

# 总结
echo ""
echo "===================="
echo "✅ 测试完成！"
echo ""
echo "📚 下一步:"
echo "1. 启动后端: cd apps/backend && pnpm dev"
echo "2. 获取 JWT token (登录)"
echo "3. 使用 Postman 或 curl 测试上传功能"
echo "4. 查看文档: QINIU_QUICK_START.md"
echo ""

#!/bin/bash

# 数据库 Seeds 执行脚本
# 用于初始化管理员账号和其他初始数据

set -e

echo "================================"
echo "  数据库 Seeds 初始化工具"
echo "================================"
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在 backend 目录下运行此脚本"
    exit 1
fi

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "❌ 错误: 未找到 .env 文件"
    echo "请先复制 .env.example 并配置数据库连接信息"
    exit 1
fi

echo "📦 检查依赖..."
if ! npm list bcrypt &> /dev/null || ! npm list dotenv &> /dev/null; then
    echo "⚠️  缺少必要依赖，正在安装..."
    npm install
fi

echo ""
echo "🌱 开始执行 Seeds..."
echo ""

npm run seed

echo ""
echo "================================"
echo "  ✅ Seeds 执行完成"
echo "================================"
echo ""
echo "默认管理员账号信息："
echo "  用户名: admin"
echo "  密码: admin123"
echo ""
echo "⚠️  请在生产环境中立即修改默认密码！"
echo ""

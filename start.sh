#!/bin/bash

echo "🚀 启动 AI中级会计助手（最小 MVP 版）"

# 检查Node.js版本
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 16 ]; then
    echo "❌ 需要 Node.js 16.0.0 或更高版本"
    exit 1
fi

echo "✅ Node.js 版本检查通过"

# 检查PostgreSQL是否运行
if ! pg_isready -q; then
    echo "❌ PostgreSQL 未运行，请先启动 PostgreSQL"
    echo "   并执行数据库初始化脚本: back-end/database/init.sql"
    exit 1
fi

echo "✅ PostgreSQL 连接正常"

# 安装依赖
echo "📦 安装项目依赖..."
npm run install:all

# 启动后端服务
echo "🔧 启动后端服务..."
cd back-end
npm run start:dev &
BACKEND_PID=$!

echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"
echo "📱 请使用微信开发者工具打开 front-end 目录启动小程序"
echo ""
echo "🌐 后端API地址: http://localhost:8123"
echo "📚 API文档: http://localhost:8123/api/docs"
echo ""
echo "按 Ctrl+C 停止服务"

wait $BACKEND_PID

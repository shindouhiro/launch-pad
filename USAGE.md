# Launch Pad 使用指南

## 🎯 功能概览

### 1. 公开展示页面
- **路径**: `http://localhost:3000/`
- **功能**: 
  - 展示所有推荐应用
  - 搜索功能
  - 分类筛选（All, Productivity, Development, Social, Entertainment）
  - 精美的卡片式布局
  - 无需登录即可访问

### 2. 管理后台

#### 登录页面
- **路径**: `http://localhost:3000/admin/login`
- **默认账号**:
  - 用户名: `admin`
  - 密码: `admin123`
- **功能**:
  - 使用 Ant Design Pro 的 LoginForm 组件
  - JWT Token 认证
  - 登录成功后自动跳转到推荐管理页面

#### 推荐管理页面
- **路径**: `http://localhost:3000/admin/recommendations`
- **需要登录**: ✅
- **功能**:
  - ✅ **查看**: 表格展示所有推荐应用
  - ✅ **新增**: 点击"New"按钮添加新推荐
  - ✅ **编辑**: 点击"Edit"按钮编辑现有推荐
  - ✅ **删除**: 点击"Delete"按钮删除推荐（带确认提示）
  - ✅ **搜索**: 支持按标题、URL、分类搜索
  - ✅ **分页**: 每页显示 10 条记录

## 📋 推荐字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Title | 文本 | ✅ | 推荐应用的标题 |
| URL | 文本 | ✅ | 应用链接 |
| Category | 下拉选择 | ✅ | 分类（Development/Productivity/Social/Entertainment） |
| Icon | 文本 | ❌ | Emoji 图标（如 🐙, ▲, 🤖） |
| Description | 文本域 | ❌ | 应用描述 |

## 🚀 快速开始

### 启动服务

#### 1. 启动后端
```bash
cd /Users/hikaru/Desktop/ai/launch-pad
pnpm --filter backend start:dev
```
后端运行在: `http://localhost:3001`

#### 2. 启动前端
```bash
# 确保使用 Node.js >= 20.9.0
nvm use 24.11.0
pnpm --filter portal dev
```
前端运行在: `http://localhost:3000`

### 使用流程

1. **访问公开页面**
   - 打开 `http://localhost:3000`
   - 查看所有推荐应用
   - 使用搜索和分类筛选功能

2. **登录管理后台**
   - 访问 `http://localhost:3000/admin/login`
   - 输入账号: `admin` / `admin123`
   - 点击登录

3. **管理推荐**
   - 登录成功后自动跳转到推荐管理页面
   - 点击"New"按钮添加新推荐
   - 点击"Edit"编辑现有推荐
   - 点击"Delete"删除推荐

4. **查看更新**
   - 返回公开页面 `http://localhost:3000`
   - 刷新页面查看最新的推荐列表

## 🎨 技术栈

### 前端
- **框架**: Next.js 16 (App Router)
- **UI 库**: Ant Design 6
- **管理组件**: Ant Design Pro Components
  - ProLayout: 后台布局
  - ProTable: 数据表格
  - LoginForm: 登录表单
- **样式**: Tailwind CSS + Ant Design

### 后端
- **框架**: NestJS
- **认证**: Passport + JWT
- **数据存储**: 内存存储（可轻松替换为数据库）
- **CORS**: 已启用

## 🔒 安全说明

- JWT Token 存储在 localStorage
- 所有管理 API（POST/PUT/DELETE）都需要 JWT 认证
- 公开 API（GET /recommendations）无需认证
- 生产环境建议:
  - 使用环境变量管理 JWT Secret
  - 实现用户注册和密码加密
  - 使用真实数据库替代内存存储

## 📝 API 端点

### 公开接口
- `GET /recommendations` - 获取所有推荐（无需认证）

### 认证接口
- `POST /auth/login` - 用户登录

### 管理接口（需要 JWT Token）
- `POST /recommendations` - 创建推荐
- `PUT /recommendations/:id` - 更新推荐
- `DELETE /recommendations/:id` - 删除推荐

## 🎉 已完成的功能

✅ Monorepo 架构（pnpm workspaces）
✅ NestJS 后端 API
✅ JWT 认证系统
✅ 推荐 CRUD 接口
✅ Next.js 前端应用
✅ Ant Design Pro 管理后台
✅ 登录页面
✅ 推荐管理页面（完整 CRUD）
✅ 公开展示页面
✅ 搜索和筛选功能
✅ 响应式设计

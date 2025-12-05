# GitHub Actions CI/CD 配置指南

## 📋 概述

本项目使用 GitHub Actions 实现自动化 CI/CD 流程，包括：
- 🧪 自动化测试
- 🏗️ Docker 镜像构建
- 📦 自动推送到 Docker Hub
- 🚀 版本发布管理

## 🔧 配置步骤

### 1. 设置 GitHub Secrets

在 GitHub 仓库中配置以下 Secrets：

1. 进入仓库 Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加以下 secret：

| Secret 名称 | 说明 | 示例值 |
|------------|------|--------|
| `DOCKER_PASSWORD` | Docker Hub 密码或 Access Token | `your-docker-password` |

**获取 Docker Hub Access Token：**
1. 登录 [Docker Hub](https://hub.docker.com/)
2. 进入 Account Settings → Security
3. 点击 "New Access Token"
4. 复制生成的 token 并添加到 GitHub Secrets

### 2. 验证配置

推送代码到 GitHub 后，Actions 会自动运行：

```bash
git add .
git commit -m "Add GitHub Actions workflows"
git push origin main
```

在 GitHub 仓库的 Actions 标签页查看运行状态。

## 📝 工作流说明

### 1. CI Tests (ci.yml)

**触发条件：**
- Push 到 `main` 或 `develop` 分支
- Pull Request 到 `main` 分支

**执行内容：**
- ✅ 后端测试
  - 启动 PostgreSQL 测试数据库
  - 安装依赖
  - 运行 Linter
  - 构建项目
  - 运行测试
- ✅ 前端测试
  - 安装依赖
  - 运行 Linter
  - 构建项目
- ✅ 代码质量检查

**查看状态：**
```
GitHub 仓库 → Actions → CI Tests
```

### 2. Build and Push Docker Images (docker-build-push.yml)

**触发条件：**
- Push 到 `main` 或 `develop` 分支
- Push tag（如 `v1.0.0`）
- Pull Request 到 `main` 分支
- 手动触发（workflow_dispatch）

**执行内容：**
- 🏗️ 构建后端 Docker 镜像
- 🏗️ 构建前端 Docker 镜像
- 📦 推送镜像到 Docker Hub
- 🏷️ 自动生成镜像标签

**镜像标签规则：**
- `main` 分支 → `latest` 标签
- `develop` 分支 → `develop` 标签
- Tag `v1.2.3` → `1.2.3`, `1.2`, `1`, `latest` 标签
- PR → `pr-123` 标签

**查看状态：**
```
GitHub 仓库 → Actions → Build and Push Docker Images
```

### 3. Release (release.yml)

**触发条件：**
- Push tag（格式：`v*.*.*`，如 `v1.0.0`）

**执行内容：**
- 📝 创建 GitHub Release
- 📋 自动生成 Changelog
- 🏗️ 构建多平台镜像（amd64, arm64）
- 📦 推送版本镜像到 Docker Hub
- 🔔 发送通知

**创建发布：**
```bash
# 创建并推送 tag
git tag v1.0.0
git push origin v1.0.0
```

**查看状态：**
```
GitHub 仓库 → Actions → Release
GitHub 仓库 → Releases
```

## 🚀 使用示例

### 场景 1: 日常开发

```bash
# 1. 开发新功能
git checkout -b feature/new-feature

# 2. 提交代码
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 3. 创建 Pull Request
# GitHub 会自动运行 CI 测试

# 4. 合并到 main
# 自动构建并推送 Docker 镜像
```

### 场景 2: 发布新版本

```bash
# 1. 确保在 main 分支
git checkout main
git pull origin main

# 2. 创建版本 tag
git tag v1.0.0

# 3. 推送 tag
git push origin v1.0.0

# 4. GitHub Actions 自动：
#    - 创建 GitHub Release
#    - 构建 Docker 镜像
#    - 推送到 Docker Hub
```

### 场景 3: 手动触发构建

1. 进入 GitHub 仓库
2. 点击 Actions 标签
3. 选择 "Build and Push Docker Images"
4. 点击 "Run workflow"
5. 选择分支并运行

## 📊 工作流状态徽章

在 README.md 中添加状态徽章：

```markdown
![CI Tests](https://github.com/shindouhiro/launch-pad/workflows/CI%20Tests/badge.svg)
![Docker Build](https://github.com/shindouhiro/launch-pad/workflows/Build%20and%20Push%20Docker%20Images/badge.svg)
```

## 🔍 故障排查

### 问题 1: Docker Hub 推送失败

**错误信息：**
```
Error: denied: requested access to the resource is denied
```

**解决方法：**
1. 检查 `DOCKER_PASSWORD` Secret 是否正确
2. 确认 Docker Hub 用户名是 `shindouhiro`
3. 验证 Access Token 权限

### 问题 2: 构建超时

**错误信息：**
```
Error: The operation was canceled.
```

**解决方法：**
1. 检查 Dockerfile 是否有优化空间
2. 使用 Docker 缓存加速构建
3. 考虑减小镜像大小

### 问题 3: 测试失败

**解决方法：**
1. 查看 Actions 日志
2. 本地运行测试验证
3. 检查数据库连接配置

## 🎯 最佳实践

### 1. 分支策略

```
main (生产环境)
  ↑
develop (开发环境)
  ↑
feature/* (功能分支)
```

### 2. 提交规范

使用 Conventional Commits：

```bash
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

### 3. 版本号规范

遵循 [Semantic Versioning](https://semver.org/)：

```
v主版本.次版本.修订号

v1.0.0 - 初始版本
v1.1.0 - 新增功能
v1.1.1 - 修复 bug
v2.0.0 - 重大更新
```

### 4. Tag 命名

```bash
# 正式版本
v1.0.0

# 预发布版本
v1.0.0-beta.1
v1.0.0-rc.1

# 开发版本
v1.0.0-dev.1
```

## 📈 性能优化

### 1. 使用缓存

工作流已配置：
- pnpm 依赖缓存
- Docker 层缓存（GitHub Actions Cache）

### 2. 并行构建

后端和前端镜像并行构建，节省时间。

### 3. 多平台构建

支持 `linux/amd64` 和 `linux/arm64` 平台。

## 🔐 安全建议

### 1. 保护 Secrets

- ❌ 不要在代码中硬编码密钥
- ✅ 使用 GitHub Secrets 存储敏感信息
- ✅ 定期轮换 Access Token

### 2. 分支保护

在 GitHub 设置中启用：
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date

### 3. 依赖安全

定期更新依赖：
```bash
pnpm update
```

## 📚 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 🎉 完成检查清单

部署前确认：

- [ ] 已添加 `DOCKER_PASSWORD` Secret
- [ ] 已推送代码到 GitHub
- [ ] CI 测试通过
- [ ] Docker 镜像构建成功
- [ ] 镜像已推送到 Docker Hub
- [ ] 创建了版本 tag
- [ ] GitHub Release 已创建

## 💡 提示

### 查看工作流日志

```bash
# 使用 GitHub CLI
gh run list
gh run view <run-id>
gh run watch
```

### 取消运行中的工作流

```bash
gh run cancel <run-id>
```

### 重新运行失败的工作流

在 GitHub Actions 页面点击 "Re-run failed jobs"

## 🚀 下一步

1. **配置 Secrets** - 添加 Docker Hub 密码
2. **推送代码** - 触发第一次构建
3. **创建 Tag** - 发布第一个版本
4. **监控状态** - 查看 Actions 运行情况

现在你的项目已经配置了完整的 CI/CD 流程！🎊

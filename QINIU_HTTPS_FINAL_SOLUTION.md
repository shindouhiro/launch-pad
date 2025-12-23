# 七牛云 HTTPS 问题最终解决方案

## 问题根源

**七牛云测试域名不支持 HTTPS！**

```bash
# HTTP 可以访问 ✅
curl -I http://t6yfyzu7s.hn-bkt.clouddn.com/uploads/xxx.png
# HTTP/1.1 200 OK

# HTTPS 无法访问 ❌
curl -I https://t6yfyzu7s.hn-bkt.clouddn.com/uploads/xxx.png
# SSL: no alternative certificate subject name matches target host name
```

**原因**：`t6yfyzu7s.hn-bkt.clouddn.com` 是七牛云的**测试域名**，没有配置 SSL 证书。

## 解决方案

### 方案 1：绑定自定义域名（推荐）⭐⭐⭐

这是**唯一**能在生产环境正常使用的方案。

#### 步骤 1：准备域名

你需要一个自己的域名，例如：
- `cdn.yourdomain.com`
- `static.yourdomain.com`
- `img.yourdomain.com`

#### 步骤 2：在七牛云绑定域名

1. 登录 [七牛云控制台](https://portal.qiniu.com/)
2. 进入「对象存储」→「空间管理」
3. 选择你的存储空间（`launch-pad`）
4. 点击「域名管理」→「绑定域名」
5. 输入你的域名（如 `cdn.yourdomain.com`）
6. 选择「通信协议」：**HTTPS**
7. 选择「证书管理」：
   - **选项 A**：使用七牛云免费证书（推荐）
   - **选项 B**：上传自己的证书

#### 步骤 3：配置 DNS

在你的域名 DNS 管理中添加 CNAME 记录：

```
类型: CNAME
主机记录: cdn
记录值: t6yfyzu7s.hn-bkt.clouddn.com
TTL: 600
```

#### 步骤 4：更新环境变量

修改 `.env` 文件：

```env
# 之前
QINIU_DOMAIN=http://t6yfyzu7s.hn-bkt.clouddn.com

# 之后
QINIU_DOMAIN=https://cdn.yourdomain.com
```

#### 步骤 5：重启服务

```bash
docker-compose restart backend
```

#### 验证

```bash
# 测试新域名
curl -I https://cdn.yourdomain.com/uploads/xxx.png
# 应该返回 200 OK
```

---

### 方案 2：保持 HTTP（临时方案）⚠️

如果暂时无法配置自定义域名，可以回退到 HTTP 方案。

#### 步骤 1：回退后端代码

修改 `apps/backend/src/qiniu/qiniu.service.ts`：

```typescript
/**
 * 构建完整的 URL
 */
private buildUrl(key: string): string {
  let baseUrl = this.domain;
  
  // 如果 domain 不包含协议，添加协议
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    // 使用 HTTP（因为测试域名不支持 HTTPS）
    baseUrl = `http://${baseUrl}`;
  }
  
  return `${baseUrl}/${key}`;
}
```

#### 步骤 2：移除前端 HTTPS 转换

修改 `apps/portal/lib/image-utils.ts`：

```typescript
/**
 * 确保图片 URL 使用正确的协议
 * 注意：七牛云测试域名不支持 HTTPS，保持原样
 */
export function ensureHttps(url: string | null | undefined): string {
  if (!url) return '';
  
  // 暂时不转换，保持原协议
  return url;
}
```

#### 步骤 3：配置 Content Security Policy

在生产环境允许加载 HTTP 图片（**不推荐，仅临时方案**）。

修改 `apps/portal/next.config.ts`：

```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "img-src 'self' http://t6yfyzu7s.hn-bkt.clouddn.com data: blob:;",
        },
      ],
    },
  ];
},
```

**⚠️ 警告**：
- 这会降低网站安全性
- 现代浏览器可能仍然阻止混合内容
- 不适合生产环境

---

### 方案 3：使用 Next.js 图片代理（不推荐）❌

通过 Next.js 代理七牛云图片。

#### 配置 rewrites

修改 `apps/portal/next.config.ts`：

```typescript
async rewrites() {
  return [
    // API 代理
    {
      source: '/api/:path*',
      destination: `${process.env.SERVER_API_URL || 'http://localhost:3001'}/:path*`,
    },
    // 图片代理
    {
      source: '/qiniu/:path*',
      destination: 'http://t6yfyzu7s.hn-bkt.clouddn.com/:path*',
    },
  ];
},
```

#### 修改图片 URL

```typescript
// 之前
const imageUrl = 'http://t6yfyzu7s.hn-bkt.clouddn.com/uploads/xxx.png';

// 之后
const imageUrl = '/qiniu/uploads/xxx.png';
```

**缺点**：
- ❌ 失去 CDN 加速优势
- ❌ 增加服务器负载
- ❌ 需要修改所有现有 URL
- ❌ 不适合生产环境

---

## 推荐方案对比

| 方案 | 安全性 | 性能 | 成本 | 难度 | 推荐度 |
|------|--------|------|------|------|--------|
| 自定义域名 + HTTPS | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 域名费用 | 中 | ⭐⭐⭐⭐⭐ |
| 保持 HTTP | ⭐ | ⭐⭐⭐⭐⭐ | 免费 | 低 | ⭐ |
| Next.js 代理 | ⭐⭐⭐ | ⭐⭐ | 服务器成本 | 中 | ⭐ |

## 立即行动方案

### 如果你有域名（推荐）

```bash
# 1. 在七牛云绑定域名并配置 HTTPS
# 2. 配置 DNS CNAME
# 3. 更新 .env
QINIU_DOMAIN=https://cdn.yourdomain.com

# 4. 重启服务
docker-compose restart backend
```

### 如果暂时没有域名

**选项 A**：购买域名（推荐）
- 阿里云、腾讯云、GoDaddy 等
- 费用：约 50-100 元/年
- 配置时间：约 1 小时

**选项 B**：使用免费子域名服务
- [Freenom](https://www.freenom.com/)（免费域名）
- [Cloudflare](https://www.cloudflare.com/)（免费 SSL）

**选项 C**：临时使用 HTTP（不推荐）
- 仅用于开发/测试环境
- 生产环境必须使用 HTTPS

## 七牛云域名配置指南

### 1. 登录七牛云控制台

访问：https://portal.qiniu.com/

### 2. 进入存储空间

对象存储 → 空间管理 → 选择 `launch-pad`

### 3. 绑定域名

域名管理 → 绑定域名

**配置项**：
- 域名：`cdn.yourdomain.com`
- 通信协议：HTTPS
- 证书管理：选择「申请免费证书」或「上传自有证书」

### 4. 等待审核

- 免费证书：约 5-10 分钟
- 自有证书：立即生效

### 5. 配置 DNS

在域名服务商添加 CNAME：

```
主机记录: cdn
记录类型: CNAME
记录值: t6yfyzu7s.hn-bkt.clouddn.com
TTL: 600
```

### 6. 验证

```bash
# 检查 DNS 解析
nslookup cdn.yourdomain.com

# 测试 HTTPS 访问
curl -I https://cdn.yourdomain.com
```

## 常见问题

### Q: 为什么测试域名不支持 HTTPS？

A: 七牛云的测试域名（`*.hn-bkt.clouddn.com`）是临时域名，没有配置 SSL 证书。生产环境必须使用自定义域名。

### Q: 免费证书和付费证书有什么区别？

A: 
- **免费证书**：Let's Encrypt，3 个月有效期，自动续期
- **付费证书**：1-2 年有效期，支持更多功能

对于大多数场景，免费证书已经足够。

### Q: 配置域名需要多长时间？

A: 
- 绑定域名：5 分钟
- DNS 生效：10 分钟 - 24 小时（通常 10 分钟内）
- SSL 证书：5-10 分钟

总计：约 30 分钟 - 1 小时

### Q: 可以使用 Cloudflare CDN 吗？

A: 可以！步骤：
1. 在七牛云绑定域名（不启用 HTTPS）
2. 在 Cloudflare 添加域名
3. 启用 Cloudflare 的 SSL（免费）
4. 配置 DNS 指向七牛云

### Q: 如果不想购买域名怎么办？

A: 
1. 使用免费域名服务（Freenom）
2. 使用 Cloudflare Pages 的免费子域名
3. 临时使用 HTTP（仅开发环境）

## 总结

**最佳方案**：绑定自定义域名 + 配置 HTTPS

**步骤**：
1. ✅ 准备域名
2. ✅ 在七牛云绑定域名
3. ✅ 配置 DNS CNAME
4. ✅ 申请免费 SSL 证书
5. ✅ 更新 `.env` 配置
6. ✅ 重启服务

**时间**：约 1 小时

**成本**：域名费用（约 50-100 元/年）

**效果**：
- ✅ 完全支持 HTTPS
- ✅ 生产环境可用
- ✅ 安全可靠
- ✅ 性能优秀

---

## 需要帮助？

如果你需要帮助配置域名，请告诉我：
1. 你是否已有域名？
2. 使用哪个域名服务商？
3. 是否需要购买域名的建议？

我可以提供详细的配置指导！🚀

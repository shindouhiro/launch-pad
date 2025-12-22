# 管理员账号 Seeds 实现总结

## ✅ 已完成的工作

### 1. 创建 Seeds 系统

创建了以下文件：

- **`src/database/seeds/admin.seed.ts`**: 管理员账号初始化逻辑
- **`src/database/seeds/index.ts`**: Seeds 统一管理入口
- **`src/database/seed.ts`**: Seeds 执行脚本

### 2. 更新认证系统

- **`src/auth/auth.service.ts`**: 
  - 从硬编码验证改为数据库验证
  - 集成 bcrypt 密码加密验证
  - 使用 TypeORM UserRepository

- **`src/auth/auth.module.ts`**:
  - 导入 `TypeOrmModule.forFeature([UserEntity])`
  - 提供 UserRepository 依赖注入

### 3. 添加依赖

在 `package.json` 中添加：
- `bcrypt`: ^5.1.1 (密码加密)
- `@types/bcrypt`: ^5.0.2 (TypeScript 类型定义)
- `dotenv`: ^16.4.7 (环境变量加载)

### 4. 添加 NPM Scripts

```json
{
  "seed": "ts-node -r tsconfig-paths/register src/database/seed.ts",
  "seed:run": "npm run seed"
}
```

### 5. 创建文档和工具

- **`SEEDS_GUIDE.md`**: 详细的使用指南
- **`run-seeds.sh`**: 便捷的执行脚本

## 🎯 功能特性

### 管理员账号

- **用户名**: `admin`
- **密码**: `admin123` (bcrypt 加密存储)
- **幂等性**: 多次运行不会创建重复账号

### 安全性

- ✅ 密码使用 bcrypt 加密（saltRounds: 10）
- ✅ 验证时不返回密码字段
- ✅ JWT token 使用用户 ID 而非硬编码值

## 📝 使用方法

### 运行 Seeds

```bash
# 方法 1: 使用 pnpm (推荐)
pnpm --filter backend seed

# 方法 2: 在 backend 目录
cd apps/backend
npm run seed

# 方法 3: 使用便捷脚本
cd apps/backend
./run-seeds.sh
```

### 预期输出

```
正在连接数据库...
✓ 数据库连接成功

开始执行数据库 seeds...

✓ 管理员账号创建成功
  用户名: admin
  密码: admin123
  提示: 请在生产环境中修改默认密码！

✓ 所有 seeds 执行完成

✓ 数据库连接已关闭
```

## 🔧 技术实现

### 数据库连接

使用独立的 TypeORM DataSource，不依赖 NestJS 应用上下文：

```typescript
const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  // ... 其他配置
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
});
```

### 密码加密

```typescript
const saltRounds = 10;
const hashedPassword = await bcrypt.hash('admin123', saltRounds);
```

### 幂等性检查

```typescript
const existingAdmin = await userRepository.findOne({
  where: { username: 'admin' },
});

if (existingAdmin) {
  console.log('✓ 管理员账号已存在，跳过创建');
  return;
}
```

## 🚀 后续扩展

可以轻松添加更多 seeds：

1. 在 `src/database/seeds/` 创建新的 seed 文件
2. 在 `src/database/seeds/index.ts` 中注册
3. 运行 `npm run seed` 即可

示例：
- 初始分类数据
- 示例推荐内容
- 系统配置数据

## ⚠️ 注意事项

1. **生产环境**: 首次部署后立即修改默认管理员密码
2. **环境变量**: 确保 `.env` 文件配置正确
3. **数据库**: Seeds 运行前确保数据库已启动
4. **TypeORM**: Seeds 使用 `synchronize: false`，不会修改数据库结构

## 📚 相关文档

- [SEEDS_GUIDE.md](./SEEDS_GUIDE.md) - 详细使用指南
- [README.md](./README.md) - 项目整体文档

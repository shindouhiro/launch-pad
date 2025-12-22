# 数据库 Seeds 使用指南

## 概述

本项目使用 TypeORM 和自定义的 seeds 系统来初始化数据库数据，特别是管理员账号。

## 文件结构

```
src/database/
├── seed.ts                    # Seeds 执行入口脚本
└── seeds/
    ├── index.ts              # Seeds 统一管理
    └── admin.seed.ts         # 管理员账号 seed
```

## 管理员账号

Seeds 会自动创建一个默认的管理员账号：

- **用户名**: `admin`
- **密码**: `admin123`

⚠️ **安全提示**: 请在生产环境中立即修改默认密码！

## 使用方法

### 1. 运行 Seeds

在项目根目录执行：

```bash
# 使用 pnpm (推荐)
pnpm --filter backend seed

# 或者直接在 backend 目录
cd apps/backend
npm run seed
```

### 2. Seeds 执行流程

1. 连接到数据库
2. 检查是否已存在管理员账号
3. 如果不存在，创建新的管理员账号（密码使用 bcrypt 加密）
4. 关闭数据库连接

### 3. 幂等性

Seeds 是幂等的，多次运行不会创建重复数据。如果管理员账号已存在，会跳过创建步骤。

## 添加新的 Seeds

1. 在 `src/database/seeds/` 目录下创建新的 seed 文件，例如 `categories.seed.ts`：

```typescript
import { DataSource } from 'typeorm';
import { CategoryEntity } from '../../categories/category.entity';

export async function seedCategories(dataSource: DataSource): Promise<void> {
  const categoryRepository = dataSource.getRepository(CategoryEntity);

  // 检查是否已存在数据
  const count = await categoryRepository.count();
  if (count > 0) {
    console.log('✓ 分类数据已存在，跳过创建');
    return;
  }

  // 创建初始数据
  const categories = categoryRepository.create([
    { name: '技术', description: '技术相关内容' },
    { name: '生活', description: '生活相关内容' },
  ]);

  await categoryRepository.save(categories);
  console.log('✓ 分类数据创建成功');
}
```

2. 在 `src/database/seeds/index.ts` 中注册新的 seed：

```typescript
import { DataSource } from 'typeorm';
import { seedAdmin } from './admin.seed';
import { seedCategories } from './categories.seed';

export async function runSeeds(dataSource: DataSource): Promise<void> {
  console.log('开始执行数据库 seeds...\n');

  try {
    await seedAdmin(dataSource);
    await seedCategories(dataSource);  // 添加新的 seed

    console.log('\n✓ 所有 seeds 执行完成');
  } catch (error) {
    console.error('\n✗ Seeds 执行失败:', error);
    throw error;
  }
}
```

## 环境变量

Seeds 脚本会从 `.env` 文件读取以下环境变量：

- `DB_HOST`: 数据库主机地址
- `DB_PORT`: 数据库端口
- `DB_USERNAME`: 数据库用户名
- `DB_PASSWORD`: 数据库密码
- `DB_DATABASE`: 数据库名称

确保 `.env` 文件已正确配置。

## 故障排查

### 错误: Cannot find module 'bcrypt'

运行以下命令安装依赖：

```bash
pnpm install
```

### 错误: Connection refused

检查数据库是否正在运行：

```bash
# 使用 Docker Compose
docker-compose up -d postgres

# 检查数据库状态
docker-compose ps postgres
```

### 错误: Authentication failed

检查 `.env` 文件中的数据库凭据是否正确。

## 最佳实践

1. **开发环境**: 在每次重置数据库后运行 seeds
2. **生产环境**: 仅在首次部署时运行 seeds
3. **密码安全**: 立即修改默认管理员密码
4. **版本控制**: Seeds 应该是幂等的，可以安全地多次运行
5. **数据迁移**: 对于数据库结构变更，使用 TypeORM migrations 而不是 seeds

import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { runSeeds } from './seeds';

// 加载环境变量
config();

const configService = new ConfigService();

// 创建 TypeORM 数据源
const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // seeds 不应该修改数据库结构
});

/**
 * 主函数：初始化数据源并执行 seeds
 */
async function main() {
  try {
    console.log('正在连接数据库...');
    await AppDataSource.initialize();
    console.log('✓ 数据库连接成功\n');

    await runSeeds(AppDataSource);

    await AppDataSource.destroy();
    console.log('\n✓ 数据库连接已关闭');
    process.exit(0);
  } catch (error) {
    console.error('执行失败:', error);
    process.exit(1);
  }
}

main();

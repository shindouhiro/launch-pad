import { DataSource } from 'typeorm';
import { seedAdmin } from './admin.seed';

/**
 * 执行所有 seeds
 * @param dataSource TypeORM 数据源
 */
export async function runSeeds(dataSource: DataSource): Promise<void> {
  console.log('开始执行数据库 seeds...\n');

  try {
    // 执行管理员账号 seed
    await seedAdmin(dataSource);

    console.log('\n✓ 所有 seeds 执行完成');
  } catch (error) {
    console.error('\n✗ Seeds 执行失败:', error);
    throw error;
  }
}

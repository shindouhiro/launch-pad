import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../auth/user.entity';

/**
 * 初始化管理员账号
 * @param dataSource TypeORM 数据源
 */
export async function seedAdmin(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(UserEntity);

  // 检查是否已存在管理员账号
  const existingAdmin = await userRepository.findOne({
    where: { username: 'admin' },
  });

  if (existingAdmin) {
    console.log('✓ 管理员账号已存在，跳过创建');
    return;
  }

  // 创建管理员账号
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('admin123', saltRounds);

  const admin = userRepository.create({
    username: 'admin',
    password: hashedPassword,
  });

  await userRepository.save(admin);
  console.log('✓ 管理员账号创建成功');
  console.log('  用户名: admin');
  console.log('  密码: admin123');
  console.log('  提示: 请在生产环境中修改默认密码！');
}

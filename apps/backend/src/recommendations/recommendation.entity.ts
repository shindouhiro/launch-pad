import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Recommendation {
  @ApiProperty({ description: '推荐ID', example: '1' })
  id: string;

  @ApiProperty({ description: '标题', example: 'GitHub' })
  title: string;

  @ApiProperty({ description: 'URL链接', example: 'https://github.com' })
  url: string;

  @ApiProperty({ description: '图标', example: '🐙' })
  icon: string;

  @ApiProperty({ description: '分类', example: 'Development' })
  category: string;

  @ApiProperty({ description: '描述', example: 'Code hosting and collaboration' })
  description: string;

  @ApiPropertyOptional({
    description: '图片URL数组',
    type: [String],
    example: [
      'http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/xxx1.jpg',
      'http://t6mfwj8xf.hn-bkt.clouddn.com/uploads/xxx2.jpg',
    ],
  })
  images?: string[]; // 图片URL数组
}


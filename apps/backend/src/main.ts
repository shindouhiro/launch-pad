import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用 CORS
  app.enableCors();

  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('Launch Pad API')
    .setDescription('Launch Pad 应用的 API 文档，包含推荐管理和七牛云图片上传功能')
    .setVersion('1.0')
    .addTag('auth', '认证相关接口')
    .addTag('recommendations', '推荐管理接口')
    .addTag('upload', '七牛云图片上传接口')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: '输入 JWT token',
        in: 'header',
      },
      'JWT-auth', // 这个名称将在 @ApiBearerAuth() 中使用
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 保持授权状态
      tagsSorter: 'alpha', // 按字母顺序排序标签
      operationsSorter: 'alpha', // 按字母顺序排序操作
    },
    customSiteTitle: 'Launch Pad API 文档',
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`🚀 应用运行在: http://localhost:${port}`);
  console.log(`📚 API 文档地址: http://localhost:${port}/api-docs`);
}
bootstrap();

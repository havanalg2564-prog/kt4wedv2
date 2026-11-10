import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

    // OpenAPI-документация; UI доступен по /api
    const swaggerConfig = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription(
      'CRUD пользователей и постов (PostgreSQL, миграции, QueryBuilder)',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);


  const port = configService.get<number>('PORT');
  await app.listen(port ?? 3000);
}
await bootstrap();

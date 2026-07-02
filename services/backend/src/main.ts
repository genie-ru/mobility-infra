import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // web(nginx) が /api を Nest にそのまま渡すため、グローバルプレフィックスを合わせる。
  app.setGlobalPrefix('api');
  await app.listen(8080, '0.0.0.0');
}
bootstrap();

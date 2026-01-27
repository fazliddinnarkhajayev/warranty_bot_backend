import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters/exception.filter';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableCors('*')

  // 🔥 Global prefix
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

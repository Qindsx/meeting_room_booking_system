import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './interceptor/format-response.interceptor';
import { InvokeRecordInterceptor } from './interceptor/invoke-record.interceptor';
import { UnloginFilter } from './filter/unlogin.filter';
import { CustomExceptionFilter } from './filter/custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 校验管道
  app.useGlobalPipes(new ValidationPipe())

  // Response 返回信息封装
  app.useGlobalInterceptors(new FormatResponseInterceptor())

  // 请求日志输出
  app.useGlobalInterceptors(new InvokeRecordInterceptor())

  // 未登录拦截
  app.useGlobalFilters(new UnloginFilter())

  // 返回信息过滤器
  app.useGlobalFilters(new CustomExceptionFilter())

  // swagger 文档
  const config = new DocumentBuilder()
    .setTitle('test系统')
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: '基于JWT认证'
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  app.useStaticAssets('uploads', {
    prefix: '/uploads'
  });

  app.enableCors()

  const configService = new ConfigService()
  console.log(configService.get('nest_server_port'))
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();

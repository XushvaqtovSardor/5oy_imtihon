import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Educational Platform API')
    .setDescription(
      'Complete API documentation for educational platform with courses, lessons, exams, and homework',
    )
    .setVersion('1.0')
    .addTag('Authentication', 'User authentication and registration endpoints')
    .addTag('Verification', 'OTP verification endpoints for phone and email')
    .addTag('Device', 'Device management endpoints')
    .addTag('Profile', 'User profile management')
    .addTag('Courses', 'Course management')
    .addTag('Course Category', 'Course category management')
    .addTag('Course Rating', 'Course rating and reviews')
    .addTag('Purchased Courses', 'Purchased course management')
    .addTag('Lessons', 'Lesson management')
    .addTag('Lesson Groups', 'Lesson group management')
    .addTag('Lesson Files', 'Lesson file management')
    .addTag('Exams', 'Exam management')
    .addTag('Homework', 'Homework management')
    .addTag('Questions & Answers', 'Q&A management')
    .addTag('Users', 'User management')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Educational Platform API',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation: ${await app.getUrl()}/api/docs`);
}
bootstrap();

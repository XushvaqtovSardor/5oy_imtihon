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
    .addTag(
      'Courses',
      'Course management - create, update, filter, publish courses',
    )
    .addTag('course-categories', 'Course category management')
    .addTag('ratings', 'Course rating and reviews')
    .addTag('lessons', 'Lesson management')
    .addTag('lesson-sections', 'Lesson section/group management')
    .addTag('exams', 'Exam management')
    .addTag('homework', 'Homework management')
    .addTag('questions', 'Q&A management')
    .addTag('projects', 'Project management')
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

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`Application is running on: http://165.232.50.236:3000`);
  console.log(`Swagger documentation: http://165.232.50.236:3000/api/docs`);
}
bootstrap();

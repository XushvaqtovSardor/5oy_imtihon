import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { MailerModule } from './verification/verification.module';
import { DeviceModule } from './device/device.module';
import { ProfileModule } from './profile/profile.module';
import { CourseModule } from './course/course.module';
import { CourseCategoryModule } from './course-category/course-category.module';
import { LessonModule } from './lesson/lesson.module';
import { LessonSectionModule } from './lessonSection/lesson-section.module';
import { HomeworkModule } from './homework/homework.module';
import { ExamModule } from './exam/exam.module';
import { QuestionModule } from './question/question.module';
import { ProjectModule } from './project/project.module';
import { RatingModule } from './rating/rating.module';
import { PaymentModule } from './payment/payment.module';
import { ContactModule } from './contact/contact.module';
import { FilesModule } from './files/files.module';
import { LessonFilesModule } from './lesson-files/lesson-files.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    RedisModule,
    MailerModule,
    DeviceModule,
    ProfileModule,
    UsersModule,
    CourseModule,
    CourseCategoryModule,
    LessonModule,
    LessonSectionModule,
    LessonFilesModule,
    HomeworkModule,
    ExamModule,
    QuestionModule,
    ProjectModule,
    RatingModule,
    PaymentModule,
    ContactModule,
    FilesModule,
  ],
})
export class AppModule {}

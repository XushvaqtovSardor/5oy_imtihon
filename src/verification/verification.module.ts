import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { MailService } from './verification.service';
import { VerificationPhoneService } from './verificationPhone.service';
import { VerificationEmailService } from './verificationEmail.service';
import { VerificationController } from './verification.controller';
import { SmsService } from 'src/service/sms.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: '<N25>',
        },
        template: {
          dir: join(process.cwd(), 'src', 'common', 'template'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
  ],
  controllers: [VerificationController],
  providers: [
    MailService,
    VerificationPhoneService,
    VerificationEmailService,
    SmsService,
  ],
  exports: [MailService, VerificationPhoneService, VerificationEmailService],
})
export class MailerModule {}

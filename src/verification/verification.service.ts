import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
@Injectable()
export class MailService {
  constructor(private mailService: NestMailerService) {}
  async sendEmail(email: string, subject: string, code: number) {
    await this.mailService.sendMail({
      to: email,
      subject,
      template: 'index',
      context: {
        code,
      },
    });
  }
}

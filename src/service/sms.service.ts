import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsService {
  private token: string;
  private readonly $axios = axios.create({
    baseURL: 'https://notify.eskiz.uz/api',
  });

  async sendSMS(message: string, phone: string): Promise<void> {
    try {
      if (!this.token) {
        await this.login();
      }

      await this.$axios.post(
        '/message/sms/send',
        {
          mobile_phone: phone,
          message: message,
          from: '4546',
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      console.log(`SMS yuborildi: ${message} -> ${phone}`);
    } catch (error) {
      console.error('SMS yuborishda xatolik:', error);
    }
  }

  private async login(): Promise<void> {
    try {
      const { data } = await this.$axios.post<{ data: { token: string } }>(
        '/auth/login',
        {
          email: process.env.ESKIZ_EMAIL,
          password: process.env.ESKIZ_PASSWORD,
        },
      );
      this.token = data.data.token;
    } catch (error) {
      console.error('SMS login xatolik:', error);
    }
  }
}

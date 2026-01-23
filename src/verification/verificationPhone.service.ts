import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { EVerificationTypes } from './dto';
import { sendOtpDto, verifyOtpDto } from 'src/auth/dto/dto';
import { SmsService } from 'src/service/sms.service';
import { generateOtp } from 'src/utils/function';

@Injectable()
export class VerificationPhoneService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private smsService: SmsService,
  ) {}

  public getKey(
    type: EVerificationTypes,
    phone: string,
    confirmation?: boolean,
  ) {
    const storeKeys: Record<EVerificationTypes, string> = {
      [EVerificationTypes.REGISTER]: 'reg_',
      [EVerificationTypes.RESET_PASSWORD]: 'respass_',
      [EVerificationTypes.EDIT_PHONE]: 'edph_',
    };
    let key = storeKeys[type];
    if (confirmation) {
      key += 'cfm_';
    }
    key += phone;
    return key;
  }

  private async throwIfUserExits(phone: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        phone: phone,
      },
    });
    if (user) {
      throw new HttpException('Phone already used', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  private getMessage(type: EVerificationTypes, otp: string) {
    switch (type) {
      case EVerificationTypes.REGISTER:
        return `Fixoo platformasidan ro'yxatdan o'tish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
      case EVerificationTypes.RESET_PASSWORD:
        return `Fixoo platformasida parolingizni tiklash uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
      case EVerificationTypes.EDIT_PHONE:
        return `Fixoo platformasida telefoningizni o'zgartirish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
    }
  }

  async sendOtp(payload: sendOtpDto) {
    const { type, phone } = payload;

    if (!phone) {
      throw new HttpException('Phone is required', HttpStatus.BAD_REQUEST);
    }

    const key = this.getKey(type, phone);
    const session = await this.redis.get(key);

    if (session) {
      throw new HttpException(
        'Code already send to user',
        HttpStatus.BAD_REQUEST,
      );
    }

    switch (type) {
      case EVerificationTypes.REGISTER:
        await this.throwIfUserExits(phone);
        break;
      case EVerificationTypes.RESET_PASSWORD: {
        const user = await this.prisma.users.findFirst({
          where: { phone },
        });
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        break;
      }
      case EVerificationTypes.EDIT_PHONE:
        await this.throwIfUserExits(phone);
        break;
    }
    const otp = generateOtp();
    await this.redis.set(key, JSON.stringify(otp), 600);
    await this.smsService.sendSMS(this.getMessage(type, otp), phone);
    return { message: 'Confirmation OTP code send' };
  }

  async verifyOtp(payload: verifyOtpDto) {
    const { type, phone, otp } = payload;

    if (!phone) {
      throw new HttpException('Phone is required', HttpStatus.BAD_REQUEST);
    }

    const key = this.getKey(type, phone);
    const session = await this.redis.get(key);

    if (!session) {
      throw new HttpException(
        'OTP expired or not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storedOtp = JSON.parse(session);

    if (storedOtp !== otp) {
      throw new HttpException('Invalid OTP code', HttpStatus.BAD_REQUEST);
    }

    await this.redis.del(key);
    const confirmationKey = this.getKey(type, phone, true);
    await this.redis.set(
      confirmationKey,
      JSON.stringify({ verified: true }),
      600,
    );

    return { message: 'OTP verified successfully', verified: true };
  }
}

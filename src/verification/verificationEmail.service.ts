import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { EVerificationTypes } from './dto';
import { sendOtpDto, verifyOtpDto } from 'src/auth/dto/dto';
import { MailService } from './verification.service';
import { generateOtp } from 'src/utils/function';

@Injectable()
export class VerificationEmailService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private mailService: MailService,
  ) {}

  public getKey(
    type: EVerificationTypes,
    email: string,
    confirmation?: boolean,
  ) {
    const storeKeys: Record<EVerificationTypes, string> = {
      [EVerificationTypes.REGISTER]: 'reg_email_',
      [EVerificationTypes.RESET_PASSWORD]: 'respass_email_',
      [EVerificationTypes.EDIT_PHONE]: 'edemail_',
    };
    let key = storeKeys[type];
    if (confirmation) {
      key += 'cfm_';
    }
    key += email;
    return key;
  }

  private async throwIfUserExits(email: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    if (user) {
      throw new HttpException('Email already used', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  private getSubject(type: EVerificationTypes) {
    switch (type) {
      case EVerificationTypes.REGISTER:
        return `Fixoo - Ro'yxatdan o'tish tasdiqlash kodi`;
      case EVerificationTypes.RESET_PASSWORD:
        return `Fixoo - Parolni tiklash tasdiqlash kodi`;
      case EVerificationTypes.EDIT_PHONE:
        return `Fixoo - Emailni o'zgartirish tasdiqlash kodi`;
    }
  }

  async sendOtp(payload: sendOtpDto) {
    const { type, email } = payload;

    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    const key = this.getKey(type, email);
    const session = await this.redis.get(key);

    if (session) {
      throw new HttpException(
        'Code already send to user',
        HttpStatus.BAD_REQUEST,
      );
    }

    switch (type) {
      case EVerificationTypes.REGISTER:
        await this.throwIfUserExits(email);
        break;
      case EVerificationTypes.RESET_PASSWORD: {
        const user = await this.prisma.users.findFirst({
          where: { email },
        });
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        break;
      }
      case EVerificationTypes.EDIT_PHONE:
        await this.throwIfUserExits(email);
        break;
    }
    const otp = generateOtp();
    await this.redis.set(key, JSON.stringify(otp), 600);
    await this.mailService.sendEmail(email, this.getSubject(type), +otp);
    return { message: 'Confirmation OTP code send' };
  }

  async verifyOtp(payload: verifyOtpDto) {
    const { type, email, otp } = payload;

    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    const key = this.getKey(type, email);
    const session = await this.redis.get(key);

    if (!session) {
      throw new HttpException(
        'OTP expired or no t found',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storedOtp = JSON.parse(session);

    if (storedOtp !== otp) {
      throw new HttpException('Invalid  OTP code', HttpStatus.BAD_REQUEST);
    }

    await this.redis.del(key);
    const confirmationKey = this.getKey(type, email, true);
    await this.redis.set(
      confirmationKey,
      JSON.stringify({ verified: true }),
      600,
    );

    return { message: 'OTP verified  successfully', verified: true };
  }
}

import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  registerWithPhoneDto,
  registerWithEmailDto,
  UserRole,
  resetPasswordWithPhoneDto,
  resetPasswordWithEmailDto,
  loginWithPhoneDto,
  loginWithEmailDto,
} from './dto/dto';
import * as bcrypt from 'bcrypt';
import { RedisService } from 'src/redis/redis.service';
import { EVerificationTypes } from 'src/verification/dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private redis: RedisService,
    private configService: ConfigService,
  ) {}

  private getConfirmationKey(
    type: EVerificationTypes,
    identifier: string,
    isEmail: boolean = false,
  ) {
    const storeKeys: Record<EVerificationTypes, string> = {
      [EVerificationTypes.REGISTER]: isEmail ? 'reg_email_' : 'reg_',
      [EVerificationTypes.RESET_PASSWORD]: isEmail
        ? 'respass_email_'
        : 'respass_',
      [EVerificationTypes.EDIT_PHONE]: isEmail ? 'edemail_' : 'edph_',
    };
    return storeKeys[type] + 'cfm_' + identifier;
  }

  async registerPhone(dto: registerWithPhoneDto) {
    if (!dto.phone) {
      throw new HttpException('Phone is required', HttpStatus.BAD_REQUEST);
    }

    const confirmationKey = this.getConfirmationKey(
      EVerificationTypes.REGISTER,
      dto.phone,
      false,
    );
    const verified = await this.redis.get(confirmationKey);

    if (!verified) {
      throw new HttpException(
        'Phone not verified or verification expired',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingUser = await this.prisma.users.findFirst({
      where: { phone: dto.phone },
    });

    if (existingUser) {
      throw new HttpException(
        'Phone already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = 10;
    const hashPas = await bcrypt.hash(dto.password, salt);
    const user = await this.prisma.users.create({
      data: {
        phone: dto.phone,
        password: hashPas,
        fullName: dto.fullName,
        deviceName: [dto.deviceName],
        role: dto.role || UserRole.STUDENT,
      },
    });

    await this.redis.del(confirmationKey);

    return {
      message: 'User successfully registered. Go to login to use website',
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        deviceName: user.deviceName,
      },
    };
  }

  async registerEmail(dto: registerWithEmailDto) {
    if (!dto.email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    const confirmationKey = this.getConfirmationKey(
      EVerificationTypes.REGISTER,
      dto.email,
      true,
    );
    const verified = await this.redis.get(confirmationKey);

    if (!verified) {
      throw new HttpException(
        'Email not verified or verification expired',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingUser = await this.prisma.users.findFirst({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new HttpException(
        'Email already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = 10;
    const hashPas = await bcrypt.hash(dto.password, salt);
    const user = await this.prisma.users.create({
      data: {
        email: dto.email,
        password: hashPas,
        fullName: dto.fullName,
        deviceName: [dto.deviceName],
        role: dto.role || UserRole.STUDENT,
      },
    });

    await this.redis.del(confirmationKey);

    return {
      message: 'User successfully registered. Go to login to use website',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        deviceName: user.deviceName,
      },
    };
  }

  async resetPasswordPhone(dto: resetPasswordWithPhoneDto) {
    if (!dto.phone) {
      throw new HttpException('Phone is required', HttpStatus.BAD_REQUEST);
    }

    const confirmationKey = this.getConfirmationKey(
      EVerificationTypes.RESET_PASSWORD,
      dto.phone,
      false,
    );
    const verified = await this.redis.get(confirmationKey);

    if (!verified) {
      throw new HttpException(
        'Not verified or verification expired',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma.users.findFirst({
      where: { phone: dto.phone },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const salt = 10;
    const hashPas = await bcrypt.hash(dto.password, salt);

    await this.prisma.users.update({
      where: { id: user.id },
      data: { password: hashPas },
    });

    await this.redis.del(confirmationKey);

    return {
      message: 'Password successfully reset',
    };
  }

  async resetPasswordEmail(dto: resetPasswordWithEmailDto) {
    if (!dto.email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    const confirmationKey = this.getConfirmationKey(
      EVerificationTypes.RESET_PASSWORD,
      dto.email,
      true,
    );
    const verified = await this.redis.get(confirmationKey);

    if (!verified) {
      throw new HttpException(
        'Not verified or verification expired',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma.users.findFirst({
      where: { email: dto.email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const salt = 10;
    const hashPas = await bcrypt.hash(dto.password, salt);

    await this.prisma.users.update({
      where: { id: user.id },
      data: { password: hashPas },
    });

    await this.redis.del(confirmationKey);

    return {
      message: 'Password successfully reset',
    };
  }

  async loginPhone(dto: loginWithPhoneDto) {
    if (!dto.phone) {
      throw new HttpException('Phone is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.users.findFirst({
      where: { phone: dto.phone },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPassword = await bcrypt.compare(dto.password, user.password);
    if (!isPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const deviceExists = user.deviceName.includes(dto.deviceName);
    if (!deviceExists) {
      await this.prisma.users.update({
        where: { id: user.id },
        data: {
          deviceName: [...user.deviceName, dto.deviceName],
        },
      });
    }

    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwt.sign(payload, {
      expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRE') ||
        '15m') as any,
    });
    const refreshToken = this.jwt.sign(payload, {
      expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRE') ||
        '7d') as any,
    });

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async loginEmail(dto: loginWithEmailDto) {
    if (!dto.email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.users.findFirst({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPassword = await bcrypt.compare(dto.password, user.password);
    if (!isPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const deviceExists = user.deviceName.includes(dto.deviceName);
    if (!deviceExists) {
      await this.prisma.users.update({
        where: { id: user.id },
        data: {
          deviceName: [...user.deviceName, dto.deviceName],
        },
      });
    }

    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwt.sign(payload, {
      expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRE') ||
        '15m') as any,
    });
    const refreshToken = this.jwt.sign(payload, {
      expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRE') ||
        '7d') as any,
    });

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string, deviceToken: string) {
    try {
      const payload = this.jwt.verify(token);
      const user = await this.prisma.users.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!user.deviceName.includes(deviceToken)) {
        throw new UnauthorizedException('Invalid device token');
      }

      const newPayload = { sub: user.id, role: user.role };
      const accessToken = this.jwt.sign(newPayload, {
        expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRE') ||
          '15m') as any,
      });

      return {
        message: 'Token refreshed successfully',
        accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}

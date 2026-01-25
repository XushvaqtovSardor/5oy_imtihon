import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService) {}

  async getAllDevices(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { deviceName: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      devices: user.deviceName,
      count: user.deviceName.length,
    };
  }

  async deleteDevice(userId: number, deviceToken: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.deviceName.includes(deviceToken)) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }

    const updatedDevices = user.deviceName.filter(
      (device) => device !== deviceToken,
    );

    await this.prisma.users.update({
      where: { id: userId },
      data: { deviceName: updatedDevices },
    });

    return {
      message: 'Device deleted successfully',
      remainingDevices: updatedDevices.length,
    };
  }
}

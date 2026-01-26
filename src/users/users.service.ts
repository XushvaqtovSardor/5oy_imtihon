import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.users.findMany({
      select: {
        id: true,
        phone: true,
        email: true,
        fullName: true,
        role: true,
        image: true,
        createdAt: true,
        mentorProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findMentors() {
    return await this.prisma.users.findMany({
      where: {
        role: {
          in: ['MENTOR', 'ADMIN'],
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        mentorProfile: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestException(
        `Invalid user ID: ${id}. ID must be a positive number.`,
      );
    }

    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        phone: true,
        email: true,
        fullName: true,
        role: true,
        image: true,
        deviceName: true,
        createdAt: true,
        mentorProfile: true,
        course: true,
        assginedCourses: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findMentor(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestException(
        `Invalid mentor ID: ${id}. ID must be a positive number.`,
      );
    }

    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        mentorProfile: true,
        course: {
          include: {
            category: true,
            rating: true,
          },
        },
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Mentor with ID ${id} not found`);
    }

    if (user.role !== 'MENTOR' && user.role !== 'ADMIN') {
      throw new BadRequestException('User is not a mentor');
    }

    return user;
  }

  async findByPhone(phone: string) {
    const user = await this.prisma.users.findFirst({
      where: { phone },
      select: {
        id: true,
        phone: true,
        fullName: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with phone ${phone} not found`);
    }

    return user;
  }

  async createAdmin(createDto: CreateUserDto) {
    const existingUser = await this.prisma.users.findFirst({
      where: {
        OR: [{ phone: createDto.phone }, { email: createDto.email }],
      },
    });

    if (existingUser) {
      throw new BadRequestException('Phone or email already exists');
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(createDto.password, salt);

    return await this.prisma.users.create({
      data: {
        fullName: createDto.fullName,
        phone: createDto.phone,
        email: createDto.email,
        password: hashedPassword,
        role: createDto.role,
        deviceName: [createDto.deviceName],
      },
      select: {
        id: true,
        phone: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async createMentor(createDto: CreateUserDto) {
    createDto.role = 'MENTOR' as any;
    return this.createAdmin(createDto);
  }

  async createAssistant(createDto: CreateUserDto) {
    createDto.role = 'ASSISTANT' as any;
    return this.createAdmin(createDto);
  }

  async updateMentor(id: number, updateDto: UpdateUserDto) {
    await this.findOne(id);

    return await this.prisma.users.update({
      where: { id },
      data: updateDto,
      select: {
        id: true,
        phone: true,
        email: true,
        fullName: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.users.delete({
      where: { id },
    });

    return {
      message: 'User deleted successfully',
    };
  }
}

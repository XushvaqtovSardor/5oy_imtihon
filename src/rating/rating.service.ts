import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async create(createRatingDto: CreateRatingDto) {
    return await this.prisma.rating.create({
      data: createRatingDto,
      include: {
        user: true,
        course: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.rating.findMany({
      include: {
        user: true,
        course: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByCourse(courseId: string) {
    return await this.prisma.rating.findMany({
      where: { courseId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUser(userId: number) {
    return await this.prisma.rating.findMany({
      where: { userId },
      include: {
        course: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
      include: {
        user: true,
        course: true,
      },
    });
    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
    return rating;
  }

  async getCourseAverageRating(courseId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: { courseId },
      select: { rate: true },
    });

    if (ratings.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = ratings.reduce((acc, rating) => acc + rating.rate, 0);
    const average = sum / ratings.length;

    return {
      average: Math.round(average * 10) / 10,
      count: ratings.length,
    };
  }

  async update(id: number, updateRatingDto: UpdateRatingDto) {
    await this.findOne(id);
    return await this.prisma.rating.update({
      where: { id },
      data: updateRatingDto,
      include: {
        user: true,
        course: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.rating.delete({
      where: { id },
    });
  }
}

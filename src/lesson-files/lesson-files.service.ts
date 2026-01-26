import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateLessonFileDto,
  UpdateLessonFileDto,
} from './dto/lesson-file.dto';

@Injectable()
export class LessonFilesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateLessonFileDto) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: createDto.lessonId },
    });

    if (!lesson) {
      throw new NotFoundException(
        `Lesson with ID ${createDto.lessonId} not found`,
      );
    }

    return await this.prisma.lessonFile.create({
      data: createDto,
      include: {
        lesson: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findByLesson(lessonId: string) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(lessonId)) {
      throw new BadRequestException(
        `Invalid lesson ID format: ${lessonId}. Expected UUID format.`,
      );
    }

    return await this.prisma.lessonFile.findMany({
      where: { lessonId },
      include: {
        lesson: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestException(
        `Invalid file ID: ${id}. ID must be a positive number.`,
      );
    }

    const file = await this.prisma.lessonFile.findUnique({
      where: { id },
      include: {
        lesson: true,
      },
    });

    if (!file) {
      throw new NotFoundException(`Lesson file with ID ${id} not found`);
    }

    return file;
  }

  async update(id: number, updateDto: UpdateLessonFileDto) {
    await this.findOne(id);

    return await this.prisma.lessonFile.update({
      where: { id },
      data: updateDto,
      include: {
        lesson: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.lessonFile.delete({
      where: { id },
    });

    return {
      message: 'Lesson file deleted successfully',
    };
  }
}

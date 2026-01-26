import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  async create(createLessonDto: CreateLessonDto) {
    return await this.prisma.lesson.create({
      data: createLessonDto,
      include: {
        section: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.lesson.findMany({
      include: {
        section: true,
        homework: true,
        lessonFiles: true,
      },
    });
  }

  async findOne(id: string) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException(
        `Invalid lesson ID format: ${id}. Expected UUID format.`,
      );
    }

    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        section: {
          include: {
            course: true,
          },
        },
        homework: {
          include: {
            submissions: true,
          },
        },
        lessonFiles: true,
      },
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    await this.findOne(id);
    return await this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
      include: {
        section: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.lesson.delete({
      where: { id },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonSectionDto } from './dto/create-lesson-section.dto';
import { UpdateLessonSectionDto } from './dto/update-lesson-section.dto';

@Injectable()
export class LessonSectionService {
  constructor(private prisma: PrismaService) {}

  async create(createLessonSectionDto: CreateLessonSectionDto) {
    return await this.prisma.lessonSection.create({
      data: createLessonSectionDto,
      include: {
        course: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.lessonSection.findMany({
      include: {
        course: true,
        lessons: true,
        exams: true,
      },
    });
  }

  async findOne(id: number) {
    const section = await this.prisma.lessonSection.findUnique({
      where: { id },
      include: {
        course: true,
        lessons: {
          include: {
            homework: true,
            lessonFiles: true,
          },
        },
        exams: true,
      },
    });
    if (!section) {
      throw new NotFoundException(`Lesson section with ID ${id} not found`);
    }
    return section;
  }

  async update(id: number, updateLessonSectionDto: UpdateLessonSectionDto) {
    await this.findOne(id);
    return await this.prisma.lessonSection.update({
      where: { id },
      data: updateLessonSectionDto,
      include: {
        course: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.lessonSection.delete({
      where: { id },
    });
  }
}

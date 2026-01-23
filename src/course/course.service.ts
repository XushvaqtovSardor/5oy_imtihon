import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    return await this.prisma.course.create({
      data: {
        ...createCourseDto,
        price: createCourseDto.price.toString(),
      },
      include: {
        category: true,
        mentor: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.course.findMany({
      include: {
        category: true,
        mentor: true,
        rating: true,
      },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        category: true,
        mentor: true,
        rating: true,
        lessonSection: {
          include: {
            lessons: true,
            exams: true,
          },
        },
      },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    await this.findOne(id);
    return await this.prisma.course.update({
      where: { id },
      data: {
        ...updateCourseDto,
        price: updateCourseDto.price ? updateCourseDto.price.toString() : undefined,
      },
      include: {
        category: true,
        mentor: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.course.delete({
      where: { id },
    });
  }
}

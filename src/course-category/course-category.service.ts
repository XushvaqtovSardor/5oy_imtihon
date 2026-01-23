import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseCategoryDto } from './dto/create-course-category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';

@Injectable()
export class CourseCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseCategoryDto: CreateCourseCategoryDto) {
    return await this.prisma.courseCategory.create({
      data: createCourseCategoryDto,
    });
  }

  async findAll() {
    return await this.prisma.courseCategory.findMany({
      include: {
        courses: true,
      },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.courseCategory.findUnique({
      where: { id },
      include: {
        courses: true,
      },
    });
    if (!category) {
      throw new NotFoundException(`Course category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCourseCategoryDto: UpdateCourseCategoryDto) {
    await this.findOne(id);
    return await this.prisma.courseCategory.update({
      where: { id },
      data: updateCourseCategoryDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.courseCategory.delete({
      where: { id },
    });
  }
}

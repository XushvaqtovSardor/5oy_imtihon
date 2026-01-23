import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { CreateHomeworkSubmissionDto, UpdateHomeworkSubmissionDto } from './dto/homework-submission.dto';

@Injectable()
export class HomeworkService {
  constructor(private prisma: PrismaService) {}

  async create(createHomeworkDto: CreateHomeworkDto) {
    return await this.prisma.homework.create({
      data: createHomeworkDto,
      include: {
        lesson: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.homework.findMany({
      include: {
        lesson: true,
        submissions: true,
      },
    });
  }

  async findOne(id: number) {
    const homework = await this.prisma.homework.findUnique({
      where: { id },
      include: {
        lesson: {
          include: {
            section: {
              include: {
                course: true,
              },
            },
          },
        },
        submissions: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!homework) {
      throw new NotFoundException(`Homework with ID ${id} not found`);
    }
    return homework;
  }

  async update(id: number, updateHomeworkDto: UpdateHomeworkDto) {
    await this.findOne(id);
    return await this.prisma.homework.update({
      where: { id },
      data: updateHomeworkDto,
      include: {
        lesson: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.homework.delete({
      where: { id },
    });
  }

  async createSubmission(createSubmissionDto: CreateHomeworkSubmissionDto) {
    return await this.prisma.homeworkSubmission.create({
      data: createSubmissionDto,
      include: {
        homework: true,
        user: true,
      },
    });
  }

  async findAllSubmissions() {
    return await this.prisma.homeworkSubmission.findMany({
      include: {
        homework: true,
        user: true,
      },
    });
  }

  async findOneSubmission(id: number) {
    const submission = await this.prisma.homeworkSubmission.findUnique({
      where: { id },
      include: {
        homework: {
          include: {
            lesson: true,
          },
        },
        user: true,
      },
    });
    if (!submission) {
      throw new NotFoundException(`Homework submission with ID ${id} not found`);
    }
    return submission;
  }

  async updateSubmission(id: number, updateSubmissionDto: UpdateHomeworkSubmissionDto) {
    await this.findOneSubmission(id);
    return await this.prisma.homeworkSubmission.update({
      where: { id },
      data: updateSubmissionDto,
      include: {
        homework: true,
        user: true,
      },
    });
  }

  async removeSubmission(id: number) {
    await this.findOneSubmission(id);
    return await this.prisma.homeworkSubmission.delete({
      where: { id },
    });
  }
}

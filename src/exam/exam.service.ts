import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { CreateExamResultDto } from './dto/exam-result.dto';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async create(createExamDto: CreateExamDto) {
    return await this.prisma.exam.create({
      data: createExamDto,
      include: {
        lessonBolim: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.exam.findMany({
      include: {
        lessonBolim: true,
      },
    });
  }

  async findOne(id: number) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        lessonBolim: {
          include: {
            course: true,
          },
        },
      },
    });
    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }
    return exam;
  }

  async findBySection(sectionId: number) {
    return await this.prisma.exam.findMany({
      where: { lessonBolimId: sectionId },
      include: {
        lessonBolim: true,
      },
    });
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    await this.findOne(id);
    return await this.prisma.exam.update({
      where: { id },
      data: updateExamDto,
      include: {
        lessonBolim: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.exam.delete({
      where: { id },
    });
  }

  async createResult(createResultDto: CreateExamResultDto) {
    return await this.prisma.examResult.create({
      data: createResultDto,
      include: {
        lessonSection: true,
        user: true,
      },
    });
  }

  async findAllResults() {
    return await this.prisma.examResult.findMany({
      include: {
        lessonSection: true,
        user: true,
      },
    });
  }

  async findResultsByUser(userId: number) {
    return await this.prisma.examResult.findMany({
      where: { userId },
      include: {
        lessonSection: {
          include: {
            course: true,
          },
        },
      },
    });
  }
}

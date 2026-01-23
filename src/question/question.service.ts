import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateQuestionAnswerDto, UpdateQuestionAnswerDto } from './dto/question-answer.dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async create(createQuestionDto: CreateQuestionDto) {
    return await this.prisma.question.create({
      data: createQuestionDto,
      include: {
        user: true,
        course: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.question.findMany({
      include: {
        user: true,
        course: true,
        answer: true,
      },
    });
  }

  async findOne(id: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        user: true,
        course: true,
        answer: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async findByCourse(courseId: string) {
    return await this.prisma.question.findMany({
      where: { courseId },
      include: {
        user: true,
        answer: true,
      },
    });
  }

  async findByUser(userId: number) {
    return await this.prisma.question.findMany({
      where: { userId },
      include: {
        course: true,
        answer: true,
      },
    });
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    await this.findOne(id);
    return await this.prisma.question.update({
      where: { id },
      data: updateQuestionDto,
      include: {
        user: true,
        course: true,
      },
    });
  }

  async markAsRead(id: number) {
    await this.findOne(id);
    return await this.prisma.question.update({
      where: { id },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.question.delete({
      where: { id },
    });
  }

  async createAnswer(createAnswerDto: CreateQuestionAnswerDto) {
    return await this.prisma.questionAnswer.create({
      data: createAnswerDto,
      include: {
        question: true,
        user: true,
      },
    });
  }

  async findAnswer(id: number) {
    const answer = await this.prisma.questionAnswer.findUnique({
      where: { id },
      include: {
        question: true,
        user: true,
      },
    });
    if (!answer) {
      throw new NotFoundException(`Answer with ID ${id} not found`);
    }
    return answer;
  }

  async updateAnswer(id: number, updateAnswerDto: UpdateQuestionAnswerDto) {
    await this.findAnswer(id);
    return await this.prisma.questionAnswer.update({
      where: { id },
      data: updateAnswerDto,
      include: {
        question: true,
        user: true,
      },
    });
  }

  async removeAnswer(id: number) {
    await this.findAnswer(id);
    return await this.prisma.questionAnswer.delete({
      where: { id },
    });
  }
}

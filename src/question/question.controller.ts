import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { QuestionsService } from './question.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';

@ApiTags('Questions & Answers')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}
  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'STUDENT: Get my questions' })
  findMyQuestions() {
    return this.questionsService.findMyQuestions();
  }

  @Get('course/:courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'MENTOR, ADMIN, ASSISTANT: Get questions by course',
  })
  findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.questionsService.findByCourse(courseId);
  }

  @Get('single/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get single question by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.findOne(id);
  }

  @Post('read/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'MENTOR, ADMIN, ASSISTANT: Mark question as read' })
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.markAsRead(id);
  }

  @Post('create/:courseId')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'STUDENT: Create question' })
  create(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return this.questionsService.create(courseId, createQuestionDto);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'STUDENT: Update question' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Post('answer/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ASSISTANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'MENTOR, ASSISTANT: Answer question' })
  answer(
    @Param('id', ParseIntPipe) id: number,
    @Body() answerDto: AnswerQuestionDto,
  ) {
    return this.questionsService.answer(id, answerDto);
  }

  @Patch('answer/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ASSISTANT, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'MENTOR, ASSISTANT, ADMIN: Update answer' })
  updateAnswer(
    @Param('id', ParseIntPipe) id: number,
    @Body() answerDto: AnswerQuestionDto,
  ) {
    return this.questionsService.updateAnswer(id, answerDto);
  }

  @Delete('answer/delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ASSISTANT, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'MENTOR, ASSISTANT, ADMIN: Delete answer' })
  deleteAnswer(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.deleteAnswer(id);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'STUDENT: Delete question' })
  deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.deleteQuestion(id);
  }
}

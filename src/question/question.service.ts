import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';

@Injectable()
export class QuestionsService {
  private questions: any[] = [];
  private answers: any[] = [];

  findMyQuestions() {
    return this.questions;
  }

  findByCourse(courseId: number) {
    return this.questions.filter((q) => q.courseId === courseId);
  }

  findOne(id: number) {
    const question = this.questions.find((q) => q.id === id);
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  markAsRead(id: number) {
    const question = this.findOne(id);
    question.read = true;
    question.readAt = new Date();
    return { message: 'Marked as read', question };
  }

  create(courseId: number, createQuestionDto: CreateQuestionDto) {
    const newQuestion = {
      id: this.questions.length + 1,
      ...createQuestionDto,
      courseId,
      read: false,
      createdAt: new Date(),
    };
    this.questions.push(newQuestion);
    return newQuestion;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const questionIndex = this.questions.findIndex((q) => q.id === id);
    if (questionIndex === -1) throw new NotFoundException('Question not found');
    this.questions[questionIndex] = {
      ...this.questions[questionIndex],
      ...updateQuestionDto,
    };
    return this.questions[questionIndex];
  }

  answer(id: number, answerDto: AnswerQuestionDto) {
    const question = this.findOne(id);
    const newAnswer = {
      id: this.answers.length + 1,
      questionId: id,
      ...answerDto,
      createdAt: new Date(),
    };
    this.answers.push(newAnswer);
    return { message: 'Answer added', answer: newAnswer };
  }

  updateAnswer(id: number, answerDto: AnswerQuestionDto) {
    const answerIndex = this.answers.findIndex((a) => a.id === id);
    if (answerIndex === -1) throw new NotFoundException('Answer not found');
    this.answers[answerIndex] = { ...this.answers[answerIndex], ...answerDto };
    return this.answers[answerIndex];
  }

  deleteAnswer(id: number) {
    const answerIndex = this.answers.findIndex((a) => a.id === id);
    if (answerIndex === -1) throw new NotFoundException('Answer not found');
    const deleted = this.answers.splice(answerIndex, 1);
    return { message: 'Answer deleted', answer: deleted[0] };
  }

  deleteQuestion(id: number) {
    const questionIndex = this.questions.findIndex((q) => q.id === id);
    if (questionIndex === -1) throw new NotFoundException('Question not found');
    const deleted = this.questions.splice(questionIndex, 1);
    return { message: 'Question deleted', question: deleted[0] };
  }
}

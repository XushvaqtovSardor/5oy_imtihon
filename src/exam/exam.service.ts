import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { CreateExamResultDto } from './dto/exam-result.dto';

@Injectable()
export class ExamService {
  private exams: any[] = [];
  private results: any[] = [];
  findByLessonGroup(lessonGroupId: number) {
    return this.exams.filter((exam) => exam.lessonGroupId === lessonGroupId);
  }
  createResult(createResultDto: CreateExamResultDto) {
    const newResult = { id: this.results.length + 1, ...createResultDto };
    this.results.push(newResult);
    return newResult;
  }

  findDetailsByLessonGroup(id: number) {
    const exams = this.exams.filter((exam) => exam.lessonGroupId === id);
    if (!exams.length) throw new NotFoundException('Exams not found');
    return exams;
  }
  findOne(id: number) {
    const exam = this.exams.find((e) => e.id === id);
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }
  create(createExamDto: CreateExamDto) {
    const newExam = { id: this.exams.length + 1, ...createExamDto };
    this.exams.push(newExam);
    return newExam;
  }

  createMany(createExamDto: CreateExamDto[]) {
    const newExams = createExamDto.map((dto, idx) => ({
      id: this.exams.length + idx + 1,
      ...dto,
    }));
    this.exams.push(...newExams);
    return newExams;
  }

  update(id: number, updateExamDto: UpdateExamDto) {
    const examIndex = this.exams.findIndex((e) => e.id === id);
    if (examIndex === -1) throw new NotFoundException('Exam not found');
    this.exams[examIndex] = { ...this.exams[examIndex], ...updateExamDto };
    return this.exams[examIndex];
  }

  remove(id: number) {
    const examIndex = this.exams.findIndex((e) => e.id === id);
    if (examIndex === -1) throw new NotFoundException('Exam not found');
    const deleted = this.exams.splice(examIndex, 1);
    return deleted[0];
  }

  findAllResults() {
    return this.results;
  }

  findResultsByLessonGroup(id: number) {
    return this.results.filter((result) => result.lessonGroupId === id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { CreateExamResultDto } from './dto/exam-result.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Exams')
@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get('lesson-group/:lessonGroupId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'STUDENT: Get exams by lesson group' })
  findByLessonGroup(
    @Param('lessonGroupId', ParseIntPipe) lessonGroupId: number,
  ) {
    return this.examService.findByLessonGroup(lessonGroupId);
  }

  @Post('pass')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'STUDENT: Submit exam result' })
  submitExam(@Body() createResultDto: CreateExamResultDto) {
    return this.examService.createResult(createResultDto);
  }

  @Get('lesson-group/details/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'MENTOR, ADMIN: Get exam details by lesson group' })
  findDetailsByLessonGroup(@Param('id', ParseIntPipe) id: number) {
    return this.examService.findDetailsByLessonGroup(id);
  }

  @Get('detail/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ADMIN, MENTOR: Get exam detail by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.examService.findOne(id);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ADMIN, MENTOR: Create exam' })
  create(@Body() createExamDto: CreateExamDto) {
    return this.examService.create(createExamDto);
  }

  @Post('create/many')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ADMIN, MENTOR' })
  createMany(@Body() createExamDto: CreateExamDto[]) {
    return this.examService.createMany(createExamDto);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ADMIN, MENTOR' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExamDto: UpdateExamDto,
  ) {
    return this.examService.update(id, updateExamDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ADMIN, MENTOR' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.examService.remove(id);
  }

  @Get('results')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ADMIN' })
  findAllResults() {
    return this.examService.findAllResults();
  }

  @Get('results/lesson-group/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'MENTOR' })
  findResultsByLessonGroup(@Param('id', ParseIntPipe) id: number) {
    return this.examService.findResultsByLessonGroup(id);
  }
}

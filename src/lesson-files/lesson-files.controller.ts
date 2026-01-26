import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LessonFilesService } from './lesson-files.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/auth/dto/dto';
import { CreateLessonFileDto } from './dto/lesson-file.dto';

@ApiTags('Lesson Files')
@Controller('api/lesson-files')
export class LessonFilesController {
  constructor(private readonly lessonFilesService: LessonFilesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({
    summary: 'Create lesson file',
    description: 'Add a file to a lesson (Admin, Mentor)',
  })
  @ApiResponse({ status: 201, description: 'Lesson file created successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async create(@Body() createDto: CreateLessonFileDto) {
    return this.lessonFilesService.create(createDto);
  }

  @Get('lesson/:lesson_id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({
    summary: 'Get files for a lesson',
    description: 'Retrieve all files for a specific lesson (Admin, Mentor)',
  })
  @ApiResponse({ status: 200, description: 'List of lesson files' })
  async findByLesson(@Param('lesson_id') lessonId: string) {
    return this.lessonFilesService.findByLesson(lessonId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({
    summary: 'Delete lesson file',
    description: 'Remove a file from a lesson (Admin, Mentor)',
  })
  @ApiResponse({ status: 200, description: 'Lesson file deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lesson file not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.lessonFilesService.remove(id);
  }
}

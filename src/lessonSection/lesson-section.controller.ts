import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LessonSectionService } from './lesson-section.service';
import { CreateLessonSectionDto } from './dto/create-lesson-section.dto';
import { UpdateLessonSectionDto } from './dto/update-lesson-section.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Lesson-sections')
@Controller('lessonSections')
export class LessonSectionController {
  constructor(private readonly lessonSectionService: LessonSectionService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new lesson section' })
  create(@Body() createLessonSectionDto: CreateLessonSectionDto) {
    return this.lessonSectionService.create(createLessonSectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lesson sections' })
  findAll() {
    return this.lessonSectionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson section by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lessonSectionService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lesson section' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateLessonSectionDto: UpdateLessonSectionDto) {
    return this.lessonSectionService.update(id, updateLessonSectionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete lesson section' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lessonSectionService.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('ratings')
@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new rating' })
  create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.create(createRatingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ratings' })
  findAll() {
    return this.ratingService.findAll();
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get ratings by course' })
  findByCourse(@Param('courseId') courseId: string) {
    return this.ratingService.findByCourse(courseId);
  }

  @Get('course/:courseId/average')
  @ApiOperation({ summary: 'Get average rating for a course' })
  getCourseAverageRating(@Param('courseId') courseId: string) {
    return this.ratingService.getCourseAverageRating(courseId);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get ratings by user' })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.ratingService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rating by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ratingService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update rating' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingService.update(id, updateRatingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete rating' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ratingService.remove(id);
  }
}

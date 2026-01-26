import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FilterCourseDto } from './dto/filter-course.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Courses')
@Controller('courses')
export class CourseController {
  private readonly logger = new Logger(CourseController.name);

  constructor(private readonly courseService: CourseService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new course (ADMIN, MENTOR only)' })
  @ApiResponse({
    status: 201,
    description: 'Course created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createCourseDto: CreateCourseDto) {
    this.logger.log('Creating new course');
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all courses with filters',
    description:
      'Get paginated list of courses with optional filters for search, level, category, mentor, and price range',
  })
  @ApiResponse({
    status: 200,
    description: 'Courses retrieved successfully',
    schema: {
      example: {
        data: [
          {
            id: 'uuid',
            name: 'JavaScript Basics',
            about: 'Learn JavaScript from scratch',
            price: '99.99',
            level: 'BEGINNER',
            banner: 'url',
            introVideo: 'url',
            published: true,
            categoryId: 'category-uuid',
            mentorId: 'mentor-uuid',
          },
        ],
        total: 100,
        offset: 0,
        limit: 10,
      },
    },
  })
  findAll(@Query() filterDto: FilterCourseDto) {
    this.logger.log(
      `Fetching courses with filters: ${JSON.stringify(filterDto)}`,
    );
    return this.courseService.findAll(filterDto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get courses created by the logged-in mentor',
    description:
      'Get list of courses with filters (offset, limit, search, level, category, price range, published status)',
  })
  @ApiResponse({
    status: 200,
    description: 'Mentor courses retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMyCourses(@Query() filterDto: FilterCourseDto) {
    this.logger.log(
      `Fetching my courses with filters: ${JSON.stringify(filterDto)}`,
    );
    return this.courseService.findAll(filterDto);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all courses including unpublished (ADMIN only)',
    description:
      'Admin endpoint to get all courses regardless of published status',
  })
  @ApiResponse({
    status: 200,
    description: 'All courses retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  findAllAdmin() {
    this.logger.log('Admin fetching all courses');
    return this.courseService.findAllAdmin();
  }

  @Get('single/:id')
  @ApiOperation({
    summary: 'Get single course by ID',
    description:
      'Get detailed information about a specific course including sections, lessons, and exams',
  })
  @ApiResponse({
    status: 200,
    description: 'Course retrieved successfully',
    schema: {
      example: {
        id: 'uuid',
        name: 'JavaScript Basics',
        about: 'Learn JavaScript',
        price: '99.99',
        level: 'BEGINNER',
        banner: 'url',
        introVideo: 'url',
        published: true,
        category: { id: 'uuid', name: 'Programming' },
        mentor: { id: 'uuid', fullName: 'John Doe' },
        lessonSection: [],
        rating: [],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(@Param('id') id: string) {
    this.logger.log(`Fetching course with ID: ${id}`);
    return this.courseService.findOne(id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update course (ADMIN, MENTOR only)' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    this.logger.log(`Updating course ${id}`);
    return this.courseService.update(id, updateCourseDto);
  }

  @Post('publish/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a course (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Course published successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  publish(@Param('id') id: string) {
    this.logger.log(`Publishing course ${id}`);
    return this.courseService.publish(id);
  }

  @Post('unpublish/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unpublish a course (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Course unpublished successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  unpublish(@Param('id') id: string) {
    this.logger.log(`Unpublishing course ${id}`);
    return this.courseService.unpublish(id);
  }

  @Patch('update-mentor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update mentor for a course (ADMIN only)' })
  @ApiResponse({
    status: 200,
    description: 'Course mentor updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  updateMentor() {
    this.logger.log('Updating course mentor');
    return this.courseService.findAllAdmin();
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete course (ADMIN, MENTOR only)' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  remove(@Param('id') id: string) {
    this.logger.log(`Deleting course ${id}`);
    return this.courseService.remove(id);
  }
}

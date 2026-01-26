import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FilterCourseDto } from './dto/filter-course.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    try {
      this.logger.log(`Creating course: ${createCourseDto.name}`);
      const course = await this.prisma.course.create({
        data: {
          ...createCourseDto,
          price: createCourseDto.price.toString(),
        },
        include: {
          category: true,
          mentor: true,
        },
      });
      this.logger.log(`Course created successfully with ID: ${course.id}`);
      return course;
    } catch (error) {
      this.logger.error(`Failed to create course: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async findAll(filterDto: FilterCourseDto = {}) {
    try {
      const {
        offset = 0,
        limit = 10,
        search,
        level,
        categoryId,
        mentorId,
        price_min,
        price_max,
        published = true,
      } = filterDto;

      this.logger.log(
        `Finding courses with filters: ${JSON.stringify(filterDto)}`,
      );

      const where: Prisma.CourseWhereInput = {
        published: published,
      };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { about: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (level) {
        where.level = level;
      }

      if (categoryId) {
        where.categoryId = categoryId;
      }

      if (mentorId) {
        where.mentorId = mentorId;
      }

      if (price_min !== undefined || price_max !== undefined) {
        where.AND = where.AND || [];
        if (price_min !== undefined) {
          (where.AND as any[]).push({
            price: { gte: price_min.toString() },
          });
        }
        if (price_max !== undefined) {
          (where.AND as any[]).push({
            price: { lte: price_max.toString() },
          });
        }
      }

      const [data, total] = await Promise.all([
        this.prisma.course.findMany({
          where,
          skip: offset,
          take: limit,
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            mentor: {
              select: {
                id: true,
                fullName: true,
                image: true,
              },
            },
            rating: {
              select: {
                id: true,
                rate: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.course.count({ where }),
      ]);

      this.logger.log(`Found ${data.length} courses out of ${total} total`);

      return {
        data,
        total,
        offset,
        limit,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch courses: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async findAllAdmin() {
    try {
      this.logger.log('Admin fetching all courses');
      const courses = await this.prisma.course.findMany({
        include: {
          category: true,
          mentor: true,
          rating: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      this.logger.log(`Found ${courses.length} courses`);
      return courses;
    } catch (error) {
      this.logger.error(
        `Failed to fetch all courses: ${JSON.stringify(error)}`,
      );
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      this.logger.log(`Finding course with ID: ${id}`);
      const course = await this.prisma.course.findUnique({
        where: { id },
        include: {
          category: true,
          mentor: {
            select: {
              id: true,
              fullName: true,
              image: true,
              email: true,
            },
          },
          rating: true,
          lessonSection: {
            include: {
              lessons: true,
              exams: true,
            },
          },
        },
      });

      if (!course) {
        this.logger.warn(`Course with ID ${id} not found`);
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      this.logger.log(`Course found: ${course.name}`);
      return course;
    } catch (error) {
      this.logger.error(
        `Failed to fetch course ${id}: ${JSON.stringify(error)}`,
      );
      throw error;
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      this.logger.log(`Updating course ${id}`);
      await this.findOne(id);

      const updated = await this.prisma.course.update({
        where: { id },
        data: {
          ...updateCourseDto,
          price: updateCourseDto.price
            ? updateCourseDto.price.toString()
            : undefined,
        },
        include: {
          category: true,
          mentor: true,
        },
      });

      this.logger.log(`Course ${id} updated successfully`);
      return updated;
    } catch (error) {
      this.logger.error(
        `Failed to update course ${id}: ${JSON.stringify(error)}`,
      );
      throw error;
    }
  }

  async publish(id: string) {
    try {
      this.logger.log(`Publishing course ${id}`);
      const course = await this.prisma.course.update({
        where: { id },
        data: { published: true },
      });
      this.logger.log(`Course ${id} published successfully`);
      return { message: 'Course published successfully', course };
    } catch (error) {
      this.logger.error(
        `Failed to publish course ${id}: ${JSON.stringify(error)}`,
      );
      throw error;
    }
  }

  async unpublish(id: string) {
    try {
      this.logger.log(`Unpublishing course ${id}`);
      const course = await this.prisma.course.update({
        where: { id },
        data: { published: false },
      });
      this.logger.log(`Course ${id} unpublished successfully`);
      return { message: 'Course unpublished successfully', course };
    } catch (error) {
      this.logger.error(
        `Failed to unpublish course ${id}: ${JSON.stringify(error)}`,
      );
      throw error;
    }
  }

  async remove(id: string) {
    try {
      this.logger.log(`Deleting course ${id}`);
      await this.findOne(id);
      const deleted = await this.prisma.course.delete({
        where: { id },
      });
      this.logger.log(`Course ${id} deleted successfully`);
      return { message: 'Course deleted successfully', course: deleted };
    } catch (error) {
      this.logger.error(
        `Failed to delete course ${id}: ${JSON.stringify(error)}`,
      );
      throw error;
    }
  }
}

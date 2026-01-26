import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { CourseLevel } from '@prisma/client';

export class FilterCourseDto {
  @ApiPropertyOptional({
    description: 'Offset for pagination',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({
    description: 'Limit for pagination',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search by course name',
    example: 'JavaScript',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by course level',
    enum: CourseLevel,
    example: 'Beginner',
  })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiPropertyOptional({
    description: 'Filter by category ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Filter by mentor ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  mentorId?: number;

  @ApiPropertyOptional({ description: 'Minimum price filter', example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price_min?: number;

  @ApiPropertyOptional({ description: 'Maximum price filter', example: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price_max?: number;

  @ApiPropertyOptional({
    description: 'Filter by published status',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  published?: boolean = true;
}

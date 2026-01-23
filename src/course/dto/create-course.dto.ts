import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDecimal, IsBoolean, IsInt, IsEnum, IsOptional } from 'class-validator';
import { CourseLevel } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  banner: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  introVedio?: string;

  @ApiProperty({ enum: CourseLevel })
  @IsEnum(CourseLevel)
  @IsNotEmpty()
  level: CourseLevel;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  mentorId: number;
}

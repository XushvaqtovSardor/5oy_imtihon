import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLessonFileDto {
  @ApiProperty({ description: 'File URL or path' })
  @IsString()
  @IsNotEmpty()
  file: string;

  @ApiProperty({ description: 'File note or description', required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ description: 'Lesson ID' })
  @IsString()
  @IsNotEmpty()
  lessonId: string;
}

export class UpdateLessonFileDto {
  @ApiProperty({ description: 'File URL or path', required: false })
  @IsString()
  @IsOptional()
  file?: string;

  @ApiProperty({ description: 'File note or description', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsInt } from 'class-validator';
import { ExamAnswer } from '@prisma/client';

export class CreateExamDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  variantA: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  variantB: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  variantC: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  variantD: string;

  @ApiProperty({ enum: ExamAnswer })
  @IsEnum(ExamAnswer)
  @IsNotEmpty()
  answer: ExamAnswer;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  lessonBolimId: number;
}

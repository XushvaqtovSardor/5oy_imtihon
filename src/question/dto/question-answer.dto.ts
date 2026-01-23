import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateQuestionAnswerDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  questionId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  file?: string;
}

export class UpdateQuestionAnswerDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  file?: string;
}

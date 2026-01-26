import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class AnswerQuestionDto {
  @ApiProperty({ description: 'Answer text' })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiProperty({ description: 'User ID who answered', required: false })
  @IsInt()
  userId?: number;
}

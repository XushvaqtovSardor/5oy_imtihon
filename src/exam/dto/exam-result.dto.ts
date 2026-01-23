import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateExamResultDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  lessonBolimId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  passed: boolean;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  corrects: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  wrongs: number;
}

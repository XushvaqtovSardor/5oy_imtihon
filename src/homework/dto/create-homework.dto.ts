import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHomeworkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  task: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  file?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lessonId: string;
}

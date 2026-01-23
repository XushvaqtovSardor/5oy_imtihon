import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vedio: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  sectionId: number;
}

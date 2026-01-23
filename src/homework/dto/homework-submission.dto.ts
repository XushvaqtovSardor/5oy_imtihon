import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt } from 'class-validator';
import { HomeworkSubStatus } from '@prisma/client';

export class CreateHomeworkSubmissionDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  file: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  homeworkId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;
}

export class UpdateHomeworkSubmissionDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  file?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({ enum: HomeworkSubStatus, required: false })
  @IsEnum(HomeworkSubStatus)
  @IsOptional()
  status?: HomeworkSubStatus;
}

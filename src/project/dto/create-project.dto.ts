import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ProjectCategory } from '@prisma/client';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  githubUrl: string;

  @ApiProperty({ enum: ProjectCategory })
  @IsEnum(ProjectCategory)
  @IsNotEmpty()
  category: ProjectCategory;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  stack: string;
}

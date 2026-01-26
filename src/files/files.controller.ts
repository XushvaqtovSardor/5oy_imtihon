import { Controller, Get, Param, UseGuards, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FilesService } from './files.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/auth/dto/dto';

@ApiTags('Files')
@Controller('api/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('public/:name')
  @ApiOperation({
    summary: 'Get public file',
    description: 'Access a public file by name',
  })
  @ApiResponse({ status: 200, description: 'File retrieved successfully' })
  getPublicFile(@Param('name') name: string) {
    return this.filesService.getPublicFile(name);
  }

  @Get('private/lesson-file/:lessonId/:name')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    summary: 'STUDENT',
    description: 'Access a private lesson file (Student)',
  })
  @ApiResponse({ status: 200, description: 'File retrieved successfully' })
  getPrivateLessonFile(
    @Param('lessonId') lessonId: string,
    @Param('name') name: string,
  ) {
    return this.filesService.getPrivateLessonFile(lessonId, name);
  }

  @Get('private/video/:lessonId/:hlsf')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    summary: 'STUDENT',
    description: 'Access a private video file (Student)',
  })
  @ApiResponse({ status: 200, description: 'Video retrieved successfully' })
  getPrivateVideo(
    @Param('lessonId') lessonId: string,
    @Param('hlsf') hlsf: string,
  ) {
    return this.filesService.getPrivateVideo(lessonId, hlsf);
  }
}

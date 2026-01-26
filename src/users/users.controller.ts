import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/auth/dto/dto';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve all users (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'List of users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('mentors')
  @ApiOperation({
    summary: 'Get all mentors',
    description: 'Retrieve all mentors (public access)',
  })
  @ApiResponse({ status: 200, description: 'List of mentors' })
  async findMentors() {
    return this.usersService.findMentors();
  }

  @Get('mentors/:id')
  @ApiOperation({
    summary: 'Get mentor by ID',
    description: 'Retrieve a specific mentor (public access)',
  })
  @ApiResponse({ status: 200, description: 'Mentor details' })
  @ApiResponse({ status: 404, description: 'Mentor not found' })
  async findMentor(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findMentor(id);
  }

  @Get('single/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a specific user (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get('by-phone/:phone')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({
    summary: 'Get user by phone number',
    description: 'Retrieve a user by phone (Admin, Mentor)',
  })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByPhone(@Param('phone') phone: string) {
    return this.usersService.findByPhone(phone);
  }

  @Post('create/admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create admin user',
    description: 'Create a new admin user (Admin only)',
  })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 400, description: 'Phone or email already exists' })
  async createAdmin(@Body() createDto: CreateUserDto) {
    createDto.role = UserRole.ADMIN;
    return this.usersService.createAdmin(createDto);
  }

  @Post('create/mentor')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create mentor user',
    description: 'Create a new mentor user (Admin only)',
  })
  @ApiResponse({ status: 201, description: 'Mentor created successfully' })
  @ApiResponse({ status: 400, description: 'Phone or email already exists' })
  async createMentor(@Body() createDto: CreateUserDto) {
    return this.usersService.createMentor(createDto);
  }

  @Post('create/assistant')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({
    summary: 'Create assistant user',
    description: 'Create a new assistant user (Admin, Mentor)',
  })
  @ApiResponse({ status: 201, description: 'Assistant created successfully' })
  @ApiResponse({ status: 400, description: 'Phone or email already exists' })
  async createAssistant(@Body() createDto: CreateUserDto) {
    return this.usersService.createAssistant(createDto);
  }

  @Patch('update/mentor/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Update mentor',
    description: 'Update mentor details (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'Mentor updated successfully' })
  @ApiResponse({ status: 404, description: 'Mentor not found' })
  async updateMentor(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserDto,
  ) {
    return this.usersService.updateMentor(id, updateDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete a user (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}

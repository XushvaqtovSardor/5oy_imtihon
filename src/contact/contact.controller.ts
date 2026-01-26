import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
    schema: {
      example: {
        message: 'your message sent',
        data: {
          id: 1,
          fullName: 's',
          email: 's@example.com',
          phone: '+9989',
          message: 'm',
          createdAt: '2026-01-26T10:00:00.000Z',
        },
      },
    },
  })
  async create(@Body() contactDto: ContactDto) {
    return this.contactService.create(contactDto);
  }

  @Get()
  @ApiOperation({
    summary: 'ADMIN',
    description: 'Retrieve all contact form submissions',
  })
  @ApiResponse({
    status: 200,
    description: 'List of contact messages',
  })
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.contactService.findAll();
  }
}

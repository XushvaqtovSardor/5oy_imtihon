import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class ContactDto {
  @ApiProperty({ description: 'Full name', example: 'S' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Email address', example: 's@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Phone number', example: '+9989' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Message',
    example: 'm',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

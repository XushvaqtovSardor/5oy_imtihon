import { Injectable } from '@nestjs/common';
import { ContactDto } from './dto/contact.dto';

export interface ContactMessage {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
}

@Injectable()
export class ContactService {
  private messages: ContactMessage[] = [];
  private idCounter = 1;

  async create(contactDto: ContactDto) {
    const message: ContactMessage = {
      id: this.idCounter++,
      ...contactDto,
      createdAt: new Date(),
    };

    this.messages.push(message);

    return {
      message: 'your message sent',
      data: message,
    };
  }

  async findAll() {
    return this.messages.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }
}

import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { MessagesService } from '../services/message.service';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { UpdateMessageDto } from '../dtos/update-message.dto';
import { Message } from '../entities/message.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Body() dto: CreateMessageDto): Promise<Message> {
    const { conversationId, senderId, text } = dto;
    return this.messagesService.create(conversationId, senderId, text);
  }

  @Get('conversation/:conversationId')
  async findByConversation(@Param('conversationId', ParseIntPipe) conversationId: number): Promise<Message[]> {
    return this.messagesService.findByConversation(conversationId);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMessageDto): Promise<Message> {
    return this.messagesService.update(id, dto.text);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ deleted: boolean }> {
    return this.messagesService.delete(id);
  }
}

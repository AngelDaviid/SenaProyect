import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';

import { EventsService } from '../services/events.service';
import { CreateEventDto, UpdateEventDto } from '../dto/events.dto';
import { Event } from '../entities/events.entity';
import { Payload } from '../../auth/models/payload.model';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'Crear un nuevo evento' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createEventDto: CreateEventDto, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.eventsService.create(createEventDto, userId);
  }

  @ApiResponse({ status: 201, description: 'Eventos obtenidos correctamente.' })
  @ApiOperation({ summary: 'Obtener todos los eventos' })
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @ApiResponse({ status: 200, description: 'Evento encontrado correctamente.', type: Event })
  @ApiOperation({ summary: 'Obtener un evento por ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un evento por ID' })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @ApiOperation({ summary: 'Eliminar un evento por ID' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}

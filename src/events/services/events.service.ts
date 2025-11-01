import {Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Event} from '../entities/events.entity';
import {CreateEventDto} from '../dto/events.dto';
import {UpdateEventDto} from '../dto/events.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>
  ) {
  }

  async create(createEventDto: CreateEventDto, userId: number, imageUrl?: string) {
    try {
      const newEvent = await this.eventsRepository.save({
        ...createEventDto,
        user: {id: userId},
        category: {id: createEventDto.categoryId},
        imageUrl: imageUrl,
      });
      return this.findOne(newEvent.id);
    } catch (error) {
      throw new BadRequestException('Error al crear el evento. Verifica los datos proporcionados.');
    }
  }

  async findAll() {
    return await this.eventsRepository.find({
      relations: ['user', 'category'],
    });
  }

  async findOne(id: number) {
    const event = await this.eventsRepository.findOne({
      where: {id},
      relations: ['user', 'category'],
    });
    if (!event) {
      throw new NotFoundException(`Evento con id ${id} no encontrado`);
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    try {
      const event = await this.findOne(id);
      const updatedEvent = this.eventsRepository.merge(event, updateEventDto);
      return await this.eventsRepository.save(updatedEvent);
    } catch {
      throw new BadRequestException('Error al actualizar el evento');
    }
  }

  async remove(id: number) {
    try {
      await this.eventsRepository.delete(id);
      return {message: 'Evento eliminado correctamente.'};
    } catch {
      throw new BadRequestException('Error al eliminar el evento');
    }
  }
}

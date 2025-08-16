import {IsNotEmpty, IsNumber, IsString} from 'class-validator';
import {PartialType} from "@nestjs/swagger";

export class CreateEventDto {

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}

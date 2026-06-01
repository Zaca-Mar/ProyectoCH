import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LocalidadService } from './localidad.service';
import { CreateLocalidadDto } from './dto/create-localidad.dto';

@Controller('localidad')
export class LocalidadController {
  constructor(private readonly localidadService: LocalidadService) {}

  @Post()
  create(@Body() createLocalidadDto: CreateLocalidadDto) {
    return this.localidadService.create(createLocalidadDto);
  }

  @Get()
  findAll() {
    return this.localidadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.localidadService.findOne(+id);
  }
}
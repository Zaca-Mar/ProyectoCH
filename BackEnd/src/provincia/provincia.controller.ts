import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProvinciaService } from './provincia.service';
import { CreateProvinciaDto } from './dto/create-provincia.dto';

@Controller('provincia')
export class ProvinciaController {
  constructor(private readonly provinciaService: ProvinciaService) {}

  @Post()
  create(@Body() createProvinciaDto: CreateProvinciaDto) {
    return this.provinciaService.create(createProvinciaDto);
  }

  @Get()
  findAll() {
    return this.provinciaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.provinciaService.findOne(+id);
  }
}
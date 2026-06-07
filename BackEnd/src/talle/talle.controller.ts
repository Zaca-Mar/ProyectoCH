import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TalleService } from './talle.service';

@Controller('talle')
export class TalleController {
  constructor(private readonly talleService: TalleService) {}

  @Post()
  create(@Body() data: { nombre: string }) {
    return this.talleService.create(data);
  }

  @Get()
  findAll() {
    return this.talleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.talleService.findOne(+id);
  }
}
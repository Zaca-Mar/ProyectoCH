import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ArticulosService } from './articulos.service';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';

@Controller('articulos')
export class ArticulosController {
  constructor(private readonly articulosService: ArticulosService) {}

  @Post()
  create(@Body() createArticuloDto: CreateArticuloDto) {
    return this.articulosService.create(createArticuloDto);
  }

  @Get()
  findAll() {
    return this.articulosService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticuloDto: UpdateArticuloDto) {
    return this.articulosService.update(+id, updateArticuloDto);
  }
}
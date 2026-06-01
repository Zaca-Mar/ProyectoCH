import { Controller, Get, Post, Body } from '@nestjs/common';
import { ArticulosService } from './articulos.service';
import { CreateArticuloDto } from './dto/create-articulo.dto';

@Controller('articulos') // La ruta base será http://localhost:3000/articulos
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
}
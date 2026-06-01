import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MovimientosStockService } from './movimientos_stock.service';
import { CreateMovimientosStockDto } from './dto/create-movimientos_stock.dto';

@Controller('movimientos-stock')
export class MovimientosStockController {
  constructor(private readonly movimientosStockService: MovimientosStockService) {}

  @Post()
  create(@Body() createMovimientosStockDto: CreateMovimientosStockDto) {
    return this.movimientosStockService.create(createMovimientosStockDto);
  }

  @Get()
  findAll() {
    return this.movimientosStockService.findAll();
  }

  // Endpoint para filtrar (Ej: /movimientos-stock/filtrar?id_taller=2&id_estado=1)
  @Get('filtrar')
  filter(
    @Query('id_taller') idTaller: string,
    @Query('id_estado') idEstado: string
  ) {
    return this.movimientosStockService.findByTallerAndEstado(+idTaller, +idEstado);
  }
}
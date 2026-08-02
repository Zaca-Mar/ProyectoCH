import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { MovimientosStockService } from './movimientos_stock.service';
import { CreateMovimientosStockDto } from './dto/create-movimientos_stock.dto';
import { UpdateMovimientosStockDto } from './dto/update-movimientos_stock.dto';

@Controller('movimientos-stock')
export class MovimientosStockController {
  constructor(private readonly movimientosStockService: MovimientosStockService) {}

  @Post()
  create(@Body() createMovimientosStockDto: CreateMovimientosStockDto) {
    console.log('=== CONTROLADOR BACKEND: DATOS RECIBIDOS ===');
    console.log(createMovimientosStockDto);
    console.log('============================================');
    return this.movimientosStockService.create(createMovimientosStockDto);
  }

  @Get()
  findAll() {
    return this.movimientosStockService.findAll();
  }

  // Endpoint para filtrar (Ej: /movimientos-stock/filtrar?id_taller=4)
  @Get('filtrar')
  filter(
    @Query('id_taller') idTaller: string,
    @Query('id_estado') idEstado?: string, // 🔒 Opcional
  ) {
    const estadoParsed = idEstado ? Number(idEstado) : 0;
    return this.movimientosStockService.findByTallerAndEstado(
      Number(idTaller),
      estadoParsed,
    );
  }

  // 👇 Editar un movimiento puntual
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateMovimientosStockDto) {
    return this.movimientosStockService.update(+id, updateDto);
  }

  // 👇 Borrar un movimiento puntual
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movimientosStockService.remove(+id);
  }
}
import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { MovimientosStockService } from './movimientos_stock.service';
import { CreateMovimientosStockDto } from './dto/create-movimientos_stock.dto';
import { UpdateMovimientosStockDto } from './dto/update-movimientos_stock.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';

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

  @Get('filtrar')
  filter(
    @Query('id_taller') idTaller: string,
    @Query('id_estado') idEstado?: string,
  ) {
    const estadoParsed = idEstado ? Number(idEstado) : 0;
    return this.movimientosStockService.findByTallerAndEstado(
      Number(idTaller),
      estadoParsed,
    );
  }

  // 👇 NUEVO: editar un grupo/lote completo
  @Patch('lote/:lote_id')
  updateLote(
    @Param('lote_id') loteId: string,
    @Query('id_articulo') idArticulo: string,
    @Query('id_color') idColor: string,
    @Body() dto: UpdateLoteDto,
  ) {
    return this.movimientosStockService.updateLoteGroup(loteId, Number(idArticulo), Number(idColor), dto);
  }

  // 👇 NUEVO: borrar un grupo/lote completo
  @Delete('lote/:lote_id')
  removeLote(
    @Param('lote_id') loteId: string,
    @Query('id_articulo') idArticulo: string,
    @Query('id_color') idColor: string,
  ) {
    return this.movimientosStockService.removeLoteGroup(loteId, Number(idArticulo), Number(idColor));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateMovimientosStockDto) {
    return this.movimientosStockService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movimientosStockService.remove(+id);
  }
}
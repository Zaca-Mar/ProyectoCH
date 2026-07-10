import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientosStockService } from './movimientos_stock.service';
import { MovimientosStockController } from './movimientos_stock.controller'; // <-- Importado
import { MovimientosStock } from './entities/movimientos_stock.entity';
import { ArticulosModule } from '../articulos/articulos.module';
import { TallerModule } from '../taller/taller.module';
import { EstadoModule } from '../estado/estado.module';
import { ColorModule } from '../color/color.module';
import { TalleModule } from '../talle/talle.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([MovimientosStock]),
    ArticulosModule,
    TallerModule,
    EstadoModule,
    ColorModule,
    TalleModule, // ➕ 1. Importamos el módulo del talle
  ],
  controllers: [MovimientosStockController], 
  providers: [MovimientosStockService],
})
export class MovimientosStockModule {}
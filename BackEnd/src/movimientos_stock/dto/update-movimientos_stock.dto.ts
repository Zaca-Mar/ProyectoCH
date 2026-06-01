import { PartialType } from '@nestjs/mapped-types';
import { CreateMovimientosStockDto } from './create-movimientos_stock.dto';

export class UpdateMovimientosStockDto extends PartialType(CreateMovimientosStockDto) {}

import { IsEnum, IsNumber, IsPositive } from 'class-validator';

export class CreateMovimientosStockDto {
  @IsEnum(['INGRESO', 'EGRESO'], {
    message: 'El tipo de movimiento debe ser obligatoriamente INGRESO o EGRESO'
  })
  tipo_movimiento: 'INGRESO' | 'EGRESO';

  @IsNumber()
  @IsPositive({ message: 'La cantidad debe ser un número mayor a 0' })
  cantidad: number;

  @IsNumber()
  id_articulo: number;

  @IsNumber()
  id_color: number; 

  @IsNumber()
  id_taller: number;

  @IsNumber()
  id_estado: number;
}
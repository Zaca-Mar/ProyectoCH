import { IsEnum, IsNumber, IsPositive, IsOptional, IsString } from 'class-validator';

export class CreateMovimientosStockDto {
  @IsEnum(['INGRESO', 'EGRESO'], {
    message: 'El tipo de movimiento debe ser obligatoriamente INGRESO o EGRESO'
  })
  tipo_movimiento!: 'INGRESO' | 'EGRESO';

  @IsNumber()
  @IsPositive({ message: 'La cantidad debe ser un número mayor a 0' })
  cantidad!: number;

  @IsNumber()
  id_articulo!: number;

  @IsNumber()
  id_color!: number;

  @IsNumber()
  id_taller!: number;

  @IsOptional()
  @IsNumber()
  id_estado?: number;

  @IsNumber()
  id_talle!: number;

  observacion?: string;
  fecha?: string;
  
  @IsOptional()
  @IsString()
  lote_id?: string;
}
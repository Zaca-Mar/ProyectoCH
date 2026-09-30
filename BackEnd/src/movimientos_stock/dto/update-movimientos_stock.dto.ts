import { IsEnum, IsNumber, IsPositive, IsOptional, IsString } from 'class-validator';

export class UpdateMovimientosStockDto {
  @IsOptional()
  @IsEnum(['INGRESO', 'EGRESO'], {
    message: 'El tipo de movimiento debe ser obligatoriamente INGRESO o EGRESO'
  })
  tipo_movimiento?: 'INGRESO' | 'EGRESO';

  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'La cantidad debe ser un número mayor a 0' })
  cantidad?: number;

  @IsOptional()
  @IsNumber()
  id_articulo?: number;

  @IsOptional()
  @IsNumber()
  id_color?: number;

  @IsOptional()
  @IsNumber()
  id_taller?: number;

  @IsOptional()
  @IsNumber()
  id_estado?: number;

  @IsOptional()
  @IsNumber()
  id_talle?: number;

  @IsOptional()
  @IsString()
  observacion?: string;

  @IsOptional()
  @IsString()
  fecha?: string;

  
}
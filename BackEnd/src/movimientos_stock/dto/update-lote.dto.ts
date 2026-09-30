import { IsArray, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLoteItemDto {
  @IsInt()
  id_talle!: number;

  @IsInt()
  cantidad!: number;
}

export class UpdateLoteDto {
  @IsInt()
  id_taller!: number;

  @IsIn(['INGRESO', 'EGRESO'])
  tipo_movimiento!: string;

  @IsInt()
  id_articulo!: number;

  @IsInt()
  id_color!: number;

  @IsNotEmpty()
  fecha!: string;

  @IsOptional()
  @IsString()
  observacion?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateLoteItemDto)
  items!: UpdateLoteItemDto[];
}
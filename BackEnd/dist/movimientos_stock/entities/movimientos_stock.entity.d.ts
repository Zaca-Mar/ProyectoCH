import { Articulo } from '../../articulos/entities/articulo.entity';
import { Color } from '../../color/entities/color.entity';
import { Taller } from '../../taller/entities/taller.entity';
import { Estado } from '../../estado/entities/estado.entity';
export declare class MovimientosStock {
    id_movimiento: number;
    fecha_hora_movimiento: Date;
    tipo_movimiento: string;
    cantidad: number;
    articulo: Articulo;
    color: Color;
    taller: Taller;
    estado: Estado;
}

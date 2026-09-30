import { Articulo } from '../../articulos/entities/articulo.entity';
import { Color } from '../../color/entities/color.entity';
import { Taller } from '../../taller/entities/taller.entity';
import { Estado } from '../../estado/entities/estado.entity';
import { Talle } from '../../talle/entities/talle.entity';
export declare class MovimientosStock {
    id_movimiento: number;
    tipo_movimiento: string;
    cantidad: number;
    observacion: string;
    fecha: string;
    lote_id?: string;
    articulo: Articulo;
    color: Color;
    taller: Taller;
    estado?: Estado;
    talle: Talle;
}

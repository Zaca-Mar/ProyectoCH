import { Localidad } from '../../localidad/entities/localidad.entity';
import { MovimientosStock } from '../../movimientos_stock/entities/movimientos_stock.entity';
export declare class Taller {
    id_taller: number;
    nombre: string;
    calle: string;
    numero: number;
    localidad: Localidad;
    movimientos: MovimientosStock[];
}

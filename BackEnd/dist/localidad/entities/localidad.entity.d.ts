import { Provincia } from '../../provincia/entities/provincia.entity';
import { Taller } from '../../taller/entities/taller.entity';
export declare class Localidad {
    id_localidad: number;
    nombre: string;
    cp: string;
    provincia: Provincia;
    talleres: Taller[];
}

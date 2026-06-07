export declare class CreateMovimientosStockDto {
    tipo_movimiento: 'INGRESO' | 'EGRESO';
    cantidad: number;
    id_articulo: number;
    id_color: number;
    id_taller: number;
    id_estado: number;
    id_talle: number;
    observacion?: string;
    fecha?: string;
}

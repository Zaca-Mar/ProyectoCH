import { MovimientosStockService } from './movimientos_stock.service';
import { CreateMovimientosStockDto } from './dto/create-movimientos_stock.dto';
export declare class MovimientosStockController {
    private readonly movimientosStockService;
    constructor(movimientosStockService: MovimientosStockService);
    create(createMovimientosStockDto: CreateMovimientosStockDto): Promise<import("./entities/movimientos_stock.entity").MovimientosStock>;
    findAll(): Promise<import("./entities/movimientos_stock.entity").MovimientosStock[]>;
    filter(idTaller: string, idEstado: string): Promise<import("./entities/movimientos_stock.entity").MovimientosStock[]>;
}

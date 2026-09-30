import { MovimientosStockService } from './movimientos_stock.service';
import { CreateMovimientosStockDto } from './dto/create-movimientos_stock.dto';
import { UpdateMovimientosStockDto } from './dto/update-movimientos_stock.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
export declare class MovimientosStockController {
    private readonly movimientosStockService;
    constructor(movimientosStockService: MovimientosStockService);
    create(createMovimientosStockDto: CreateMovimientosStockDto): Promise<import("./entities/movimientos_stock.entity").MovimientosStock>;
    findAll(): Promise<import("./entities/movimientos_stock.entity").MovimientosStock[]>;
    filter(idTaller: string, idEstado?: string): Promise<import("./entities/movimientos_stock.entity").MovimientosStock[]>;
    updateLote(loteId: string, idArticulo: string, idColor: string, dto: UpdateLoteDto): Promise<import("./entities/movimientos_stock.entity").MovimientosStock[]>;
    removeLote(loteId: string, idArticulo: string, idColor: string): Promise<{
        message: string;
    }>;
    update(id: string, updateDto: UpdateMovimientosStockDto): Promise<import("./entities/movimientos_stock.entity").MovimientosStock>;
    remove(id: string): Promise<{
        message: string;
    }>;
}

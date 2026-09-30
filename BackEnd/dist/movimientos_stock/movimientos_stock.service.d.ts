import { Repository } from 'typeorm';
import { MovimientosStock } from './entities/movimientos_stock.entity';
import { CreateMovimientosStockDto } from './dto/create-movimientos_stock.dto';
import { UpdateMovimientosStockDto } from './dto/update-movimientos_stock.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { ArticulosService } from '../articulos/articulos.service';
import { TallerService } from '../taller/taller.service';
import { EstadoService } from '../estado/estado.service';
import { ColorService } from '../color/color.service';
import { TalleService } from '../talle/talle.service';
export declare class MovimientosStockService {
    private readonly movimientosRepository;
    private readonly articulosService;
    private readonly tallerService;
    private readonly estadoService;
    private readonly colorService;
    private readonly talleService;
    constructor(movimientosRepository: Repository<MovimientosStock>, articulosService: ArticulosService, tallerService: TallerService, estadoService: EstadoService, colorService: ColorService, talleService: TalleService);
    create(createDto: CreateMovimientosStockDto): Promise<MovimientosStock>;
    findAll(): Promise<MovimientosStock[]>;
    findByTallerAndEstado(idTaller: number, idEstado?: number): Promise<MovimientosStock[]>;
    update(id: number, updateDto: UpdateMovimientosStockDto): Promise<MovimientosStock>;
    remove(id: number): Promise<{
        message: string;
    }>;
    private findLoteGroup;
    removeLoteGroup(loteId: string, idArticulo: number, idColor: number): Promise<{
        message: string;
    }>;
    updateLoteGroup(loteId: string, idArticuloActual: number, idColorActual: number, dto: UpdateLoteDto): Promise<MovimientosStock[]>;
}

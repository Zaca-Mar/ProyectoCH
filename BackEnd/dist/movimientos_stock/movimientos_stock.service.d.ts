import { Repository } from 'typeorm';
import { MovimientosStock } from './entities/movimientos_stock.entity';
import { CreateMovimientosStockDto } from './dto/create-movimientos_stock.dto';
import { ArticulosService } from '../articulos/articulos.service';
import { TallerService } from '../taller/taller.service';
import { EstadoService } from '../estado/estado.service';
import { ColorService } from '../color/color.service';
export declare class MovimientosStockService {
    private readonly movimientosRepository;
    private readonly articulosService;
    private readonly tallerService;
    private readonly estadoService;
    private readonly colorService;
    constructor(movimientosRepository: Repository<MovimientosStock>, articulosService: ArticulosService, tallerService: TallerService, estadoService: EstadoService, colorService: ColorService);
    create(createDto: CreateMovimientosStockDto): Promise<MovimientosStock>;
    findAll(): Promise<MovimientosStock[]>;
    findByTallerAndEstado(idTaller: number, idEstado: number): Promise<MovimientosStock[]>;
}

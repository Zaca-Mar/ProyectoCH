import { EstadoService } from './estado.service';
import { CreateEstadoDto } from './dto/create-estado.dto';
export declare class EstadoController {
    private readonly estadoService;
    constructor(estadoService: EstadoService);
    create(createEstadoDto: CreateEstadoDto): Promise<import("./entities/estado.entity").Estado>;
    findAll(): Promise<import("./entities/estado.entity").Estado[]>;
    findOne(id: string): Promise<import("./entities/estado.entity").Estado>;
}

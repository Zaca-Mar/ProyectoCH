import { Repository } from 'typeorm';
import { Estado } from './entities/estado.entity';
import { CreateEstadoDto } from './dto/create-estado.dto';
export declare class EstadoService {
    private readonly estadoRepository;
    constructor(estadoRepository: Repository<Estado>);
    create(createEstadoDto: CreateEstadoDto): Promise<Estado>;
    findAll(): Promise<Estado[]>;
    findOne(id: number): Promise<Estado>;
}

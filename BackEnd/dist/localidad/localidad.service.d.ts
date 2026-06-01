import { Repository } from 'typeorm';
import { Localidad } from './entities/localidad.entity';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { ProvinciaService } from '../provincia/provincia.service';
export declare class LocalidadService {
    private readonly localidadRepository;
    private readonly provinciaService;
    constructor(localidadRepository: Repository<Localidad>, provinciaService: ProvinciaService);
    create(createLocalidadDto: CreateLocalidadDto): Promise<Localidad>;
    findAll(): Promise<Localidad[]>;
    findOne(id: number): Promise<Localidad>;
}

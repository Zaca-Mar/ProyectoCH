import { Repository } from 'typeorm';
import { Provincia } from './entities/provincia.entity';
import { CreateProvinciaDto } from './dto/create-provincia.dto';
export declare class ProvinciaService {
    private readonly provinciaRepository;
    constructor(provinciaRepository: Repository<Provincia>);
    create(createProvinciaDto: CreateProvinciaDto): Promise<Provincia>;
    findAll(): Promise<Provincia[]>;
    findOne(id: number): Promise<Provincia>;
}

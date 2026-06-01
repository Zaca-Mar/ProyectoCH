import { Repository } from 'typeorm';
import { Articulo } from './entities/articulo.entity';
import { CreateArticuloDto } from './dto/create-articulo.dto';
export declare class ArticulosService {
    private readonly articuloRepository;
    constructor(articuloRepository: Repository<Articulo>);
    create(createArticuloDto: CreateArticuloDto): Promise<Articulo>;
    findAll(): Promise<Articulo[]>;
    findOne(id: number): Promise<Articulo>;
}

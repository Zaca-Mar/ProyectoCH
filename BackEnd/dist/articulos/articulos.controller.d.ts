import { ArticulosService } from './articulos.service';
import { CreateArticuloDto } from './dto/create-articulo.dto';
export declare class ArticulosController {
    private readonly articulosService;
    constructor(articulosService: ArticulosService);
    create(createArticuloDto: CreateArticuloDto): Promise<import("./entities/articulo.entity").Articulo>;
    findAll(): Promise<import("./entities/articulo.entity").Articulo[]>;
}

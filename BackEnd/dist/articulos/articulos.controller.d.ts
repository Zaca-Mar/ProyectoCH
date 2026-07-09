import { ArticulosService } from './articulos.service';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
export declare class ArticulosController {
    private readonly articulosService;
    constructor(articulosService: ArticulosService);
    create(createArticuloDto: CreateArticuloDto): Promise<import("./entities/articulo.entity").Articulo>;
    findAll(): Promise<import("./entities/articulo.entity").Articulo[]>;
    update(id: string, updateArticuloDto: UpdateArticuloDto): Promise<import("./entities/articulo.entity").Articulo>;
}

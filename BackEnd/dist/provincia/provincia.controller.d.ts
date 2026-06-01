import { ProvinciaService } from './provincia.service';
import { CreateProvinciaDto } from './dto/create-provincia.dto';
export declare class ProvinciaController {
    private readonly provinciaService;
    constructor(provinciaService: ProvinciaService);
    create(createProvinciaDto: CreateProvinciaDto): Promise<import("./entities/provincia.entity").Provincia>;
    findAll(): Promise<import("./entities/provincia.entity").Provincia[]>;
    findOne(id: string): Promise<import("./entities/provincia.entity").Provincia>;
}

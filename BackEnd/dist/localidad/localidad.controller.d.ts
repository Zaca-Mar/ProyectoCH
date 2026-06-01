import { LocalidadService } from './localidad.service';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
export declare class LocalidadController {
    private readonly localidadService;
    constructor(localidadService: LocalidadService);
    create(createLocalidadDto: CreateLocalidadDto): Promise<import("./entities/localidad.entity").Localidad>;
    findAll(): Promise<import("./entities/localidad.entity").Localidad[]>;
    findOne(id: string): Promise<import("./entities/localidad.entity").Localidad>;
}

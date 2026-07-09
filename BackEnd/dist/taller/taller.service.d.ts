import { Repository } from 'typeorm';
import { Taller } from './entities/taller.entity';
import { CreateTallerDto } from './dto/create-taller.dto';
import { UpdateTallerDto } from './dto/update-taller.dto';
import { LocalidadService } from '../localidad/localidad.service';
export declare class TallerService {
    private readonly tallerRepository;
    private readonly localidadService;
    constructor(tallerRepository: Repository<Taller>, localidadService: LocalidadService);
    create(createTallerDto: CreateTallerDto): Promise<Taller>;
    findAll(): Promise<Taller[]>;
    findOne(id: number): Promise<Taller>;
    update(id: number, updateTallerDto: UpdateTallerDto): Promise<Taller>;
}

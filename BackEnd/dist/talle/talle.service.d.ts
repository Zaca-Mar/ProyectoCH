import { Repository } from 'typeorm';
import { Talle } from './entities/talle.entity';
export declare class TalleService {
    private readonly talleRepository;
    constructor(talleRepository: Repository<Talle>);
    create(data: {
        nombre: string;
    }): Promise<Talle>;
    findAll(): Promise<Talle[]>;
    findOne(id: number): Promise<Talle | null>;
}

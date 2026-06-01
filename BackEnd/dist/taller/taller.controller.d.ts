import { TallerService } from './taller.service';
import { CreateTallerDto } from './dto/create-taller.dto';
export declare class TallerController {
    private readonly tallerService;
    constructor(tallerService: TallerService);
    create(createTallerDto: CreateTallerDto): Promise<import("./entities/taller.entity").Taller>;
    findAll(): Promise<import("./entities/taller.entity").Taller[]>;
    findOne(id: string): Promise<import("./entities/taller.entity").Taller>;
}

import { TalleService } from './talle.service';
export declare class TalleController {
    private readonly talleService;
    constructor(talleService: TalleService);
    create(data: {
        nombre: string;
    }): Promise<import("./entities/talle.entity").Talle>;
    findAll(): Promise<import("./entities/talle.entity").Talle[]>;
    findOne(id: string): Promise<import("./entities/talle.entity").Talle | null>;
}

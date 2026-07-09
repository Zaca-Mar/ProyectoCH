import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
export declare class ColorController {
    private readonly colorService;
    constructor(colorService: ColorService);
    create(createColorDto: CreateColorDto): Promise<import("./entities/color.entity").Color>;
    findAll(): Promise<import("./entities/color.entity").Color[]>;
    update(id: string, updateColorDto: UpdateColorDto): Promise<import("./entities/color.entity").Color>;
}

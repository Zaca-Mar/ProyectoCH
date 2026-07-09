import { Repository } from 'typeorm';
import { Color } from './entities/color.entity';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
export declare class ColorService {
    private readonly colorRepository;
    constructor(colorRepository: Repository<Color>);
    create(createColorDto: CreateColorDto): Promise<Color>;
    findAll(): Promise<Color[]>;
    findOne(id_color: number): Promise<Color | null>;
    update(id: number, updateColorDto: UpdateColorDto): Promise<Color>;
}

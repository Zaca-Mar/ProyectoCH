import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Color } from './entities/color.entity';
import { CreateColorDto } from './dto/create-color.dto';
@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  //Crear un nuevo color
  async create(createColorDto: CreateColorDto): Promise<Color> {
    const nuevoColor = this.colorRepository.create(createColorDto);
    return await this.colorRepository.save(nuevoColor);
  }

  //Traer todos los colores
  async findAll(): Promise<Color[]> {
    return await this.colorRepository.find();
  }

  async findOne(id_color: number): Promise<Color | null> {
    return await this.colorRepository.findOneBy({ id_color });
  }
}

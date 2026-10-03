import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Color } from './entities/color.entity';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import{QueryFailedError} from 'typeorm'

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  async create(createColorDto: CreateColorDto): Promise<Color> {
    const nuevoColor = this.colorRepository.create(createColorDto);
    return await this.colorRepository.save(nuevoColor);
  }

  async findAll(): Promise<Color[]> {
    return await this.colorRepository.find();
  }

  async findOne(id_color: number): Promise<Color | null> {
    return await this.colorRepository.findOneBy({ id_color });
  }

  async update(id: number, updateColorDto: UpdateColorDto): Promise<Color> {
    const color = await this.findOne(id);
    if (!color) throw new NotFoundException(`Color con ID ${id} no encontrado`);

    Object.assign(color, {
      nombre: updateColorDto.nombre ?? color.nombre,
    });

    return await this.colorRepository.save(color);
  }

  async remove(id: number): Promise<{ message: string }> {
  const color = await this.findOne(id);
  if (!color) throw new NotFoundException(`Color con ID ${id} no encontrado`);

  try {
    await this.colorRepository.delete({ id_color: id });
    return { message: 'Color eliminado correctamente' };
  } catch (error) {
    if (error instanceof QueryFailedError && (error as any).errno === 1451) {
      throw new ConflictException(
        'No se puede eliminar el color porque está siendo usado',
      );
    }
    throw error;
  }
}
}
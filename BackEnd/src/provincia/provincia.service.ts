import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provincia } from './entities/provincia.entity';
import { CreateProvinciaDto } from './dto/create-provincia.dto';

@Injectable()
export class ProvinciaService {
  constructor(
    @InjectRepository(Provincia)
    private readonly provinciaRepository: Repository<Provincia>,
  ) {}

  async create(createProvinciaDto: CreateProvinciaDto): Promise<Provincia> {
    const nueva = this.provinciaRepository.create(createProvinciaDto);
    return await this.provinciaRepository.save(nueva);
  }

  async findAll(): Promise<Provincia[]> {
    return await this.provinciaRepository.find({ relations: { localidades: true } });
  }

  async findOne(id: number): Promise<Provincia> {
    const provincia = await this.provinciaRepository.findOne({ where: { id_provincia: id } });
    if (!provincia) throw new NotFoundException(`Provincia con ID ${id} no encontrada`);
    return provincia;
  }
}
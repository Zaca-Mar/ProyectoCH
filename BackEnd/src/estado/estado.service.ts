import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from './entities/estado.entity';
import { CreateEstadoDto } from './dto/create-estado.dto';

@Injectable()
export class EstadoService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  async create(createEstadoDto: CreateEstadoDto): Promise<Estado> {
    const nuevo = this.estadoRepository.create(createEstadoDto);
    return await this.estadoRepository.save(nuevo);
  }

  async findAll(): Promise<Estado[]> {
    return await this.estadoRepository.find();
  }

  async findOne(id: number): Promise<Estado> {
    const estado = await this.estadoRepository.findOne({ where: { id_estado: id } });
    if (!estado) throw new NotFoundException(`Estado con ID ${id} no encontrado`);
    return estado;
  }
}
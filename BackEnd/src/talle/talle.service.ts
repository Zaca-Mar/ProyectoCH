import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Talle } from './entities/talle.entity';

@Injectable()
export class TalleService {
  constructor(
    @InjectRepository(Talle)
    private readonly talleRepository: Repository<Talle>,
  ) {}

  async create(data: { nombre: string }) {
    const nuevo = this.talleRepository.create(data);
    return await this.talleRepository.save(nuevo);
  }

  async findAll() {
    return await this.talleRepository.find();
  }

  async findOne(id: number) {
    return await this.talleRepository.findOne({ where: { id_talle: id } });
  }
}
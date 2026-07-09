import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Taller } from './entities/taller.entity';
import { CreateTallerDto } from './dto/create-taller.dto';
import { UpdateTallerDto } from './dto/update-taller.dto';
import { LocalidadService } from '../localidad/localidad.service';

@Injectable()
export class TallerService {
  constructor(
    @InjectRepository(Taller)
    private readonly tallerRepository: Repository<Taller>,
    private readonly localidadService: LocalidadService,
  ) {}

  async create(createTallerDto: CreateTallerDto): Promise<Taller> {
    const localidad = await this.localidadService.findOne(createTallerDto.id_localidad);
    const nuevoTaller = this.tallerRepository.create({
      nombre: createTallerDto.nombre,
      calle: createTallerDto.calle,
      numero: createTallerDto.numero,
      localidad: localidad
    });
    return await this.tallerRepository.save(nuevoTaller);
  }

  async findAll(): Promise<Taller[]> {
    return await this.tallerRepository.find();
  }

  async findOne(id: number): Promise<Taller> {
    const taller = await this.tallerRepository.findOne({ where: { id_taller: id } });
    if (!taller) throw new NotFoundException(`Taller con ID ${id} no encontrado`);
    return taller;
  }

  async update(id: number, updateTallerDto: UpdateTallerDto): Promise<Taller> {
    const taller = await this.findOne(id);

    if (updateTallerDto.id_localidad) {
      const localidad = await this.localidadService.findOne(updateTallerDto.id_localidad);
      taller.localidad = localidad;
    }

    Object.assign(taller, {
      nombre: updateTallerDto.nombre ?? taller.nombre,
      calle: updateTallerDto.calle ?? taller.calle,
      numero: updateTallerDto.numero ?? taller.numero,
    });

    return await this.tallerRepository.save(taller);
  }
}
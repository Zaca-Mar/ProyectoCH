import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Localidad } from './entities/localidad.entity';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { UpdateLocalidadDto } from './dto/update-localidad.dto';
import { ProvinciaService } from '../provincia/provincia.service';

@Injectable()
export class LocalidadService {
  constructor(
    @InjectRepository(Localidad)
    private readonly localidadRepository: Repository<Localidad>,
    private readonly provinciaService: ProvinciaService,
  ) {}

  async create(createLocalidadDto: CreateLocalidadDto): Promise<Localidad> {
    const provincia = await this.provinciaService.findOne(createLocalidadDto.id_provincia);
    const nuevaLocalidad = this.localidadRepository.create({
      nombre: createLocalidadDto.nombre,
      cp: createLocalidadDto.cp,
      provincia: provincia
    });
    return await this.localidadRepository.save(nuevaLocalidad);
  }

  async findAll(): Promise<Localidad[]> {
    return await this.localidadRepository.find({ relations: { provincia: true } });
  }

  async findOne(id: number): Promise<Localidad> {
    const localidad = await this.localidadRepository.findOne({
      where: { id_localidad: id },
      relations: { provincia: true },
    });
    if (!localidad) throw new NotFoundException(`Localidad con ID ${id} no encontrada`);
    return localidad;
  }

  async update(id: number, updateLocalidadDto: UpdateLocalidadDto): Promise<Localidad> {
    const localidad = await this.findOne(id);

    if (updateLocalidadDto.id_provincia) {
      const provincia = await this.provinciaService.findOne(updateLocalidadDto.id_provincia);
      localidad.provincia = provincia;
    }

    Object.assign(localidad, {
      nombre: updateLocalidadDto.nombre ?? localidad.nombre,
      cp: updateLocalidadDto.cp ?? localidad.cp,
    });

    return await this.localidadRepository.save(localidad);
  }
}
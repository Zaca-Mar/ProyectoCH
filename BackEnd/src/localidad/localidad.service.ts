import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
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

  async remove(id: number): Promise<{ message: string }> {
    const color = await this.findOne(id);
    if (!color) throw new NotFoundException(`Color con ID ${id} no encontrado`);
  
    try {
      await this.localidadRepository.delete({ id_localidad: id });
      return { message: 'Localidad eliminada correctamente' };
    } catch (error) {
      if (error instanceof QueryFailedError && (error as any).errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar la localidad porque está siendo usada',
        );
      }
      throw error;
    }
}
}
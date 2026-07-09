import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Articulo } from './entities/articulo.entity';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';

@Injectable()
export class ArticulosService {
  constructor(
    @InjectRepository(Articulo)
    private readonly articuloRepository: Repository<Articulo>,
  ) {}

  async create(createArticuloDto: CreateArticuloDto): Promise<Articulo> {
    const nuevoArticulo = this.articuloRepository.create(createArticuloDto);
    return await this.articuloRepository.save(nuevoArticulo);
  }

  async findAll(): Promise<Articulo[]> {
    return await this.articuloRepository.find();
  }

  async findOne(id: number): Promise<Articulo> {
    const articulo = await this.articuloRepository.findOne({ where: { id_articulo: id } });
    if (!articulo) throw new NotFoundException(`Artículo con ID ${id} no encontrado`);
    return articulo;
  }

  async update(id: number, updateArticuloDto: UpdateArticuloDto): Promise<Articulo> {
    const articulo = await this.findOne(id);
    Object.assign(articulo, {
      nombre: updateArticuloDto.nombre ?? articulo.nombre,
    });
    return await this.articuloRepository.save(articulo);
  }
}
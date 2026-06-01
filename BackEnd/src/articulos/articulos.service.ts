import { Injectable, NotFoundException } from '@nestjs/common'; // <-- Asegurate de importar NotFoundException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Articulo } from './entities/articulo.entity';
import { CreateArticuloDto } from './dto/create-articulo.dto';

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
}
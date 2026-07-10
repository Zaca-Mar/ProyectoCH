import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Talle } from './entities/talle.entity';

const ORDEN_LETRAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'];

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
    const talles = await this.talleRepository.find();
    return talles.sort((a, b) => this.compararTalles(a.nombre, b.nombre));
  }

  async findOne(id: number) {
    return await this.talleRepository.findOne({ where: { id_talle: id } });
  }

  async remove(id: number) {
    const talle = await this.talleRepository.findOne({ where: { id_talle: id } });
    if (!talle) {
      throw new NotFoundException(`Talle con ID ${id} no encontrado`);
    }
    try {
      await this.talleRepository.remove(talle);
      return { message: `Talle "${talle.nombre}" eliminado correctamente` };
    } catch (err) {
      throw new BadRequestException(
        `No se pudo eliminar el talle "${talle.nombre}": probablemente ya está en uso en algún movimiento de stock.`
      );
    }
  }

  private compararTalles(a: string, b: string): number {
    const numA = Number(a);
    const numB = Number(b);
    const esNumA = !isNaN(numA) && a.trim() !== '';
    const esNumB = !isNaN(numB) && b.trim() !== '';

    if (esNumA && esNumB) return numA - numB;
    if (esNumA && !esNumB) return -1; // los números van antes que las letras
    if (!esNumA && esNumB) return 1;

    const idxA = ORDEN_LETRAS.indexOf(a);
    const idxB = ORDEN_LETRAS.indexOf(b);
    return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
  }
}
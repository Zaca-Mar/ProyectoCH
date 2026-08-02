import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { MovimientosStock } from './entities/movimientos_stock.entity';
import { CreateMovimientosStockDto } from './dto/create-movimientos_stock.dto';
import { UpdateMovimientosStockDto } from './dto/update-movimientos_stock.dto';
import { ArticulosService } from '../articulos/articulos.service';
import { TallerService } from '../taller/taller.service';
import { EstadoService } from '../estado/estado.service';
import { ColorService } from '../color/color.service';
import { TalleService } from '../talle/talle.service';

@Injectable()
export class MovimientosStockService {
  constructor(
    @InjectRepository(MovimientosStock)
    private readonly movimientosRepository: Repository<MovimientosStock>,
    private readonly articulosService: ArticulosService,
    private readonly tallerService: TallerService,
    private readonly estadoService: EstadoService,
    private readonly colorService: ColorService,
    private readonly talleService: TalleService,
  ) {}

  async create(createDto: CreateMovimientosStockDto): Promise<MovimientosStock> {
    const articulo = await this.articulosService.findOne(createDto.id_articulo);
    const taller = await this.tallerService.findOne(createDto.id_taller);
    const color = await this.colorService.findOne(createDto.id_color);
    const talle = await this.talleService.findOne(createDto.id_talle);

    const estado = createDto.id_estado
      ? await this.estadoService.findOne(createDto.id_estado)
      : undefined;

    if (!articulo || !taller || !color || !talle) {
      throw new Error('One or more required entities were not found (Check id_talle)');
    }

    const nuevoMovimiento = new MovimientosStock();
    nuevoMovimiento.tipo_movimiento = createDto.tipo_movimiento;
    nuevoMovimiento.cantidad = createDto.cantidad;
    nuevoMovimiento.observacion = createDto.observacion ?? '';
    nuevoMovimiento.articulo = articulo;
    nuevoMovimiento.taller = taller;
    nuevoMovimiento.color = color;
    nuevoMovimiento.talle = talle;
    nuevoMovimiento.fecha = createDto.fecha ?? '';
    if (estado) nuevoMovimiento.estado = estado;

    return await this.movimientosRepository.save(nuevoMovimiento);
  }

  async findAll(): Promise<MovimientosStock[]> {
    return await this.movimientosRepository.find();
  }

  async findByTallerAndEstado(idTaller: number, idEstado?: number): Promise<MovimientosStock[]> {
    const condicionesBusqueda: FindOptionsWhere<MovimientosStock> = {
      taller: { id_taller: idTaller },
    };

    if (idEstado !== undefined && !isNaN(idEstado)) {
      condicionesBusqueda.estado = { id_estado: idEstado };
    }

    return await this.movimientosRepository.find({
      where: condicionesBusqueda,
      relations: {
        articulo: true,
        color: true,
        taller: true,
        estado: true,
        talle: true,
      },
    });
  }

  // 👇 NUEVO: editar un movimiento existente
  async update(id: number, updateDto: UpdateMovimientosStockDto): Promise<MovimientosStock> {
    const movimiento = await this.movimientosRepository.findOne({
      where: { id_movimiento: id },
      relations: { articulo: true, color: true, taller: true, estado: true, talle: true },
    });

    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }

    if (updateDto.id_articulo !== undefined) {
      const articulo = await this.articulosService.findOne(updateDto.id_articulo);
      if (!articulo) throw new BadRequestException('Artículo no encontrado');
      movimiento.articulo = articulo;
    }

    if (updateDto.id_color !== undefined) {
      const color = await this.colorService.findOne(updateDto.id_color);
      if (!color) throw new BadRequestException('Color no encontrado');
      movimiento.color = color;
    }

    if (updateDto.id_taller !== undefined) {
      const taller = await this.tallerService.findOne(updateDto.id_taller);
      if (!taller) throw new BadRequestException('Taller no encontrado');
      movimiento.taller = taller;
    }

    if (updateDto.id_talle !== undefined) {
      const talle = await this.talleService.findOne(updateDto.id_talle);
      if (!talle) throw new BadRequestException('Talle no encontrado');
      movimiento.talle = talle;
    }

    if (updateDto.id_estado !== undefined) {
      const estado = await this.estadoService.findOne(updateDto.id_estado);
      movimiento.estado = estado ?? undefined;
    }

    if (updateDto.tipo_movimiento !== undefined) {
      movimiento.tipo_movimiento = updateDto.tipo_movimiento;
    }
    if (updateDto.cantidad !== undefined) {
      movimiento.cantidad = updateDto.cantidad;
    }
    if (updateDto.observacion !== undefined) {
      movimiento.observacion = updateDto.observacion;
    }
    if (updateDto.fecha !== undefined) {
      movimiento.fecha = updateDto.fecha;
    }

    return await this.movimientosRepository.save(movimiento);
  }

  // 👇 NUEVO: borrar un movimiento existente
  async remove(id: number): Promise<{ message: string }> {
    const movimiento = await this.movimientosRepository.findOne({ where: { id_movimiento: id } });
    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }
    await this.movimientosRepository.remove(movimiento);
    return { message: `Movimiento #${id} eliminado correctamente` };
  }
}
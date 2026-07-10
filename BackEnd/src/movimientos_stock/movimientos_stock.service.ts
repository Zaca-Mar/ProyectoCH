import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { MovimientosStock } from './entities/movimientos_stock.entity';
import { CreateMovimientosStockDto } from './dto/create-movimientos_stock.dto';
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

    // El estado ahora es opcional: solo se busca si vino un id_estado
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
}
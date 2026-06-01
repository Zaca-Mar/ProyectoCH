import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimientosStock } from './entities/movimientos_stock.entity';
import { CreateMovimientosStockDto } from './dto/create-movimientos_stock.dto';
import { ArticulosService } from '../articulos/articulos.service';
import { TallerService } from '../taller/taller.service';
import { EstadoService } from '../estado/estado.service';
import { ColorService } from '../color/color.service';

@Injectable()
export class MovimientosStockService {
  constructor(
    @InjectRepository(MovimientosStock)
    private readonly movimientosRepository: Repository<MovimientosStock>,
    private readonly articulosService: ArticulosService,
    private readonly tallerService: TallerService,
    private readonly estadoService: EstadoService,
    private readonly colorService: ColorService,
  ) {}

  async create(createDto: CreateMovimientosStockDto): Promise<MovimientosStock> {
  // 1. Validamos que existan todas las entidades en la BD
  const articulo = await this.articulosService.findOne(createDto.id_articulo);
  const taller = await this.tallerService.findOne(createDto.id_taller);
  const estado = await this.estadoService.findOne(createDto.id_estado);
  const color = await this.colorService.findOne(createDto.id_color);

  if (!articulo || !taller || !estado || !color) {
    throw new Error('One or more required entities were not found');
  }

  // 2. Creamos la instancia manualmente para evitar confusiones de tipo con .create()
  const nuevoMovimiento = new MovimientosStock();
  nuevoMovimiento.tipo_movimiento = createDto.tipo_movimiento;
  nuevoMovimiento.cantidad = createDto.cantidad;
  nuevoMovimiento.articulo = articulo;
  nuevoMovimiento.taller = taller;
  nuevoMovimiento.estado = estado;
  nuevoMovimiento.color = color;

  // 3. Guardamos la instancia directamente
  return await this.movimientosRepository.save(nuevoMovimiento);
}
  async findAll(): Promise<MovimientosStock[]> {
    return await this.movimientosRepository.find();
  }

  // Consulta requerida: Filtrar movimientos por Taller y por Estado
  async findByTallerAndEstado(idTaller: number, idEstado: number): Promise<MovimientosStock[]> {
    return await this.movimientosRepository.find({
      where: {
        taller: { id_taller: idTaller },
        estado: { id_estado: idEstado },
      },
    });
  }
}
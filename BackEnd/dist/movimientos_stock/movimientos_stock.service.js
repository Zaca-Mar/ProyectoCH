"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovimientosStockService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const movimientos_stock_entity_1 = require("./entities/movimientos_stock.entity");
const articulos_service_1 = require("../articulos/articulos.service");
const taller_service_1 = require("../taller/taller.service");
const estado_service_1 = require("../estado/estado.service");
const color_service_1 = require("../color/color.service");
const talle_service_1 = require("../talle/talle.service");
let MovimientosStockService = class MovimientosStockService {
    movimientosRepository;
    articulosService;
    tallerService;
    estadoService;
    colorService;
    talleService;
    constructor(movimientosRepository, articulosService, tallerService, estadoService, colorService, talleService) {
        this.movimientosRepository = movimientosRepository;
        this.articulosService = articulosService;
        this.tallerService = tallerService;
        this.estadoService = estadoService;
        this.colorService = colorService;
        this.talleService = talleService;
    }
    async create(createDto) {
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
        const nuevoMovimiento = new movimientos_stock_entity_1.MovimientosStock();
        nuevoMovimiento.tipo_movimiento = createDto.tipo_movimiento;
        nuevoMovimiento.cantidad = createDto.cantidad;
        nuevoMovimiento.observacion = createDto.observacion ?? '';
        nuevoMovimiento.articulo = articulo;
        nuevoMovimiento.taller = taller;
        nuevoMovimiento.color = color;
        nuevoMovimiento.talle = talle;
        nuevoMovimiento.fecha = createDto.fecha ?? '';
        nuevoMovimiento.lote_id = createDto.lote_id;
        if (estado)
            nuevoMovimiento.estado = estado;
        return await this.movimientosRepository.save(nuevoMovimiento);
    }
    async findAll() {
        return await this.movimientosRepository.find();
    }
    async findByTallerAndEstado(idTaller, idEstado) {
        const condicionesBusqueda = {
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
    async update(id, updateDto) {
        const movimiento = await this.movimientosRepository.findOne({
            where: { id_movimiento: id },
            relations: { articulo: true, color: true, taller: true, estado: true, talle: true },
        });
        if (!movimiento) {
            throw new common_1.NotFoundException(`Movimiento con ID ${id} no encontrado`);
        }
        if (updateDto.id_articulo !== undefined) {
            const articulo = await this.articulosService.findOne(updateDto.id_articulo);
            if (!articulo)
                throw new common_1.BadRequestException('Artículo no encontrado');
            movimiento.articulo = articulo;
        }
        if (updateDto.id_color !== undefined) {
            const color = await this.colorService.findOne(updateDto.id_color);
            if (!color)
                throw new common_1.BadRequestException('Color no encontrado');
            movimiento.color = color;
        }
        if (updateDto.id_taller !== undefined) {
            const taller = await this.tallerService.findOne(updateDto.id_taller);
            if (!taller)
                throw new common_1.BadRequestException('Taller no encontrado');
            movimiento.taller = taller;
        }
        if (updateDto.id_talle !== undefined) {
            const talle = await this.talleService.findOne(updateDto.id_talle);
            if (!talle)
                throw new common_1.BadRequestException('Talle no encontrado');
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
    async remove(id) {
        const movimiento = await this.movimientosRepository.findOne({ where: { id_movimiento: id } });
        if (!movimiento) {
            throw new common_1.NotFoundException(`Movimiento con ID ${id} no encontrado`);
        }
        await this.movimientosRepository.remove(movimiento);
        return { message: `Movimiento #${id} eliminado correctamente` };
    }
    async findLoteGroup(loteId, idArticulo, idColor) {
        return await this.movimientosRepository.find({
            where: {
                lote_id: loteId,
                articulo: { id_articulo: idArticulo },
                color: { id_color: idColor },
            },
        });
    }
    async removeLoteGroup(loteId, idArticulo, idColor) {
        const movimientos = await this.findLoteGroup(loteId, idArticulo, idColor);
        if (movimientos.length === 0) {
            throw new common_1.NotFoundException('No se encontraron movimientos para ese lote y artículo/color');
        }
        await this.movimientosRepository.remove(movimientos);
        return { message: `Se eliminaron ${movimientos.length} movimientos del lote` };
    }
    async updateLoteGroup(loteId, idArticuloActual, idColorActual, dto) {
        const existentes = await this.findLoteGroup(loteId, idArticuloActual, idColorActual);
        if (existentes.length === 0) {
            throw new common_1.NotFoundException('No se encontraron movimientos para ese lote y artículo/color');
        }
        const articulo = await this.articulosService.findOne(dto.id_articulo);
        const taller = await this.tallerService.findOne(dto.id_taller);
        const color = await this.colorService.findOne(dto.id_color);
        if (!articulo || !taller || !color) {
            throw new common_1.BadRequestException('Artículo, taller o color no encontrado');
        }
        return await this.movimientosRepository.manager.transaction(async (manager) => {
            await manager.remove(existentes);
            const nuevos = [];
            for (const item of dto.items) {
                const talle = await this.talleService.findOne(item.id_talle);
                if (!talle)
                    throw new common_1.BadRequestException(`Talle ${item.id_talle} no encontrado`);
                const mov = new movimientos_stock_entity_1.MovimientosStock();
                mov.lote_id = loteId;
                mov.tipo_movimiento = dto.tipo_movimiento;
                mov.cantidad = item.cantidad;
                mov.observacion = dto.observacion ?? '';
                mov.fecha = dto.fecha ?? '';
                mov.articulo = articulo;
                mov.taller = taller;
                mov.color = color;
                mov.talle = talle;
                nuevos.push(mov);
            }
            return await manager.save(nuevos);
        });
    }
};
exports.MovimientosStockService = MovimientosStockService;
exports.MovimientosStockService = MovimientosStockService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(movimientos_stock_entity_1.MovimientosStock)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        articulos_service_1.ArticulosService,
        taller_service_1.TallerService,
        estado_service_1.EstadoService,
        color_service_1.ColorService,
        talle_service_1.TalleService])
], MovimientosStockService);
//# sourceMappingURL=movimientos_stock.service.js.map
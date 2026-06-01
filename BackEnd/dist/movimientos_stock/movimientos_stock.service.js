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
let MovimientosStockService = class MovimientosStockService {
    movimientosRepository;
    articulosService;
    tallerService;
    estadoService;
    colorService;
    constructor(movimientosRepository, articulosService, tallerService, estadoService, colorService) {
        this.movimientosRepository = movimientosRepository;
        this.articulosService = articulosService;
        this.tallerService = tallerService;
        this.estadoService = estadoService;
        this.colorService = colorService;
    }
    async create(createDto) {
        const articulo = await this.articulosService.findOne(createDto.id_articulo);
        const taller = await this.tallerService.findOne(createDto.id_taller);
        const estado = await this.estadoService.findOne(createDto.id_estado);
        const color = await this.colorService.findOne(createDto.id_color);
        if (!articulo || !taller || !estado || !color) {
            throw new Error('One or more required entities were not found');
        }
        const nuevoMovimiento = new movimientos_stock_entity_1.MovimientosStock();
        nuevoMovimiento.tipo_movimiento = createDto.tipo_movimiento;
        nuevoMovimiento.cantidad = createDto.cantidad;
        nuevoMovimiento.articulo = articulo;
        nuevoMovimiento.taller = taller;
        nuevoMovimiento.estado = estado;
        nuevoMovimiento.color = color;
        return await this.movimientosRepository.save(nuevoMovimiento);
    }
    async findAll() {
        return await this.movimientosRepository.find();
    }
    async findByTallerAndEstado(idTaller, idEstado) {
        return await this.movimientosRepository.find({
            where: {
                taller: { id_taller: idTaller },
                estado: { id_estado: idEstado },
            },
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
        color_service_1.ColorService])
], MovimientosStockService);
//# sourceMappingURL=movimientos_stock.service.js.map
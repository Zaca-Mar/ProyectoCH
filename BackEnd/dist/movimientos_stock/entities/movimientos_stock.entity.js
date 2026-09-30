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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovimientosStock = void 0;
const typeorm_1 = require("typeorm");
const articulo_entity_1 = require("../../articulos/entities/articulo.entity");
const color_entity_1 = require("../../color/entities/color.entity");
const taller_entity_1 = require("../../taller/entities/taller.entity");
const estado_entity_1 = require("../../estado/entities/estado.entity");
const talle_entity_1 = require("../../talle/entities/talle.entity");
let MovimientosStock = class MovimientosStock {
    id_movimiento;
    tipo_movimiento;
    cantidad;
    observacion;
    fecha;
    lote_id;
    articulo;
    color;
    taller;
    estado;
    talle;
};
exports.MovimientosStock = MovimientosStock;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MovimientosStock.prototype, "id_movimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['INGRESO', 'EGRESO'] }),
    __metadata("design:type", String)
], MovimientosStock.prototype, "tipo_movimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], MovimientosStock.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], MovimientosStock.prototype, "observacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", String)
], MovimientosStock.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 36, nullable: true }),
    __metadata("design:type", String)
], MovimientosStock.prototype, "lote_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => articulo_entity_1.Articulo, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_articulo' }),
    __metadata("design:type", articulo_entity_1.Articulo)
], MovimientosStock.prototype, "articulo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => color_entity_1.Color, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_color' }),
    __metadata("design:type", color_entity_1.Color)
], MovimientosStock.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => taller_entity_1.Taller, (taller) => taller.movimientos, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_taller' }),
    __metadata("design:type", taller_entity_1.Taller)
], MovimientosStock.prototype, "taller", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estado_entity_1.Estado, (estado) => estado.movimientos, { eager: true, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_estado' }),
    __metadata("design:type", estado_entity_1.Estado)
], MovimientosStock.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => talle_entity_1.Talle, { eager: true, nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_talle' }),
    __metadata("design:type", talle_entity_1.Talle)
], MovimientosStock.prototype, "talle", void 0);
exports.MovimientosStock = MovimientosStock = __decorate([
    (0, typeorm_1.Entity)('movimientos_stock')
], MovimientosStock);
//# sourceMappingURL=movimientos_stock.entity.js.map
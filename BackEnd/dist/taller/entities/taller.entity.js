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
exports.Taller = void 0;
const typeorm_1 = require("typeorm");
const localidad_entity_1 = require("../../localidad/entities/localidad.entity");
const movimientos_stock_entity_1 = require("../../movimientos_stock/entities/movimientos_stock.entity");
let Taller = class Taller {
    id_taller;
    nombre;
    calle;
    numero;
    localidad;
    movimientos;
};
exports.Taller = Taller;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Taller.prototype, "id_taller", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], Taller.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], Taller.prototype, "calle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Taller.prototype, "numero", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => localidad_entity_1.Localidad, (localidad) => localidad.talleres, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_localidad' }),
    __metadata("design:type", localidad_entity_1.Localidad)
], Taller.prototype, "localidad", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => movimientos_stock_entity_1.MovimientosStock, (movimiento) => movimiento.taller),
    __metadata("design:type", Array)
], Taller.prototype, "movimientos", void 0);
exports.Taller = Taller = __decorate([
    (0, typeorm_1.Entity)('taller')
], Taller);
//# sourceMappingURL=taller.entity.js.map
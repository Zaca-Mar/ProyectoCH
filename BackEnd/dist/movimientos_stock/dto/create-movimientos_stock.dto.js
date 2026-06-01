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
exports.CreateMovimientosStockDto = void 0;
const class_validator_1 = require("class-validator");
class CreateMovimientosStockDto {
    tipo_movimiento;
    cantidad;
    id_articulo;
    id_color;
    id_taller;
    id_estado;
}
exports.CreateMovimientosStockDto = CreateMovimientosStockDto;
__decorate([
    (0, class_validator_1.IsEnum)(['INGRESO', 'EGRESO'], {
        message: 'El tipo de movimiento debe ser obligatoriamente INGRESO o EGRESO'
    }),
    __metadata("design:type", String)
], CreateMovimientosStockDto.prototype, "tipo_movimiento", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)({ message: 'La cantidad debe ser un número mayor a 0' }),
    __metadata("design:type", Number)
], CreateMovimientosStockDto.prototype, "cantidad", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMovimientosStockDto.prototype, "id_articulo", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMovimientosStockDto.prototype, "id_color", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMovimientosStockDto.prototype, "id_taller", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMovimientosStockDto.prototype, "id_estado", void 0);
//# sourceMappingURL=create-movimientos_stock.dto.js.map
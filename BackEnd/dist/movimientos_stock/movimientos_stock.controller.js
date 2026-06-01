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
exports.MovimientosStockController = void 0;
const common_1 = require("@nestjs/common");
const movimientos_stock_service_1 = require("./movimientos_stock.service");
const create_movimientos_stock_dto_1 = require("./dto/create-movimientos_stock.dto");
let MovimientosStockController = class MovimientosStockController {
    movimientosStockService;
    constructor(movimientosStockService) {
        this.movimientosStockService = movimientosStockService;
    }
    create(createMovimientosStockDto) {
        return this.movimientosStockService.create(createMovimientosStockDto);
    }
    findAll() {
        return this.movimientosStockService.findAll();
    }
    filter(idTaller, idEstado) {
        return this.movimientosStockService.findByTallerAndEstado(+idTaller, +idEstado);
    }
};
exports.MovimientosStockController = MovimientosStockController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_movimientos_stock_dto_1.CreateMovimientosStockDto]),
    __metadata("design:returntype", void 0)
], MovimientosStockController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MovimientosStockController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('filtrar'),
    __param(0, (0, common_1.Query)('id_taller')),
    __param(1, (0, common_1.Query)('id_estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MovimientosStockController.prototype, "filter", null);
exports.MovimientosStockController = MovimientosStockController = __decorate([
    (0, common_1.Controller)('movimientos-stock'),
    __metadata("design:paramtypes", [movimientos_stock_service_1.MovimientosStockService])
], MovimientosStockController);
//# sourceMappingURL=movimientos_stock.controller.js.map
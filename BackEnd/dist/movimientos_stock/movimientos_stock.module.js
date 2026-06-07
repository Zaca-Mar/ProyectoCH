"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovimientosStockModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const movimientos_stock_service_1 = require("./movimientos_stock.service");
const movimientos_stock_controller_1 = require("./movimientos_stock.controller");
const movimientos_stock_entity_1 = require("./entities/movimientos_stock.entity");
const articulos_module_1 = require("../articulos/articulos.module");
const taller_module_1 = require("../taller/taller.module");
const estado_module_1 = require("../estado/estado.module");
const color_module_1 = require("../color/color.module");
const talle_module_1 = require("../talle/talle.module");
let MovimientosStockModule = class MovimientosStockModule {
};
exports.MovimientosStockModule = MovimientosStockModule;
exports.MovimientosStockModule = MovimientosStockModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([movimientos_stock_entity_1.MovimientosStock]),
            articulos_module_1.ArticulosModule,
            taller_module_1.TallerModule,
            estado_module_1.EstadoModule,
            color_module_1.ColorModule,
            talle_module_1.TalleModule,
        ],
        controllers: [movimientos_stock_controller_1.MovimientosStockController],
        providers: [movimientos_stock_service_1.MovimientosStockService],
    })
], MovimientosStockModule);
//# sourceMappingURL=movimientos_stock.module.js.map
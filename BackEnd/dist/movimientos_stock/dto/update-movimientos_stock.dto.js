"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMovimientosStockDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_movimientos_stock_dto_1 = require("./create-movimientos_stock.dto");
class UpdateMovimientosStockDto extends (0, mapped_types_1.PartialType)(create_movimientos_stock_dto_1.CreateMovimientosStockDto) {
}
exports.UpdateMovimientosStockDto = UpdateMovimientosStockDto;
//# sourceMappingURL=update-movimientos_stock.dto.js.map
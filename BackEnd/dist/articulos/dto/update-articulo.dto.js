"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateArticuloDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_articulo_dto_1 = require("./create-articulo.dto");
class UpdateArticuloDto extends (0, mapped_types_1.PartialType)(create_articulo_dto_1.CreateArticuloDto) {
}
exports.UpdateArticuloDto = UpdateArticuloDto;
//# sourceMappingURL=update-articulo.dto.js.map
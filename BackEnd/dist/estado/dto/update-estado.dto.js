"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEstadoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_estado_dto_1 = require("./create-estado.dto");
class UpdateEstadoDto extends (0, mapped_types_1.PartialType)(create_estado_dto_1.CreateEstadoDto) {
}
exports.UpdateEstadoDto = UpdateEstadoDto;
//# sourceMappingURL=update-estado.dto.js.map
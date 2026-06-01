"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLocalidadDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_localidad_dto_1 = require("./create-localidad.dto");
class UpdateLocalidadDto extends (0, mapped_types_1.PartialType)(create_localidad_dto_1.CreateLocalidadDto) {
}
exports.UpdateLocalidadDto = UpdateLocalidadDto;
//# sourceMappingURL=update-localidad.dto.js.map
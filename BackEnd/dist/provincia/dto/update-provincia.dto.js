"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProvinciaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_provincia_dto_1 = require("./create-provincia.dto");
class UpdateProvinciaDto extends (0, mapped_types_1.PartialType)(create_provincia_dto_1.CreateProvinciaDto) {
}
exports.UpdateProvinciaDto = UpdateProvinciaDto;
//# sourceMappingURL=update-provincia.dto.js.map
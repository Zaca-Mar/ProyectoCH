"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTallerDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_taller_dto_1 = require("./create-taller.dto");
class UpdateTallerDto extends (0, mapped_types_1.PartialType)(create_taller_dto_1.CreateTallerDto) {
}
exports.UpdateTallerDto = UpdateTallerDto;
//# sourceMappingURL=update-taller.dto.js.map
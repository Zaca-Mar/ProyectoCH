"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTalleDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_talle_dto_1 = require("./create-talle.dto");
class UpdateTalleDto extends (0, mapped_types_1.PartialType)(create_talle_dto_1.CreateTalleDto) {
}
exports.UpdateTalleDto = UpdateTalleDto;
//# sourceMappingURL=update-talle.dto.js.map
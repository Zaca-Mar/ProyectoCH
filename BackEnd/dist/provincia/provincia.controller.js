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
exports.ProvinciaController = void 0;
const common_1 = require("@nestjs/common");
const provincia_service_1 = require("./provincia.service");
const create_provincia_dto_1 = require("./dto/create-provincia.dto");
let ProvinciaController = class ProvinciaController {
    provinciaService;
    constructor(provinciaService) {
        this.provinciaService = provinciaService;
    }
    create(createProvinciaDto) {
        return this.provinciaService.create(createProvinciaDto);
    }
    findAll() {
        return this.provinciaService.findAll();
    }
    findOne(id) {
        return this.provinciaService.findOne(+id);
    }
};
exports.ProvinciaController = ProvinciaController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_provincia_dto_1.CreateProvinciaDto]),
    __metadata("design:returntype", void 0)
], ProvinciaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProvinciaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProvinciaController.prototype, "findOne", null);
exports.ProvinciaController = ProvinciaController = __decorate([
    (0, common_1.Controller)('provincia'),
    __metadata("design:paramtypes", [provincia_service_1.ProvinciaService])
], ProvinciaController);
//# sourceMappingURL=provincia.controller.js.map
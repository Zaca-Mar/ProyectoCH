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
exports.ArticulosController = void 0;
const common_1 = require("@nestjs/common");
const articulos_service_1 = require("./articulos.service");
const create_articulo_dto_1 = require("./dto/create-articulo.dto");
const update_articulo_dto_1 = require("./dto/update-articulo.dto");
let ArticulosController = class ArticulosController {
    articulosService;
    constructor(articulosService) {
        this.articulosService = articulosService;
    }
    create(createArticuloDto) {
        return this.articulosService.create(createArticuloDto);
    }
    findAll() {
        return this.articulosService.findAll();
    }
    update(id, updateArticuloDto) {
        return this.articulosService.update(+id, updateArticuloDto);
    }
};
exports.ArticulosController = ArticulosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_articulo_dto_1.CreateArticuloDto]),
    __metadata("design:returntype", void 0)
], ArticulosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticulosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_articulo_dto_1.UpdateArticuloDto]),
    __metadata("design:returntype", void 0)
], ArticulosController.prototype, "update", null);
exports.ArticulosController = ArticulosController = __decorate([
    (0, common_1.Controller)('articulos'),
    __metadata("design:paramtypes", [articulos_service_1.ArticulosService])
], ArticulosController);
//# sourceMappingURL=articulos.controller.js.map
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
exports.TallerController = void 0;
const common_1 = require("@nestjs/common");
const taller_service_1 = require("./taller.service");
const create_taller_dto_1 = require("./dto/create-taller.dto");
const update_taller_dto_1 = require("./dto/update-taller.dto");
let TallerController = class TallerController {
    tallerService;
    constructor(tallerService) {
        this.tallerService = tallerService;
    }
    create(createTallerDto) {
        return this.tallerService.create(createTallerDto);
    }
    findAll() {
        return this.tallerService.findAll();
    }
    findOne(id) {
        return this.tallerService.findOne(+id);
    }
    update(id, updateTallerDto) {
        return this.tallerService.update(+id, updateTallerDto);
    }
};
exports.TallerController = TallerController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_taller_dto_1.CreateTallerDto]),
    __metadata("design:returntype", void 0)
], TallerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TallerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TallerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_taller_dto_1.UpdateTallerDto]),
    __metadata("design:returntype", void 0)
], TallerController.prototype, "update", null);
exports.TallerController = TallerController = __decorate([
    (0, common_1.Controller)('taller'),
    __metadata("design:paramtypes", [taller_service_1.TallerService])
], TallerController);
//# sourceMappingURL=taller.controller.js.map
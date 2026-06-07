"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalleModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const talle_service_1 = require("./talle.service");
const talle_controller_1 = require("./talle.controller");
const talle_entity_1 = require("./entities/talle.entity");
let TalleModule = class TalleModule {
};
exports.TalleModule = TalleModule;
exports.TalleModule = TalleModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([talle_entity_1.Talle])],
        controllers: [talle_controller_1.TalleController],
        providers: [talle_service_1.TalleService],
        exports: [typeorm_1.TypeOrmModule, talle_service_1.TalleService],
    })
], TalleModule);
//# sourceMappingURL=talle.module.js.map
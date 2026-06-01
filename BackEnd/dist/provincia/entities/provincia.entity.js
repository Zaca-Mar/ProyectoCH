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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provincia = void 0;
const typeorm_1 = require("typeorm");
const localidad_entity_1 = require("../../localidad/entities/localidad.entity");
let Provincia = class Provincia {
    id_provincia;
    nombre;
    localidades;
};
exports.Provincia = Provincia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Provincia.prototype, "id_provincia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Provincia.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => localidad_entity_1.Localidad, (localidad) => localidad.provincia),
    __metadata("design:type", Array)
], Provincia.prototype, "localidades", void 0);
exports.Provincia = Provincia = __decorate([
    (0, typeorm_1.Entity)('provincia')
], Provincia);
//# sourceMappingURL=provincia.entity.js.map
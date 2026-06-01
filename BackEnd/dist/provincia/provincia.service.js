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
exports.ProvinciaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const provincia_entity_1 = require("./entities/provincia.entity");
let ProvinciaService = class ProvinciaService {
    provinciaRepository;
    constructor(provinciaRepository) {
        this.provinciaRepository = provinciaRepository;
    }
    async create(createProvinciaDto) {
        const nueva = this.provinciaRepository.create(createProvinciaDto);
        return await this.provinciaRepository.save(nueva);
    }
    async findAll() {
        return await this.provinciaRepository.find({ relations: { localidades: true } });
    }
    async findOne(id) {
        const provincia = await this.provinciaRepository.findOne({ where: { id_provincia: id } });
        if (!provincia)
            throw new common_1.NotFoundException(`Provincia con ID ${id} no encontrada`);
        return provincia;
    }
};
exports.ProvinciaService = ProvinciaService;
exports.ProvinciaService = ProvinciaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(provincia_entity_1.Provincia)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProvinciaService);
//# sourceMappingURL=provincia.service.js.map
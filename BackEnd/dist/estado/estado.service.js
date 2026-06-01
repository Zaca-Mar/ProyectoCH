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
exports.EstadoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const estado_entity_1 = require("./entities/estado.entity");
let EstadoService = class EstadoService {
    estadoRepository;
    constructor(estadoRepository) {
        this.estadoRepository = estadoRepository;
    }
    async create(createEstadoDto) {
        const nuevo = this.estadoRepository.create(createEstadoDto);
        return await this.estadoRepository.save(nuevo);
    }
    async findAll() {
        return await this.estadoRepository.find();
    }
    async findOne(id) {
        const estado = await this.estadoRepository.findOne({ where: { id_estado: id } });
        if (!estado)
            throw new common_1.NotFoundException(`Estado con ID ${id} no encontrado`);
        return estado;
    }
};
exports.EstadoService = EstadoService;
exports.EstadoService = EstadoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(estado_entity_1.Estado)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EstadoService);
//# sourceMappingURL=estado.service.js.map
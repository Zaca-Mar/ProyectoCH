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
exports.TallerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const taller_entity_1 = require("./entities/taller.entity");
const localidad_service_1 = require("../localidad/localidad.service");
let TallerService = class TallerService {
    tallerRepository;
    localidadService;
    constructor(tallerRepository, localidadService) {
        this.tallerRepository = tallerRepository;
        this.localidadService = localidadService;
    }
    async create(createTallerDto) {
        const localidad = await this.localidadService.findOne(createTallerDto.id_localidad);
        const nuevoTaller = this.tallerRepository.create({
            nombre: createTallerDto.nombre,
            calle: createTallerDto.calle,
            numero: createTallerDto.numero,
            localidad: localidad
        });
        return await this.tallerRepository.save(nuevoTaller);
    }
    async findAll() {
        return await this.tallerRepository.find();
    }
    async findOne(id) {
        const taller = await this.tallerRepository.findOne({ where: { id_taller: id } });
        if (!taller)
            throw new common_1.NotFoundException(`Taller con ID ${id} no encontrado`);
        return taller;
    }
    async update(id, updateTallerDto) {
        const taller = await this.findOne(id);
        if (updateTallerDto.id_localidad) {
            const localidad = await this.localidadService.findOne(updateTallerDto.id_localidad);
            taller.localidad = localidad;
        }
        Object.assign(taller, {
            nombre: updateTallerDto.nombre ?? taller.nombre,
            calle: updateTallerDto.calle ?? taller.calle,
            numero: updateTallerDto.numero ?? taller.numero,
        });
        return await this.tallerRepository.save(taller);
    }
};
exports.TallerService = TallerService;
exports.TallerService = TallerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(taller_entity_1.Taller)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        localidad_service_1.LocalidadService])
], TallerService);
//# sourceMappingURL=taller.service.js.map
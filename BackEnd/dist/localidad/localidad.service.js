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
exports.LocalidadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const localidad_entity_1 = require("./entities/localidad.entity");
const provincia_service_1 = require("../provincia/provincia.service");
let LocalidadService = class LocalidadService {
    localidadRepository;
    provinciaService;
    constructor(localidadRepository, provinciaService) {
        this.localidadRepository = localidadRepository;
        this.provinciaService = provinciaService;
    }
    async create(createLocalidadDto) {
        const provincia = await this.provinciaService.findOne(createLocalidadDto.id_provincia);
        const nuevaLocalidad = this.localidadRepository.create({
            nombre: createLocalidadDto.nombre,
            cp: createLocalidadDto.cp,
            provincia: provincia
        });
        return await this.localidadRepository.save(nuevaLocalidad);
    }
    async findAll() {
        return await this.localidadRepository.find({ relations: { provincia: true } });
    }
    async findOne(id) {
        const localidad = await this.localidadRepository.findOne({
            where: { id_localidad: id },
            relations: { provincia: true },
        });
        if (!localidad)
            throw new common_1.NotFoundException(`Localidad con ID ${id} no encontrada`);
        return localidad;
    }
    async update(id, updateLocalidadDto) {
        const localidad = await this.findOne(id);
        if (updateLocalidadDto.id_provincia) {
            const provincia = await this.provinciaService.findOne(updateLocalidadDto.id_provincia);
            localidad.provincia = provincia;
        }
        Object.assign(localidad, {
            nombre: updateLocalidadDto.nombre ?? localidad.nombre,
            cp: updateLocalidadDto.cp ?? localidad.cp,
        });
        return await this.localidadRepository.save(localidad);
    }
};
exports.LocalidadService = LocalidadService;
exports.LocalidadService = LocalidadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(localidad_entity_1.Localidad)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        provincia_service_1.ProvinciaService])
], LocalidadService);
//# sourceMappingURL=localidad.service.js.map
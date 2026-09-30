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
exports.TalleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const talle_entity_1 = require("./entities/talle.entity");
const ORDEN_LETRAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'];
let TalleService = class TalleService {
    talleRepository;
    constructor(talleRepository) {
        this.talleRepository = talleRepository;
    }
    async create(data) {
        const nuevo = this.talleRepository.create(data);
        return await this.talleRepository.save(nuevo);
    }
    async findAll() {
        const talles = await this.talleRepository.find();
        return talles.sort((a, b) => this.compararTalles(a.nombre, b.nombre));
    }
    async findOne(id) {
        return await this.talleRepository.findOne({ where: { id_talle: id } });
    }
    async remove(id) {
        const talle = await this.talleRepository.findOne({ where: { id_talle: id } });
        if (!talle) {
            throw new common_1.NotFoundException(`Talle con ID ${id} no encontrado`);
        }
        try {
            await this.talleRepository.remove(talle);
            return { message: `Talle "${talle.nombre}" eliminado correctamente` };
        }
        catch (err) {
            throw new common_1.BadRequestException(`No se pudo eliminar el talle "${talle.nombre}": probablemente ya está en uso en algún movimiento de stock.`);
        }
    }
    compararTalles(a, b) {
        const numA = Number(a);
        const numB = Number(b);
        const esNumA = !isNaN(numA) && a.trim() !== '';
        const esNumB = !isNaN(numB) && b.trim() !== '';
        if (esNumA && esNumB)
            return numA - numB;
        if (esNumA && !esNumB)
            return -1;
        if (!esNumA && esNumB)
            return 1;
        const idxA = ORDEN_LETRAS.indexOf(a);
        const idxB = ORDEN_LETRAS.indexOf(b);
        return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    }
};
exports.TalleService = TalleService;
exports.TalleService = TalleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(talle_entity_1.Talle)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TalleService);
//# sourceMappingURL=talle.service.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const articulos_module_1 = require("./articulos/articulos.module");
const color_module_1 = require("./color/color.module");
const taller_module_1 = require("./taller/taller.module");
const provincia_module_1 = require("./provincia/provincia.module");
const localidad_module_1 = require("./localidad/localidad.module");
const estado_module_1 = require("./estado/estado.module");
const movimientos_stock_module_1 = require("./movimientos_stock/movimientos_stock.module");
const talle_module_1 = require("./talle/talle.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    autoLoadEntities: true,
                    synchronize: true,
                    ssl: {
                        rejectUnauthorized: false,
                    },
                }),
            }),
            articulos_module_1.ArticulosModule,
            color_module_1.ColorModule,
            taller_module_1.TallerModule,
            provincia_module_1.ProvinciaModule,
            localidad_module_1.LocalidadModule,
            estado_module_1.EstadoModule,
            movimientos_stock_module_1.MovimientosStockModule,
            talle_module_1.TalleModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
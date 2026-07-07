import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticulosModule } from './articulos/articulos.module';
import { ColorModule } from './color/color.module';
import { TallerModule } from './taller/taller.module';
import { ProvinciaModule } from './provincia/provincia.module';
import { LocalidadModule } from './localidad/localidad.module';
import { EstadoModule } from './estado/estado.module';
import { MovimientosStockModule } from './movimientos_stock/movimientos_stock.module';
import { TalleModule } from './talle/talle.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
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
  ArticulosModule,
  ColorModule,
  TallerModule,
  ProvinciaModule,
  LocalidadModule,
  EstadoModule,
  MovimientosStockModule,
  TalleModule,
  AuthModule,
  UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

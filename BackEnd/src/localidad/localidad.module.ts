import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalidadService } from './localidad.service';
import { LocalidadController } from './localidad.controller';
import { Localidad } from './entities/localidad.entity';
import { ProvinciaModule } from '../provincia/provincia.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Localidad]),
    ProvinciaModule // Importamos para poder buscar la provincia por ID
  ],
  controllers: [LocalidadController],
  providers: [LocalidadService],
  exports: [LocalidadService], // Lo exportamos para usarlo en Taller
})
export class LocalidadModule {}
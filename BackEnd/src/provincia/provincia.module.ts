import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinciaService } from './provincia.service';
import { ProvinciaController } from './provincia.controller';
import { Provincia } from './entities/provincia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Provincia])],
  controllers: [ProvinciaController],
  providers: [ProvinciaService],
  exports: [ProvinciaService], // Lo exportamos para usarlo en Localidad
})
export class ProvinciaModule {}
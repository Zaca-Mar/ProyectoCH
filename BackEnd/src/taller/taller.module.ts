import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TallerService } from './taller.service';
import { TallerController } from './taller.controller';
import { Taller } from './entities/taller.entity';
import { LocalidadModule } from '../localidad/localidad.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Taller]),
    LocalidadModule
  ],
  controllers: [TallerController],
  providers: [TallerService],
  exports: [TallerService]
})
export class TallerModule {}
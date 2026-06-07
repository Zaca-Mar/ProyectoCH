import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TalleService } from './talle.service';
import { TalleController } from './talle.controller';
import { Talle } from './entities/talle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Talle])], // 👈 Esto es clave para que funcione el Repository en el Service
  controllers: [TalleController],
  providers: [TalleService],
  exports: [TypeOrmModule, TalleService], // Lo exportamos por si movimientos-stock necesita usarlo
})
export class TalleModule {}
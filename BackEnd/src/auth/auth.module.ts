import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Importamos el módulo de usuarios
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule, // <--- Nos da acceso a UsersService
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'CLAVE_SECRETA_DE_PRUEBA', // Cambiala en producción
      signOptions: { expiresIn: '1d' }, // El token expira en 1 día
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
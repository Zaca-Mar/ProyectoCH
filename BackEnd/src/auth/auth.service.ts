import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, // Inyectamos el servicio de usuarios
    private jwtService: JwtService,     // Inyectamos el generador de JWT
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // 1. Buscar si el usuario existe
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Comparar la contraseña ingresada con el Hash de la BD
    // Asegurarnos de que exista el hash en la BD antes de comparar
    if (!user.password) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. Si todo está bien, creamos el "payload" (los datos públicos que viajan en el token)
    const payload = { sub: user.id, username: user.username };

    // 4. Retornamos el token firmado
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
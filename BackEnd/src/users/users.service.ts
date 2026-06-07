import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 1. Crear usuario con contraseña hasheada
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    // Verificar si ya existe el usuario
    const userExists = await this.usersRepository.findOne({ where: { username } });
    if (userExists) {
      throw new BadRequestException('El usuario ya existe');
    }

    // Hashear la contraseña (10 rondas de salting es el estándar seguro)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword,
    });

    return await this.usersRepository.save(newUser);
  }

  // 2. Método crucial para el módulo de AUTH
  async findOneByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { username } });
  }
}
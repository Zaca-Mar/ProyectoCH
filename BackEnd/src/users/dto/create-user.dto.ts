import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username!: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;
}
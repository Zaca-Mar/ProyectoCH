// Ejemplo con TypeORM (adaptalo si usás Prisma o Mongoose)
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password?: string; // El signo ? es por si en algún formato querés ocultarla
}
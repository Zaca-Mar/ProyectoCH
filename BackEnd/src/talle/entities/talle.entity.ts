import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('talle')
export class Talle {
  @PrimaryGeneratedColumn()
  id_talle!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre!: string;
}
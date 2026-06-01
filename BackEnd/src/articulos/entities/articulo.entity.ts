import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('articulo') 
export class Articulo {
  @PrimaryGeneratedColumn()
  id_articulo: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;
}


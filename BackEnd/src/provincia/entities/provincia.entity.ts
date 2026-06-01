import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Localidad } from '../../localidad/entities/localidad.entity';

@Entity('provincia')
export class Provincia {
  @PrimaryGeneratedColumn()
  id_provincia: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  // Una provincia tiene muchas localidades
  @OneToMany(() => Localidad, (localidad) => localidad.provincia)
  localidades: Localidad[];
}
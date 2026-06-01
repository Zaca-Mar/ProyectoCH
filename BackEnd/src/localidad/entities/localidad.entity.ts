import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Provincia } from '../../provincia/entities/provincia.entity';
import { Taller } from '../../taller/entities/taller.entity';

@Entity('localidad')
export class Localidad {
  @PrimaryGeneratedColumn()
  id_localidad: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  cp: string;

  // Muchas localidades pertenecen a una Provincia
  @ManyToOne(() => Provincia, (provincia) => provincia.localidades, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_provincia' })
  provincia: Provincia;

  // Una localidad puede tener muchos talleres
  @OneToMany(() => Taller, (taller) => taller.localidad)
  talleres: Taller[];
}
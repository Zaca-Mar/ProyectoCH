import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Localidad } from '../../localidad/entities/localidad.entity';
import { MovimientosStock } from '../../movimientos_stock/entities/movimientos_stock.entity';

@Entity('taller')
export class Taller {
  @PrimaryGeneratedColumn()
  id_taller: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'varchar', length: 150 })
  calle: string;

  @Column({ type: 'int' })
  numero: number;

  // Muchos talleres pertenecen a una Localidad
  @ManyToOne(() => Localidad, (localidad) => localidad.talleres, { eager: true })
  @JoinColumn({ name: 'id_localidad' })
  localidad: Localidad;

  @OneToMany(() => MovimientosStock, (movimiento) => movimiento.taller)
  movimientos: MovimientosStock[];
}
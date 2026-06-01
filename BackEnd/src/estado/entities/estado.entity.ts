import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MovimientosStock } from '../../movimientos_stock/entities/movimientos_stock.entity';

@Entity('estado')
export class Estado {
  @PrimaryGeneratedColumn()
  id_estado: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @OneToMany(() => MovimientosStock, (movimiento) => movimiento.estado)
  movimientos: MovimientosStock[];
}
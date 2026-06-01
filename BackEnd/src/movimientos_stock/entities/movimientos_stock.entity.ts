import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { Color } from '../../color/entities/color.entity';
import { Taller } from '../../taller/entities/taller.entity';
import { Estado } from '../../estado/entities/estado.entity';

@Entity('movimientos_stock')
export class MovimientosStock {
  @PrimaryGeneratedColumn()
  id_movimiento!: number; // 

  @CreateDateColumn({ type: 'timestamp' })
  fecha_hora_movimiento!: Date; // 

  @Column({ type: 'enum', enum: ['INGRESO', 'EGRESO'] })
  tipo_movimiento!: string; // 

  @Column({ type: 'int' })
  cantidad!: number; // 

  @ManyToOne(() => Articulo, { eager: true })
  @JoinColumn({ name: 'id_articulo' })
  articulo!: Articulo; // 

  @ManyToOne(() => Color, { eager: true })
  @JoinColumn({ name: 'id_color' })
  color!: Color; // 

  @ManyToOne(() => Taller, (taller) => taller.movimientos, { eager: true })
  @JoinColumn({ name: 'id_taller' })
  taller!: Taller; // 

  @ManyToOne(() => Estado, (estado) => estado.movimientos, { eager: true })
  @JoinColumn({ name: 'id_estado' })
  estado!: Estado; // 
}
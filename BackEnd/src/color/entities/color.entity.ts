import{ Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('color')
export class Color {
  @PrimaryGeneratedColumn()
  id_color: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;
}

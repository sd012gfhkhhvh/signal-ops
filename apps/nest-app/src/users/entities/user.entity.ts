import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;
}

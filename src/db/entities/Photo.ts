import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { FaceAnalytics } from './FaceAnalytics';

@Entity('photo')
export class Photo {
  @PrimaryGeneratedColumn('increment', {
    name: 'id'
  })
  public readonly id!: number

  @Column({
    name: 'filepath',
    type: 'text',
    unique: true,
    nullable: false
  })
  public filepath!: string

  @Column({
    name: 'filename',
    type: 'text',
    unique: true,
    nullable: false
  })
  public filename!: string

  @CreateDateColumn({
    name: 'created_at'
  })
  public created_at!: Date

  @UpdateDateColumn({
    name: 'updated_at'
  })
  public updated_at!: Date

  @OneToMany(() => FaceAnalytics, analysis => analysis.photo, { cascade: true })
  public analysis!: FaceAnalytics[]
}

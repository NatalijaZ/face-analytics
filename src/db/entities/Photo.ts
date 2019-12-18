import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FaceAnalytics } from './FaceAnalytics';

@Entity('photo')
export class Photo {
  @PrimaryGeneratedColumn('increment', {
    name: 'id'
  })
  public readonly id!: number

  @Column({
    name: 'filename',
    type: 'text',
    unique: true,
    nullable: false
  })
  public filename!: string

  @OneToMany(() => FaceAnalytics, analysis => analysis.photo, { cascade: true })
  public analysis!: FaceAnalytics[]
}

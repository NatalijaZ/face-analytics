import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Gender } from '@/models/Gender';
import { Photo } from './Photo';

@Entity('face_analytics')
export class FaceAnalytics {
  @PrimaryGeneratedColumn('increment', {
    name: 'id'
  })
  public readonly id!: number

  @Column({
    name: 'gender',
    type: 'enum',
    enum: Gender,
    default: Gender.NONE
  })
  public gender!: Gender

  @Column({
    name: 'age',
    type: 'int',
    transformer: {
      from: (it: any) => Number(it),
      to: (it: number) => Math.round(it)
    },
    default: 0
  })
  public age!: number

  @Column({
    name: 'expression_neutral',
    type: 'real',
    default: 0
  })
  public expression_neutral!: number

  @Column({
    name: 'expression_happy',
    type: 'real',
    default: 0
  })
  public expression_happy!: number

  @Column({
    name: 'expression_sad',
    type: 'real',
    default: 0
  })
  public expression_sad!: number

  @Column({
    name: 'expression_angry',
    type: 'real',
    default: 0
  })
  public expression_angry!: number

  @Column({
    name: 'expression_fearful',
    type: 'real',
    default: 0
  })
  public expression_fearful!: number

  @Column({
    name: 'expression_disgusted',
    type: 'real',
    default: 0
  })
  public expression_disgusted!: number

  @Column({
    name: 'expression_surprised',
    type: 'real',
    default: 0
  })
  public expression_surprised!: number

  @CreateDateColumn({
    name: 'created_at'
  })
  public created_at!: Date

  @UpdateDateColumn({
    name: 'updated_at'
  })
  public updated_at!: Date

  @ManyToOne(() => Photo, photo => photo.analysis)
  public photo!: Photo
}

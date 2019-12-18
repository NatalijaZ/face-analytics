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
    name: 'expression_sadness',
    type: 'real',
    default: 0
  })
  public expression_sadness!: number

  @Column({
    name: 'expression_disgust',
    type: 'real',
    default: 0
  })
  public expression_disgust!: number

  @Column({
    name: 'expression_anger',
    type: 'real',
    default: 0
  })
  public expression_anger!: number

  @Column({
    name: 'expression_surprise',
    type: 'real',
    default: 0
  })
  public expression_surprise!: number

  @Column({
    name: 'expression_fear',
    type: 'real',
    default: 0
  })
  public expression_fear!: number

  @Column({
    name: 'expression_happiness',
    type: 'real',
    default: 0
  })
  public expression_happiness!: number

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

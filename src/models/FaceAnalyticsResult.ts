import { Gender } from './Gender';

export interface FaceAnalyticsResult {
  image: string
  gender: Gender
  age: number
  expression: Expression
}

interface Expression {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
}

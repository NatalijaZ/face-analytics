export interface FaceAnalyticsResult {
  image: string
  gender: 'male' | 'female'
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

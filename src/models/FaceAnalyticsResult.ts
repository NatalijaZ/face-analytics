import { Gender } from './Gender';

export interface FaceAnalyticsResult {
  image: string
  gender: Gender
  age: number
  emotions: Emotions
}

interface Emotions {
  sadness: number,
  disgust: number,
  anger: number,
  surprise: number,
  fear: number,
  happiness: number
}

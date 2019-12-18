export interface FaceApiResponse {
  img_size: {
    h: number,
    w: number
  },
  error_code: number,
  description: string,
  people: People[]
}

interface People {
  mood: number,
  gender: number,
  age: number,
  clothingcolors: any[],
  emotions: {
    sadness: number,
    disgust: number,
    anger: number,
    surprise: number,
    fear: number,
    happiness: number
  },
  position: {
    x: number,
    y: number,
    w: number,
    h: number
  },
  rotation: {
    yaw: number,
    roll: number,
    pitch: number
  },
  landmarks: Landmarks,
  ethnicity: {
    caucasian: number,
    hispanic: number,
    asian: number,
    african: number
  }
}

interface Landmarks {
  righteye: {
    x: number,
    y: number
  },
  lefteye: {
    x: number,
    y: number
  },
  maskpoints: {
    x: number,
    y: number
  }[]
}

import { Service } from 'typedi';
import * as FaceAPI from 'face-api.js';
import Joi, { ValidationError } from 'joi';
import { NamedValidateError } from '@/exceptions/NamedValidateError';
import { FaceAnalyticsResult } from '@/models/FaceAnalyticsResult';

@Service(FaceAnalyticsManager.name)
export class FaceAnalyticsManager {
  private canvas = require('canvas')
  private faceDetectionNetwork = FaceAPI.nets.ssdMobilenetv1
  private faceDetectionNetworkOptions = new FaceAPI.SsdMobilenetv1Options({ minConfidence: 0.5 })

  constructor () {
    let errorMessage: ValidationError | null = null;

    if ((errorMessage = Joi.string().validate(process.env.WEIGHT_FOLDER).error))
      throw new NamedValidateError('WEIGHT_FOLDER', errorMessage.message);
  }

  public async prepare() {
    // prepare canvas for nodejs
    const { Canvas, Image, ImageData } = this.canvas;
    FaceAPI.env.monkeyPatch({ Canvas, Image, ImageData });
    // load weights
    await this.faceDetectionNetwork.loadFromDisk(process.env.WEIGHT_FOLDER);
    await FaceAPI.nets.faceExpressionNet.loadFromDisk(process.env.WEIGHT_FOLDER);
    await FaceAPI.nets.ageGenderNet.loadFromDisk(process.env.WEIGHT_FOLDER);
  }

  public async analyse (filepath: string): Promise<FaceAnalyticsResult> {
    const img = await this.canvas.loadImage(filepath);
    const result = await FaceAPI.detectSingleFace(img, this.faceDetectionNetworkOptions)
      .withAgeAndGender()
      .withFaceExpressions();

    return {
      gender: result!.gender,
      age: result!.age,
      expression: result!.expressions
    };
  }
}

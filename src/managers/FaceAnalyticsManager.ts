import Joi, { ValidationError } from 'joi';
import { NamedValidateError } from '@/exceptions/NamedValidateError';
import { FaceAnalyticsResult } from '@/models/FaceAnalyticsResult';
import { FaceApiResponse } from '@/models/FaceApiResponse';
import { Service } from 'typedi';
import { Gender } from '@/models/Gender';
import Exec from 'child_process';

@Service(FaceAnalyticsManager.name)
export class FaceAnalyticsManager {
  constructor () {
    let errorMessage: ValidationError | null = null;

    if ((errorMessage = Joi.string().uri().validate(process.env.FACE_API_URL).error))
      throw new NamedValidateError('FACE_API_URL', errorMessage.message);

    if ((errorMessage = Joi.string().validate(process.env.FACE_API_TOKEN).error))
      throw new NamedValidateError('FACE_API_TOKEN', errorMessage.message);
  }

  public async analyse(filepath: string): Promise<FaceAnalyticsResult[]> {
    const curl = `
      curl \
        -X POST \
        -H 'Content-Type: multipart/form-data' \
        -F app_key=${process.env.FACE_API_TOKEN} \
        -F img=@${filepath} \
        ${process.env.FACE_API_URL}`;

    const result: FaceApiResponse = JSON.parse(Exec.execSync(curl).toString());

    if (!result.people)
      // TODO
      throw new Error('exec error');

    if (result.people.length <= 0)
      throw new Error('Faces not found on image');

    return result.people.map(it => ({
      image: filepath,
      gender: it.gender > 0 ? Gender.FEMALE : Gender.MALE,
      age: it.age,
      emotions: it.emotions
    }));
  }
}

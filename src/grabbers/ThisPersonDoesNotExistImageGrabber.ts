import { FileGrabber } from '@/grabbers/FileGrabber';
import Joi, { ValidationError } from 'joi';
import { Service } from 'typedi';

@Service(ThisPersonDoesNotExistImageGrabber.name)
export class ThisPersonDoesNotExistImageGrabber implements FileGrabber {
  constructor () {
    let errorMessage: ValidationError | null = null;

    if ((errorMessage = Joi.string().uri().validate(process.env.BASE_SOURCE_LINK).error))
      throw new Error(errorMessage.message);
  }
  getURL (): URL {
    return new URL(process.env.BASE_SOURCE_LINK + this.getPath());
  }

  getPath (): string {
    return '/image';
  }
}

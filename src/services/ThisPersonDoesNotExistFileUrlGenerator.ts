import { FileGrabber } from '@/services/FileUrlGenerator';
import Joi, { ValidationError } from 'joi';
import { Service } from 'typedi';
import { NamedValidateError } from '@/exceptions/NamedValidateError';

@Service(ThisPersonDoesNotExistFileUrlGenerator.name)
export class ThisPersonDoesNotExistFileUrlGenerator implements FileGrabber {
  private path = this.getPath()
  constructor () {
    let errorMessage: ValidationError | null = null;

    if ((errorMessage = Joi.string().uri().validate(process.env.BASE_SOURCE_LINK).error))
      throw new NamedValidateError('BASE_SOURCE_LINK', errorMessage.message);
  }
  getURL (): URL {
    return new URL(process.env.BASE_SOURCE_LINK! + this.path.next().value);
  }

  *getPath (): IterableIterator<string> {
    while (true) {
      yield '/image';
    }
  }
}

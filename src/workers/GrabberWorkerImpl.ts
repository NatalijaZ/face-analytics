import { Service } from 'typedi';
import { GrabberWorker } from './GrabberWorker';
import Joi, { ValidationError } from 'joi';
import { Logger } from '@/utils/Logger';
import Exec from 'child_process';
import { NamedValidateError } from '@/exceptions/NamedValidateError';

@Service(GrabberWorkerImpl.name)
export class GrabberWorkerImpl implements GrabberWorker {
  constructor () {
    let errorMessage: ValidationError | null = null;

    if ((errorMessage = Joi.string().validate(process.env.DATASET_ROOT_FOLDER).error))
      throw new NamedValidateError('DATASET_ROOT_FOLDER', errorMessage.message);

    if ((errorMessage = Joi.string().validate(process.env.USER_AGENT).error))
      throw new NamedValidateError('USER_AGENT', errorMessage.message);
  }

  *grab (url: URL, limit: number, threadIdentificator: string = '1_'): IterableIterator<string> {
    const datasetFolderName = new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString();
    // create dataset folder
    this.createDatasetFolder(process.env.DATASET_ROOT_FOLDER + '/' + datasetFolderName);

    // download dataset
    for (let i = 0; i < limit; i++) {
      try {
        const filename = process.env.DATASET_ROOT_FOLDER + '/' + datasetFolderName + '/' + threadIdentificator + i + '.jpg';
        Exec.execSync(`curl -A ${process.env.USER_AGENT} ${url.href} --output ${filename}`);

        yield filename;
      } catch (err) {
        Logger.error(GrabberWorkerImpl.name, err);
      }
    }
  }

  private createDatasetFolder (folderName: string) {
    Exec.execSync(`mkdir -p ${folderName}`);
  }
}

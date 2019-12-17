import { Service, Inject } from 'typedi';
import { FileGrabber } from '@/services/FileUrlGenerator';
import { ThisPersonDoesNotExistFileUrlGenerator } from '@/services/ThisPersonDoesNotExistFileUrlGenerator';
import { GrabberWorker } from '@/workers/GrabberWorker';
import { GrabberWorkerImpl } from '@/workers/GrabberWorkerImpl';
import Joi, { ValidationError } from 'joi';
import { Promisify } from './utils/Promisify';
import { NamedValidateError } from './exceptions/NamedValidateError';
import { FaceAnalyticsManager } from './managers/FaceAnalyticsManager';

@Service(FaceAnalyticsApplication.name)
export class FaceAnalyticsApplication {
  @Inject(ThisPersonDoesNotExistFileUrlGenerator.name)
  private fileGrabber!: FileGrabber
  @Inject(GrabberWorkerImpl.name)
  private grabWorker!: GrabberWorker
  @Inject(FaceAnalyticsManager.name)
  private faceAnalyticsManager!: FaceAnalyticsManager

  constructor () {
    let errorMessage: ValidationError | null = null;

    if ((errorMessage = Joi.number().positive().validate(process.env.DATASET_THREAD_SIZE).error))
      throw new NamedValidateError('DATASET_THREAD_SIZE', errorMessage.message);

    if ((errorMessage = Joi.number().positive().validate(process.env.THREAD_COUNT).error))
      throw new NamedValidateError('THREAD_COUNT', errorMessage.message);

    if ((errorMessage = Joi.number().positive().validate(process.env.GRAB_TIMEOUT).error))
      throw new NamedValidateError('GRAB_TIMEOUT', errorMessage.message);
  }

  public async start () {
    await this.faceAnalyticsManager.prepare();

    const grabTimeout = Number(process.env.GRAB_TIMEOUT);
    const threadCount = Number(process.env.THREAD_COUNT);

    Array
      .from({ length: threadCount }, (_, i) => this.tasksQueue(i + 1))
      .forEach(async it => {
        let task: IteratorResult<string, string>;

        while (!(task = it.next()).done) {
          await Promisify.later(async () => {
            const analysis = await this.faceAnalyticsManager.analyse(task.value);
            console.log(analysis);
          }, grabTimeout);
        }
        
      });
  }

  private tasksQueue(thread: number): IterableIterator<string> {
    const threadIdentificator = thread + '_';
    const datasetSize = Number(process.env.DATASET_THREAD_SIZE);
    return this.grabWorker.grab(this.fileGrabber.getURL(), datasetSize, threadIdentificator);
  }
}

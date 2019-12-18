import { Service, Inject } from 'typedi';
import { FileGrabber } from '@/services/FileUrlGenerator';
import { ThisPersonDoesNotExistFileUrlGenerator } from '@/services/ThisPersonDoesNotExistFileUrlGenerator';
import { GrabberWorker } from '@/workers/GrabberWorker';
import { GrabberWorkerImpl } from '@/workers/GrabberWorkerImpl';
import Joi, { ValidationError } from 'joi';
import { Promisify } from './utils/Promisify';
import { NamedValidateError } from './exceptions/NamedValidateError';
import { FaceAnalyticsManager } from './managers/FaceAnalyticsManager';
import { createConnection } from 'typeorm';
import { Photo } from './db/entities/Photo';
import { Logger } from './utils/Logger';
import { Filepath } from './models/Filepath';

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

    if ((errorMessage = Joi.string().validate(process.env.DB_CONNECTION).error))
      throw new NamedValidateError('DB_CONNECTION', errorMessage.message);
  }

  public async start () {
    const databaseConnection = await createConnection(process.env.DB_CONNECTION!);

    const grabTimeout = Number(process.env.GRAB_TIMEOUT);
    const threadCount = Number(process.env.THREAD_COUNT);

    Array
      .from({ length: threadCount }, (_, i) => this.tasksQueue(i + 1))
      .forEach(async it => {
        let task: IteratorResult<Filepath, Filepath>;

        while (!(task = it.next()).done) {
          await Promisify.later(async () => {
            const analysis = await this.faceAnalyticsManager.analyse(
              task.value.path + '/' + task.value.filename
            );

            if (analysis.length > 0) {
              const photoRepository = databaseConnection.getRepository(Photo);
              const photo = photoRepository.create({
                filename: task.value.foldername + '/' + task.value.filename,
                filepath: task.value.path + '/' + task.value.filename,
                analysis: analysis.map(it => ({
                  gender: it.gender,
                  age: it.age,
                  expression_sadness: it.emotions.sadness,
                  expression_disgust: it.emotions.disgust,
                  expression_anger: it.emotions.anger,
                  expression_surprise: it.emotions.surprise,
                  expression_fear: it.emotions.fear,
                  expression_happiness: it.emotions.happiness
                }))
              });

              photoRepository.save(photo);
            } else {
              Logger.error(FaceAnalyticsApplication.name, `faces not found on '${task.value}' image`);
            }
          }, grabTimeout);
        }

      });
  }

  private tasksQueue (thread: number): IterableIterator<Filepath> {
    const threadIdentificator = thread + '_';
    const datasetSize = Number(process.env.DATASET_THREAD_SIZE);
    return this.grabWorker.grab(this.fileGrabber.getURL(), datasetSize, threadIdentificator);
  }
}

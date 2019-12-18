import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm';
import { Photo } from '../entities/Photo';
import { Logger } from '@/utils/Logger';
import Exec from 'child_process';

@EventSubscriber()
export class PhotoSubscriber implements EntitySubscriberInterface<Photo> {
  listenTo = () => Photo;

  async afterRemove(event: RemoveEvent<Photo>) {
    try {
      Exec.execSync(`rm -f ${event.databaseEntity.filename}`);
    } catch (err) {
      Logger.error(PhotoSubscriber.name, err);
    }
  }
}

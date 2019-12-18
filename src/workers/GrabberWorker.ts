import { Filepath } from '@/models/Filepath';

export interface GrabberWorker {
  grab (url: URL, limit: number, threadIdentificator?: string): IterableIterator<Filepath>
}

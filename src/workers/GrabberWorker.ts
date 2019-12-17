export interface GrabberWorker {
  grab (url: URL, limit: number, threadIdentificator?: string): IterableIterator<string>
}

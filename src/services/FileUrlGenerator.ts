export interface FileGrabber {
  getURL (): URL
  getPath (): IterableIterator<string>
}

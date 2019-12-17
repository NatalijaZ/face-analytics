export class BadUrlError extends Error {
  constructor (message?: string) {
    super(message);

    this.name = 'BadUrlError';
  }
}

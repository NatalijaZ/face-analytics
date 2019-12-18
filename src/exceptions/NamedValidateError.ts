export class NamedValidateError extends Error {
  constructor (field: string, detail: string) {
    super();
    this.name = 'NamedValidateError';
    this.message = field + ': ' + detail;
  }
}

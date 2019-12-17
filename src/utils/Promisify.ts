export class Promisify {
  public static later(task: () => any, timeout: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await task();
          resolve();
        } catch (err) {
          reject(err);
        }
      }, timeout);
    });
  }
}

export type DeferStatus = 'PENDING' | 'RESOLVED' | 'REJECTED';

export class Defer<T> {
  private _promise: Promise<T>;
  private _resolve?: (value?: T) => void;
  private _reject?: (reason?: any) => void;

  status: DeferStatus = 'PENDING';

  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }
  get promise() {
    return this._promise;
  }
  resolve(value?: T) {
    if (!this._resolve) {
      throw new Error('No promise resolve in defer');
    }
    this._resolve(value);
    this.status = 'RESOLVED';
  }
  reject(reason: any) {
    if (!this._reject) {
      throw new Error('No promise reject in defer');
    }
    this._reject(reason);
    this.status = 'REJECTED';
  }
}

export class AsyncLock<T> {
  defer?: Defer<T>;
  private lockId: string | null = null;

  lock(id: string): boolean {
    if (this.status === 'PENDING') {
      console.warn('Attempt to lock an already lock RefreshLock');
      return false;
    }

    this.lockId = id;
    this.defer = new Defer<T>();
    return true;
  }

  unlock(id: string, value?: T): boolean {
    if (this.lockId === id) {
      setTimeout(() => {
        // Use a "setTimeout" to wait for next event loop tick
        this.defer?.resolve(value);
        this.lockId = null;
      });
      return true;
    }
    return false;
  }

  get pending() {
    return this.defer ? this.defer.promise : Promise.resolve();
  }

  get status() {
    return this.defer?.status;
  }
}

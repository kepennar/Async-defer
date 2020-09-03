import { AsyncLock } from '../src';

describe('AsyncLock', () => {
  it('should lock', async done => {
    setTimeout(() => {
      done();
    }, 100);

    const asyncLock = new AsyncLock();

    expect(asyncLock.status).toBeUndefined();

    asyncLock.lock('testId');
    expect(asyncLock.status).toEqual('PENDING');

    await asyncLock.pending;

    done('Should not resolve pending promise');
  });

  it('should unlock', async done => {
    const asyncLock = new AsyncLock();
    asyncLock.lock('testId');
    setTimeout(() => {
      asyncLock.unlock('testId');
    }, 100);

    await asyncLock.pending;

    done();
  });

  it('should not allow to lock twice', async () => {
    const asyncLock = new AsyncLock();
    const firstLockResult = asyncLock.lock('testId');
    const secondLockResult = asyncLock.lock('testId');

    expect(firstLockResult).toBeTruthy();
    expect(secondLockResult).toBeFalsy();
  });

  it('should not unlock if id is wrong', async done => {
    setTimeout(() => {
      done();
    }, 100);

    const asyncLock = new AsyncLock();

    expect(asyncLock.status).toBeUndefined();

    asyncLock.lock('testId');
    const unlockResult = asyncLock.unlock('wrongId');

    expect(unlockResult).toBeFalsy();

    await asyncLock.pending;

    done('Should not resolve pending promise');
  });
});

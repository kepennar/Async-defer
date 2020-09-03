import { Defer } from '../src';

describe('Defer', () => {
  it('should be pendable', async done => {
    const defer = new Defer<string>();
    const promise = defer.promise;

    setTimeout(() => {
      done();
    }, 100);

    await promise;

    done('Promise should not be resolved ');
  });

  it('should be resolvable', async () => {
    const defer = new Defer<string>();

    expect(defer.status).toEqual('PENDING');

    defer.resolve('blah');
    const value = await defer.promise;

    expect(defer.status).toEqual('RESOLVED');
    expect(value).toEqual('blah');
  });

  it('should be rejectable', async () => {
    const defer = new Defer<string>();

    expect(defer.status).toEqual('PENDING');

    defer.reject('error');
    try {
      await defer.promise;
    } catch (error) {
      expect(defer.status).toEqual('REJECTED');
      expect(error).toEqual('error');
    }
  });
});

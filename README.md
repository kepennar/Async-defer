# Async defer

This package provide 2 async utilities

## Defer

A resolvable/rejectable promise from outside is constructor.

/!\ The defer concept is not included in Promise specification for good reasons. Do not use this abusively!

### Usage

```ts
const defer = new Defer<string>();
const value = await defer.promise;

defer.resolve('blah');

console.log(value); // > "blah"
```

```ts
const defer = new Defer<string>();
try {
  const value = await defer.promise;
  defer.reject('blah');
} catch (error) {
  console.log(error); // > "blah"
}
```

## Async lock

### Usage

```ts
const asyncLock = new AsyncLock();
asyncLock.lock('example');

setTimeout(() => {
  asyncLock.unlock('example');
}, 1000);

await asyncLock.pending;
console.log('This log will be printed after 1s');
```

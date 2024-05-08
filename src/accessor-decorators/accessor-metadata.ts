import "reflect-metadata";

function Cache() {
  return function (
    _: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const key = Symbol.for(`cache_for_${propertyKey}`);

    const originalMethod = descriptor.get!;

    descriptor.get = function () {
      const value =
        Reflect.getMetadata(key, this, propertyKey) ??
        originalMethod.apply(this);

      Reflect.defineMetadata(key, value, this, propertyKey);

      return value;
    };
  };
}

function invalidateCache<T extends Object>(
  target: T,
  propertyKey: keyof T & string
) {
  const key = Symbol.for(`cache_for_${propertyKey}`);

  Reflect.deleteMetadata(key, target, propertyKey);
}

class User {
  constructor(public name: string) {}

  @Cache()
  get nameWithRandomNumber() {
    return `${this.name}_${Math.random()}`;
  }
}

const user = new User("john doe");
console.log(user.nameWithRandomNumber);
console.log(user.nameWithRandomNumber);
console.log(user.nameWithRandomNumber);

console.log('CLEARING CACHE');

invalidateCache(user, "nameWithRandomNumber");
console.log(user.nameWithRandomNumber);
console.log(user.nameWithRandomNumber);

// Accessor logging decorator
export function accessorLogging(target: any, key: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.get!;
  descriptor.get = function() {
    console.log(`Getting ${key} with value ${originalMethod.call(this)}`);
    return originalMethod.call(this);
  };
  return descriptor;
}

class Person {
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }

  @accessorLogging
  get name() {
    return this._name;
  }
}

console.log(new Person('John Doe').name);
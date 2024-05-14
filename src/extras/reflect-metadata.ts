import 'reflect-metadata';

const metadataKey = Symbol('class:metadata');

function ClassMetadata(data: any) {
    return function(constructor: Function) {
        Reflect.defineMetadata(metadataKey, data, constructor);
    }
}

@ClassMetadata({ table: 'users', primaryKey: 'id' })
class User {
    constructor(public name: string) {}
}

function getMetadata(constructor: Function): any {
    return Reflect.getMetadata(Symbol('metadata'), constructor);
}

console.log(getMetadata(User));
// Output:
// { table: 'users', primaryKey: 'id' }

import 'reflect-metadata';

const tableKey = Symbol('table');

function Model(name: string) {
    return function(constructor: Function) {
        Reflect.defineMetadata(tableKey, name, constructor);
    }
}


@Model('users')
class User {
    constructor(public name: string) {}
}

function getTableName(constructor: Function): string {
    return Reflect.getMetadata(tableKey, constructor);
}

console.log(getTableName(User));

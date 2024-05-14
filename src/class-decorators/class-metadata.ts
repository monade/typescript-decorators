import 'reflect-metadata';

const tableKey = Symbol('table');

function TableName(name: string) {
    return function(constructor: Function) {
        Reflect.defineMetadata(tableKey, name, constructor);
    }
}

@TableName('users')
class User {
    constructor(public name: string) {}
}

function getTableName(constructor: Function): string {
    return Reflect.getMetadata(tableKey, constructor);
}

console.log(getTableName(User));

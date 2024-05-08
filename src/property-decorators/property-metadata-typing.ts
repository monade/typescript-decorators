import 'reflect-metadata';

type Types = 'string' | 'object' | 'number' | 'boolean' | 'array' | 'date' | 'null' | 'undefined' | 'function' | 'symbol' | 'bigint';

function Type(type: Types) {
    return function(target: Object, propertyKey: string) {
        Reflect.defineMetadata('design:type', { name: type }, target, propertyKey);
    }
}

function validateTyping<T extends Object>(target: T, propertyKey: keyof T & string) {
    const type = Reflect.getMetadata('design:type', target, propertyKey as string);

    if (typeof target[propertyKey] !== type.name) {
        throw new Error(`Invalid type: ${propertyKey} is not of type ${type.name}. Got ${typeof target[propertyKey]} instead.`);
    }
}

class User {
    @Type('string') name: string;

    constructor(name: string) {
        this.name = name;

        validateTyping(this, 'name');
    }
}

console.log(new User('john doe')); // OK

new User(1 as any); // ERROR

import 'reflect-metadata';


function Singleton<T extends { new (...args: any[]): {} }>(constructor: T) {
    // This symbol will uniquely represent the singleton instance in the metadata
    const singletonKey = Symbol.for(`singleton_${constructor.name}`);

    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            if (!Reflect.hasMetadata(singletonKey, constructor)) {
                // Store the instance as metadata attached to the class
                Reflect.defineMetadata(singletonKey, this, constructor);
            }
            return Reflect.getMetadata(singletonKey, constructor);
        }
    }
}

@Singleton
class DatabaseConnection {
    constructor() {}

    runQuery() {
        console.log('Running query...');
    }
}

const connection1 = new DatabaseConnection();
const connection2 = new DatabaseConnection();

connection1.runQuery();

console.log(connection2 === connection1);
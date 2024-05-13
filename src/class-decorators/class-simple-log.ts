function logClass<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            console.log('New instance of class created');
            super(...args);
        }
    }
    
}

@logClass
class Example {
}

new Example();
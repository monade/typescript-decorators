
function safe(target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
        try {
            return originalMethod.apply(this, args);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
            } else {
                console.error(`An unexpected error occurred: ${error}`);
            }
        }
    };

    return descriptor;
}

function safeAsync(target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]) {
        try {
            return await originalMethod.apply(this, args);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
            } else {
                console.error(`An unexpected error occurred: ${error}`);
            }
        }
    };

    return descriptor;
}


class MyClass {
    constructor() {}

    @safe
    doSomething() {
        throw new Error('Something went wrong');
    }

    @safeAsync
    async doSomethingAsync() {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Something went wrong asyncronously'));
            }, 1000);
        });
    }
}

const myClass = new MyClass();

myClass.doSomething();

console.log('Done!')

myClass.doSomethingAsync().then(() => {
    console.log('Done x2!')
})

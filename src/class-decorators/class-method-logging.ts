import 'reflect-metadata';

function traceClass(target: Function) {
    const keys = Object.getOwnPropertyNames(target.prototype);

    keys.forEach(key => {
        const originalMethod = target.prototype[key];

        if (key !== 'constructor' && typeof originalMethod === 'function') {
            target.prototype[key] = function(...args: any[]) {
                console.log(`Entering ${key} with arguments: ${args.join(', ')}`);
                
                const startTime = performance.now(); // Start timing
                
                try {
                    const result = originalMethod.apply(this, args);
                    console.log(`Exiting ${key} with result: ${result}`);
                    return result;
                } finally {
                    const endTime = performance.now(); // End timing
                    console.log(`${key} execution time: ${endTime - startTime}ms`);
                    console.log()
                }
            };
        }
    });
}

@traceClass
class Example {
    sayHello(name: string) {
        return `Hello, ${name}!`;
    }

    add(a: number, b: number) {
        return a + b;
    }
}

const example = new Example();

example.sayHello("Alice");
example.add(5, 3);
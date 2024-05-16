
function TypeCheck(...types: string[]) {
    return function(target: Object, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function(...args: any[]) {
            if (args.length !== types.length - 1) {
                console.error('Argument count mismatch. Expected', types.length - 1, 'got', args.length);
            }

            for (let i = 0; i < args.length; i++) {
                if (typeof args[i] !== types[i]) {
                    console.error(`Argument type mismatch at position ${i}. Expected ${types[i]}, got ${typeof args[i]}`);
                }
            }

            const result = originalMethod.apply(this, args);

            if (typeof result !== types[types.length - 1]) {
                console.error('Return type mismatch. Expected', types[types.length - 1], 'got', typeof result);
            }

            return result;
        }

        return descriptor;
    }

}

class Calculator {
    constructor() {}

    @TypeCheck('number', 'number', 'string')
    sumMoney(a: number, b: number) {
        return (+(a + b)).toFixed(2);
    }

    @TypeCheck('number', 'number', 'string')
    brokenMoney(a: number, b: number) {
        return (a + b) as unknown as string;
    }
}

const calculator = new Calculator();

console.log('RESULT', calculator.sumMoney(1, 2));

console.log('RESULT', calculator.brokenMoney(5, 2));

console.log('RESULT', calculator.sumMoney(1, '2' as any));

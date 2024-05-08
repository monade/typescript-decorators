import 'reflect-metadata';

interface Validation {
    index: number;
    validation: (parameter: any) => void;
}

const validationsMetadataKey = Symbol("method:validations");


function validate<T extends Object>(target: T, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
        const validations = Reflect.getOwnMetadata(validationsMetadataKey, target, key) as Validation[];

        for (const validation of validations) {
            validation.validation(args[validation.index]);
        }

        return originalMethod.apply(this, args);
    }

    return descriptor;
}

function required() {
    return function<T extends Object>(target: T, propertyKey: string, parameterIndex: number) {
        const validations = (Reflect.getOwnMetadata(validationsMetadataKey, target, propertyKey) ?? []) as Validation[];

        validations.push({
            index: parameterIndex,
            validation: (parameter: any) => {
                if (parameter === null || parameter === undefined) {
                    throw new Error(`parameter ${parameterIndex} of ${propertyKey} is required. Got ${parameter}`);
                }
            }
        });

        Reflect.defineMetadata(validationsMetadataKey, validations, target, propertyKey);
    }
}

function greaterThan(value: number) {
    return function<T extends Object>(target: T, propertyKey: string, parameterIndex: number) {

        const validations = Reflect.getOwnMetadata(validationsMetadataKey, target, propertyKey) ?? [];

        validations.push({
            index: parameterIndex,
            validation: (parameter: number) => {
                if (typeof parameter !== 'number') {
                    throw new Error(`parameter ${parameterIndex} of ${propertyKey} must be a number. Got ${parameter}`);
                }
                if (parameter <= value) {
                    throw new Error(`parameter ${parameterIndex} of ${propertyKey} must be greater than ${value}. Got ${parameter}`);
                }
            }
        });

        Reflect.defineMetadata(validationsMetadataKey, validations, target, propertyKey);
    }
}

class Prova {
    value = 1;

    @validate
    provaMethod(@required() parameter1: string, @greaterThan(0) parameter2: number) {
        console.log('Executed method', parameter1, parameter2, this.value);
    }
}

const prova = new Prova();
prova.provaMethod('test', 1);
try {
    prova.provaMethod(null as any, 2);
} catch (e: any) {
    console.error(e.message);
}

try {
    prova.provaMethod('ciao', '' as any);
} catch (e: any) {
    console.error(e.message);
}

try {
    prova.provaMethod('ciao', -1);
} catch (e: any) {
    console.error(e.message);
}

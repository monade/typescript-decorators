function LogParameter(target: any, key: string, index: number) {

    const descriptor = Object.getOwnPropertyDescriptor(target, key);

    if (!descriptor) {
        console.error('failed', descriptor);
        return;
    }

    const originalMethod = descriptor.value as Function;

    descriptor.value = function(...args: any[]) {
        console.log(`Logging parameter ${index}:`, args[index]);
        return originalMethod.apply(this, args);
    }
}

class Person {
    method(@LogParameter param: any) {
        console.log(param);
    }
}

// THIS DOES NOT PRINT ANYTHING
new Person().method('ciao');

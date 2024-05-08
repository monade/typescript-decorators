import 'reflect-metadata';

const REFERENCES: WeakRef<any>[] = [];

function trace<T extends { new(...args: any[]): {} }>(constructor: T): T {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            REFERENCES.push(new WeakRef(this));
            console.log(`new ${constructor.name}(${args.join(', ')}). Reference count: ${REFERENCES.filter(ref => ref.deref() instanceof constructor).length}`);
        }
    }
}

@trace
class MyClass {
    constructor(public value: number) {}

    doSomething() {
        return this.value;
    }
}

let array: any = [
    new MyClass(1),
    new MyClass(2),
    new MyClass(3),
    new MyClass(4),
    new MyClass(5)
];


// IL GC NON GIRA SU NODEJS
{
    let obj = new MyClass(6);
}

delete array[2];
array = null;

declare const global: any;

if (global.gc) {
    global.gc();
} else {
    console.log('Garbage collection unavailable.  Pass --expose-gc '
      + 'when launching node to enable forced garbage collection.');
}

console.log(`Remaining references: ${REFERENCES.filter(e => e.deref() !== null).length}`);
console.log(REFERENCES[5].deref());

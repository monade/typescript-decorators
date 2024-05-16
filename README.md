# Typescript Decorators

This repository contains examples of Typescript decorators.

## Introduction

Typescript decorators are a way to add metadata to classes, methods, properties, or parameters. They are a feature of the language that allows you to write code that modifies the behavior of a class or method. Decorators are a way to add functionality to a class or method without changing the class or method itself.

## How to write a decorator

A typescript is essentially a function that takes a target object and a few metadata.

```typescript
function myDecorator(target: any, /* other info */) {
    /* do stuff */
}

@myDecorator
/* the class, property or method */
```

Example:
    
```typescript
function myDecorator<T extends Object>(target: T) {
    console.log(`Decorating ${target.constructor.name}`);
}

@myDecorator
class MyClass {
    /* ... */
}

// Output: Decorating MyClass
```

You can apply multiple decorators to the same class, property, or method.

```typescript
@decorator1
@decorator2
@decorator3
/* the class, property or method */
```

## Decorator Factories

A decorator factory is a way to pass parameters to a decorator.
It's a function that returns a decorator (another function).

```typescript
function myDecoratorFactory(/* decorator parameters */) {
    return function myDecorator(target: any, /* other info */) {
        /* do stuff */
    };
}
```

Usage:

```typescript
@myDecoratorFactory(/* decorator parameters */)
/* the class, property or method */
```

## Decorator Metadata
One of the primary use cases for decorators is to add metadata to a class, method, property, or parameter. This metadata can be used by other parts of the code to determine how to interact with the decorated element.

Typescript provides a way to access this metadata using the `Reflect` object. The `Reflect` object is available through a polyfill using the library `reflect-metadata`.

```typescript
import 'reflect-metadata';

function myDecorator(target: any) {
    Reflect.defineMetadata('myMetadata', 'myValue', target);
}

@myDecorator
class MyClass {
    /* ... */
}

const metadata = Reflect.getMetadata('myMetadata', MyClass);
```

## Types of Decorators

There are five types of decorators in Typescript:
- Class decorators
- Method decorators
- Accessor decorators
- Property decorators
- Parameter decorators

### Class decorators

Type Signature:
```typescript
/** @param {T} constructor the class constructor */
function classDecorator<T extends { new (...args: any[]): {} }>(constructor: T): void | T {
    /* do stuff with constructor */
    /* ... */

    /* eventually return a new constructor */
    // return class extends constructor {
    //     /* do stuff with the new constructor */
    // };
}
```

Usage:

```typescript
@classDecorator
class MyClass {
    /* ... */
}
```

Examples:
- [Class Sealing](src/class-decorators/class-sealing.ts): A class decorator that seals a class.
- [Class Registry](src/class-decorators/class-registry.ts): A class decorator that adds a class to a registry (a key-value map).
- [Class Reference Count](src/class-decorators/class-reference-count.ts): A class decorator that rewrites a class constructor to keep track of the number of instances created.
- [Class Metadata](src/class-decorators/class-metadata.ts): A class decorator that adds some metadata to a class that can be retrieved later.
- [Class Singleton](src/class-decorators/class-singleton.ts): A class decorator that makes a class a singleton.
- [Class Method Logging](src/class-decorators/class-method-logging.ts): A class decorator that logs every method call by wrapping them.

**Caveats**

- When re-writing a class (like in [Class Method Logging](src/class-decorators/class-method-logging.ts)), you need to be aware that the new class will have a different name and prototype than the original class.
- Take care of the typing: if you extend the original class, the new methods won't be visible in the type system.
- In the example [Class Registry](src/class-decorators/class-registry.ts), be aware that Tree-shaking may remove the class from the registry if it's not used anywhere else in the code. You may need to explicitly import the whole module in the entry file to prevent this.


### Method decorators
Type Signature:

```typescript
/** @param {T} target the class prototype */
/** @param {string} propertyKey the name of the method */
/** @param {PropertyDescriptor} descriptor the method descriptor */
function methodDecorator<T extends Object>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
    /* do stuff with target, propertyKey, and descriptor */
    /* ... */

    /* eventyally modify the descriptor */
    // descriptor.value = function () {
    //     /* do stuff with the original method */
    //     /* ... */
    // };
}
```

Usage:

```typescript
class MyClass {
    @methodDecorator
    myMethod() {
        /* ... */
    }
}
```

Examples:
- [Method Typecheck](src/method-decorators/method-typecheck.ts): A method decorator that type-checks the arguments and return value of a method.
- [Method Logging](src/method-decorators/method-safe.ts): A method decorator that wraps a method to catch and log errors that occur during its execution.
- [Method Timeout](src/method-decorators/method-timeout.ts): A method decorator that introduces a timeout to an async method.

### Accessor decorators
Signature:

```typescript
/** @param {T} target the class prototype */
/** @param {string} propertyKey the name of the accessor */
/** @param {PropertyDescriptor} descriptor the accessor descriptor */
function accessorDecorator<T extends Object>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
    /* do stuff with target, propertyKey, and descriptor */
    /* ... */

    /* eventyally modify the descriptor */
    // descriptor.get = function () {
    //     /* do stuff with the original getter */
    //     /* ... */
    // };
}
```

Usage:

```typescript
class MyClass {
    @accessorDecorator
    get myProperty() {
        /* ... */
    }
}
```

Examples:
- [Accessor Cache](src/accessor-decorators/accessor-cache.ts): An accessor decorator that caches the result of a getter. It also show how to invalidate the cache.
- [Accessor Descriptors](src/accessor-decorators/accessor-descriptors.ts): An accessor decorator that interacts with the property descriptor of a getter and changes its behavior. (i.e. making it read-only, enumerable, etc.)
- [Accessor Logging](src/accessor-decorators/accessor-logging.ts): An accessor decorator that logs the access to a getter.

### Property decorators
Signature:

```typescript
/** @param {T} target the class prototype */
/** @param {string} propertyKey the name of the property */
function propertyDecorator<T extends Object>(target: T, propertyKey: string) {
    /* do stuff with target and propertyKey */
    /* ... */
}
```

Usage:

```typescript
class MyClass {
    @propertyDecorator
    myProperty: string;
}
```

Examples:
- [Property Dependency Injection](src/property-decorators/property-dependency-injection.ts): A property decorator that injects a dependency into a property.
- [Property Metadata Typecheck](src/property-decorators/property-metadata-typecheck.ts): A property decorator that adds typing metadata to a property, then checks it using a function.
- [Property Angular-like Input](src/property-decorators/property-input.ts): A property decorator that creates an Angular-like input property.

**Pro Tip:**

The example [Property Metadata Typecheck](src/property-decorators/property-metadata-typecheck.ts) can be achieved with no code by setting the `emitDecoratorMetadata` option to `true` in the `tsconfig.json` file.

```json
{
    "compilerOptions": {
        "emitDecoratorMetadata": true
    }
}
```

**Caveats**
In the `Property Dependency Injection` example, may not work if you set the target to `ES2022` in the `tsconfig.json` file. You may need to set `useDefineForClassFields` to `false` to make it work.

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "useDefineForClassFields": false
    }
}
```

This is because the `useDefineForClassFields` option changes the way class fields are defined.

### Parameter decorators
Signature:

```typescript
/** @param {T} target the class prototype */
/** @param {string} propertyKey the name of the method */
/** @param {number} parameterIndex the index of the parameter */
function parameterDecorator<T extends Object>(target: T, propertyKey: string, parameterIndex: number) {
    /* do stuff with target, propertyKey, and parameterIndex */
    /* ... */
}
```

Usage:

```typescript
class MyClass {
    myMethod(@parameterDecorator myParameter: string) {
        /* ... */
    }
}
```

**Caveats**

Parameter decorators can't modify directly the behavior of a method. They can only be used to add metadata to a parameter.
You may need to use them in conjunction with other decorators to achieve the desired behavior. See the examples below.

Examples:
- [Parameter Validation](src/parameter-decorators/parameter-validation.ts): Parameter validation using parameter decorators.
- [Parameter Dependency Injection](src/parameter-decorators/parameter-dependency-injection.ts): Shows how to achieve an angular-like dependency injection using parameter decorators in the constructor.
- [Parameter Transformation](src/parameter-decorators/parameter-transformation.ts): Shows how to transform or sanitize parameters using parameter decorators.
- [Parameter Can't Modify Methods](src/parameter-decorators/parameter-cant-modify-methods.ts): Shows that parameter decorators can't modify the behavior of a method directly.

## Functional Javascript and Decorators
Unfortunately Typescript decorators unfortunately don't support decorating a function directly.

```typescript
function myDecorator() {
    /* ... */
}

// This won't work
@myDecorator
function myFunction() {

}
```

However, you can achieve similar functionality by using higher-order functions.

```typescript
function myDecorator(fn: Function) {
    return function (...args: any[]) {
        /* do stuff before calling the function */
        /* ... */

        const result = fn(...args);

        /* do stuff after calling the function */
        /* ... */

        return result;
    };
}

const myFunction = myDecorator(function () {
    /* ... */
});
```

Examples:
- [Function decorator](src/function-decorators/function-decorator.ts): Shows how to achieve similar functionality to a function decorator using higher-order functions.
- [Function fancier decorator](src/function-decorators/function-fancier-decorator.ts): Shows a pattern that helps achieving more complex functionality by introducing a `decorate` function.

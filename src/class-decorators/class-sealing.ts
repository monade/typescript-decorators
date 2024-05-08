
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@sealed
class Cat {
    constructor(public name: string) {}
}

new Cat("Whiskers");

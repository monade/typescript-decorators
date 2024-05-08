
function timeout(milliseconds: number) {
    return function(target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function(...args: any[]) {
            return Promise.race([
                originalMethod.apply(this, args),
                new Promise((_, reject) => {
                    setTimeout(() => {
                        reject(new Error('Timeout error'));
                    }, milliseconds);
                })
            ]);
        };

        return descriptor;
    }
}


class SomeService {
    constructor() {}

    @timeout(1000)
    async doSlowlySomethingAsync() {
        return new Promise<string>((resolve) => {
            setTimeout(() => {
                resolve("done slowly!");
            }, 3000);
        });
    }

    @timeout(1000)
    async doSomethingAsync() {
        return new Promise<string>((resolve) => {
            setTimeout(() => {
                resolve("done fast!");
            }, 200);
        });
    }

}

const sampleService = new SomeService();

sampleService.doSomethingAsync().then(console.log).catch(console.error);
sampleService.doSlowlySomethingAsync().then(console.log).catch(console.error);

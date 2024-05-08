import 'reflect-metadata';

class DependencyContainer {
    private static dependencies = new Map<string, any>();

    static register(token: string, value: any) {
        this.dependencies.set(token, new value());
    }

    static resolve<T>(token: string): T {
        return this.dependencies.get(token);
    }
}

class MyService {
    doStuff() {
        console.log('Doing stuff with MyService...');
    }
}

function dependencyInjection<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            const metadata = Reflect.getOwnMetadata('dependencyInjection', constructor) ?? [];

            for (const { index, token } of metadata) {
                args[index] = DependencyContainer.resolve(token);
            }

            super(...args);
        }
    }
}

function inject(token: string) {
    return function(target: any, key: any, index: number) {
        const metadata = Reflect.getOwnMetadata('dependencyInjection', target) ?? [];

        metadata.push({
            index,
            token
        });
        Reflect.defineMetadata('dependencyInjection', metadata, target);
    }
}


@dependencyInjection
class Injection {
    constructor(@inject('MyService') private myService: MyService) {}

    doStuff() {
        this.myService.doStuff();
    }
}

DependencyContainer.register('MyService', MyService);
DependencyContainer.register('Injection', Injection);

const injection = DependencyContainer.resolve<Injection>('Injection');

injection.doStuff();


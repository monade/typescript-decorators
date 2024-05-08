import 'reflect-metadata';

interface Sanitization {
    index: number;
    sanitizer: (parameter: any) => any;
}

const sanitizationsMetadataKey = Symbol('parameter:sanitization');

function sanitized(target: Function) {
    const properties = Object.getOwnPropertyNames(target.prototype);

    for (const propertyName of properties) {
        const originalMethod = target.prototype[propertyName];
        if (propertyName === 'constructor' || typeof originalMethod !== 'function') {
            continue;
        }

        const metadata = Reflect.getOwnMetadata(sanitizationsMetadataKey, target.prototype, propertyName) as Sanitization[];

        if (!metadata) {
            continue;
        }

        target.prototype[propertyName] = function(...args: any[]) {
            for (const { index, sanitizer } of metadata) {
                args[index] = sanitizer(args[index]);
            }

            return originalMethod.apply(this, args);
        }
    }
}


function lowercase(target: any, key: string, index: number) {
    const sanitizers: Sanitization[] = Reflect.getOwnMetadata(sanitizationsMetadataKey, target, key) ?? [];

    sanitizers.push({
        index,
        sanitizer: (parameter: string) => {
            return parameter.toLowerCase();
        }
    });

    Reflect.defineMetadata(sanitizationsMetadataKey, sanitizers, target, key);
}

function trim(target: any, key: string, index: number) {
    const sanitizers: Sanitization[] = Reflect.getOwnMetadata(sanitizationsMetadataKey, target, key) ?? [];

    sanitizers.push({
        index,
        sanitizer: (parameter: string) => {
            return parameter.trim();
        }
    });

    Reflect.defineMetadata(sanitizationsMetadataKey, sanitizers, target, key);
}

function encrypt(target: any, key: string, index: number) {
    const sanitizers: Sanitization[] = Reflect.getOwnMetadata(sanitizationsMetadataKey, target, key) ?? [];

    sanitizers.push({
        index,
        sanitizer: (parameter: string) => {
            return `***${parameter}***`;
        }
    });

    Reflect.defineMetadata(sanitizationsMetadataKey, sanitizers, target, key);
}

@sanitized
class Registration {
    setEmail(@lowercase @trim email: string) {
        console.log(email);
    }

    // WATCH OUT FOR THE ORDER OF DECORATORS
    // Rightmost is the first to be executed
    // So first trim, then encrypt
    setPassword(@encrypt @trim password: string) {
        console.log(password);
    }
}

const registration = new Registration();

registration.setEmail('            PIERO@MoNaDe.io\t');
registration.setPassword('  password123 ');

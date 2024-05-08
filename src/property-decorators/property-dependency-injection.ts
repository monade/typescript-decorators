const CONFIG = {
    'SERVER_URL': 'https://jsonplaceholder.typicode.com',
}

function Config(key: keyof typeof CONFIG) {
    return function(target: any, propertyKey: string) {
        Object.defineProperty(target, propertyKey, {
            configurable: true,
            enumerable: true,
            get() {
                return CONFIG[key];
            }
        });
    }
}

// OCCHIO: non funziona se come target metti ES2022 o se useDefineForClassFields è true
class TodoService {
    @Config("SERVER_URL") url!: string;
    
    getUsers() {
        return fetch(this.url + '/users');
    }
}

const todoService = new TodoService();
todoService.getUsers().then(response => response.json()).then(console.log);

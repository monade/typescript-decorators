
function enumerable(value: boolean) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}

function configurable(value: boolean) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = value;
  };
}

class User {

  constructor(public firstName: string, public lastName: string) {}

  @enumerable(false)
  @configurable(false)
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}


const user = new User("John", "Doe");

for (const key in user) {
  console.log(key);
}

console.log(user.fullName);

Object.defineProperty(User.prototype, "fullName", {
  value: 'test',
});

import "reflect-metadata";

function Input(target: Object, propertyKey: string) {
  Reflect.defineMetadata("component:type", "input", target, propertyKey);
}

class UserComponent {
  @Input name: string = "John Doe";
}

function instantiateComponent<T>(
  component: new () => T,
  inputs: Record<string, any>
): T {
  const instance = new component();

  for (const key in inputs) {
    const isInput =
      Reflect.getMetadata("component:type", instance as Object, key) === "input";
    if (isInput) {
      Object.assign(instance as any, { [key]: inputs[key] });
    }
  }

  return instance;
}

// <UserComponent name="Alice" />
const component = instantiateComponent(UserComponent, {
  name: "Alice",
});

console.log(component);

function decorate(decorators: Function[], target: Function) {
  return decorators.reduceRight((t, decorator) => decorator(t), target);
}

function $trace(target: Function) {
  const newTarget = function(...args: any[]) {
    console.log(`Calling ${target.name} with arguments`, ...args);
    const result = target(...args);
    console.log(`Called ${target.name}, the result is`, result);
    return result;
  }
  // Copy the name of the original function
  Object.defineProperty(newTarget, 'name', { value: target.name });
  return newTarget;
}

function $validate(...args: any[]) {
  const [output, ...inputs] = [...args].reverse();
  return function(target: Function) {
    const newTarget = function(...params: any[]) {
      for (let i = 0; i < inputs.length; i++) {
        if (typeof params[i] !== args[i]) {
          console.error(`Param ${i} is not of type ${args[i]}`);
        }
      }
      const result = target(...params);
      if (typeof result !== output) {
        console.error(`Return value is not of type ${output}`);
      }
      return result;
    }
  // Copy the name of the original function
    Object.defineProperty(newTarget, 'name', { value: target.name });
    return newTarget;
  }
}

/**
 * This is an example of a decorated function without using the `@` syntax.
 */
const firstCharacter = decorate(
  [
    $trace,
    $validate('string', 'number')
  ],
  function firstCharacter(value: string): number {
    return +value;
  }
);

console.log('The output is', firstCharacter('123')); // This passes validation and logs the call

console.log("-----")
console.log('The output is', firstCharacter(123 as any)); // This fails validation

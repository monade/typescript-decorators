
function trace(target: Function) {
  return function(...args: any[]) {
    console.log(`Calling ${target.name} with`, args);
    const result = target(...args);
    console.log(`Result is`, result);
    return result;
  }
}


const doStuff = trace(function doStuff() {
  console.log('Doing stuff...');
});


type Context =
    | ClassAccessorDecoratorContext
    | ClassGetterDecoratorContext
    | ClassFieldDecoratorContext
    ;

const metadataKey = Symbol("class:metadata");

function ClassMetadata(data: any) {
    return function (_: Function, context: Context): any {
        context.metadata[metadataKey] = data;
    };
}

// This will eventually work in ES2022
// @ClassMetadata({ table: "users", primaryKey: "id" })
// class SomeUser {
//     constructor(public name: string) {}
// }

// console.log(SomeUser[Symbol.metadata]?.[metadataKey]); // { table: 'users', primaryKey: 'id' }

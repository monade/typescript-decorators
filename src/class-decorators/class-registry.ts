interface IParser {
    parse(data: string): any;
}

const PARSERS: Map<string, new () => IParser> = new Map();

function parserFor(name: string) {
    return function(constructor: new () => IParser) {
        PARSERS.set(name, constructor);
    }
}

@parserFor('json')
class JSONParser implements IParser {
    parse(data: string) {
        return JSON.parse(data);
    }
}

@parserFor('csv')
class CsvParser implements IParser {
    parse(data: string) {
        return data.split(',');
    }
}

@parserFor('tsv')
class TsvParser implements IParser {
    parse(data: string) {
        return data.split('\t');
    }
}

function getParser(type: string): IParser {
    const Parser = PARSERS.get(type);
    if (!Parser) {
        throw new Error(`Unknown parser: ${type}`);
    }
    return new Parser();
}

console.log(getParser('json').parse('{"foo": "bar"}'));
console.log(getParser('csv').parse('foo,bar,baz'));
console.log(getParser('tsv').parse('foo\tbar\tbaz'));
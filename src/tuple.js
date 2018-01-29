import { UniversalWeakMap } from "./universal-weak-map.js";
const root = new UniversalWeakMap;

export function tuple(...items) {
  return Tuple.intern(items);
}

export class Tuple {
  constructor(...items) {
    return Tuple.intern(items, this);
  }

  static intern(array, tuple) {
    let node = root;

    array.forEach(item => {
      node = node.get(item) || node.set(item, new UniversalWeakMap);
    });

    if (node.tuple) {
      return node.tuple;
    }

    tuple = tuple || Object.create(Tuple.prototype);

    array.forEach((item, i) => def(tuple, i, item, true));
    def(tuple, "length", array.length, false);

    return node.tuple = tuple;
  }

  static from(iterable) {
    return Tuple.intern([...iterable]);
  }
}

function def(obj, name, value, enumerable) {
  Object.defineProperty(obj, name, {
    value: value,
    enumerable: !! enumerable,
    writable: false,
    configurable: false
  });
}

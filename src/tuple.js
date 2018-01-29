import { UniversalWeakMap } from "./universal-weak-map.js";
import { brand, arrayMethods } from "./util.js";

const root = new UniversalWeakMap;
const { concat } = Array.prototype;
const reusableTempArray = [];

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

  static isTuple(that) {
    return that[brand] === true;
  }

  // Turn this Tuple into an ordinary array, optionally reusing an
  // existing array.
  toArray(array = []) {
    const { length } = this;
    for (let i = 0; i < length; ++i) {
      const item = this[i];
      array[i] = Tuple.isTuple(item) ? item.toArray() : item;
    }
    array.length = length;
    return array;
  }

  concat(...args) {
    return Tuple.intern(concat.apply(
      this.toArray(reusableTempArray),
      args.map(item => Tuple.isTuple(item) ? item.toArray() : item)
    ));
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

def(Tuple.prototype, brand, true, false);

arrayMethods.forEach(name => {
  const desc = Object.getOwnPropertyDescriptor(Array.prototype, name);
  const method = desc && desc.value;
  if (typeof method === "function") {
    desc.value = function (...args) {
      const result = method.apply(this.toArray(reusableTempArray), args);
      return Array.isArray(result) ? Tuple.intern(result) : result;
    };
    Object.defineProperty(Tuple.prototype, name, desc);
  }
});

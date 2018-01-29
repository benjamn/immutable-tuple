import { UniversalWeakMap } from "./universal-weak-map.js";
import {
  brand,
  globalKey,
  forEachArrayMethod,
} from "./util.js";

// If this package is installed multiple times, there could be mutiple
// implementations of the tuple function with distinct tuple.prototype
// objects, but the shared pool of tuple objects must be the same across
// all implementations.
const root = globalKey in Array
  ? Array[globalKey]
  : def(Array, globalKey, new UniversalWeakMap, false);

export default function tuple(...items) {
  return intern(items);
}

// Make named imports work as well as default imports.
export { tuple };

function intern(array) {
  let node = root;

  array.forEach(item => {
    node = node.get(item) || node.set(item, new UniversalWeakMap);
  });

  if (node.tuple) {
    return node.tuple;
  }

  const t = Object.create(tuple.prototype);

  array.forEach((item, i) => def(t, i, item, true));
  def(t, "length", array.length, false);

  return node.tuple = t;
}

function def(obj, name, value, enumerable) {
  Object.defineProperty(obj, name, {
    value: value,
    enumerable: !! enumerable,
    writable: false,
    configurable: false
  });
  return value;
}

function isTuple(that) {
  return !! (that && that[brand] === true);
}

def(tuple.prototype, brand, true, false);

tuple.isTuple = isTuple;

// Like Array.prototype.concat, except that extra effort is required to
// convert any tuple arguments to arrays, so that Array.prototype.concat
// will do the right thing.
const { concat } = Array.prototype;
tuple.prototype.concat = function (...args) {
  return intern(concat.apply(toArray(this), args.map(
    item => isTuple(item) ? toArray(item) : item
  )));
};

function toArray(tuple) {
  const array = [];
  let i = tuple.length;
  while (i--) array[i] = tuple[i];
  return array;
}

forEachArrayMethod((name, desc, mustConvertThisToArray) => {
  const method = desc && desc.value;
  if (typeof method === "function") {
    desc.value = function (...args) {
      const result = method.apply(
        mustConvertThisToArray ? toArray(this) : this,
        args
      );
      return Array.isArray(result) ? intern(result) : result;
    };
    Object.defineProperty(tuple.prototype, name, desc);
  }
});

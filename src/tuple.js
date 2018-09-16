// See [`universal-weak-map.js`](universal-weak-map.html).
import { UniversalWeakMap } from "./universal-weak-map.js";

// See [`util.js`](util.html).
import {
  brand,
  globalKey,
  forEachArrayMethod,
} from "./util.js";

// If this package is installed multiple times, there could be mutiple
// implementations of the `tuple` function with distinct `tuple.prototype`
// objects, but the shared pool of `tuple` objects must be the same across
// all implementations. While it would be ideal to use the `global`
// object, there's no reliable way to get the global object across all JS
// environments without using the `Function` constructor, so instead we
// use the global `Array` constructor as a shared namespace.
const root = Array[globalKey] || def(Array, globalKey, new UniversalWeakMap, false);

// When called with any number of arguments, this function returns an
// object that inherits from `tuple.prototype` and is guaranteed to be
// `===` any other `tuple` object that has exactly the same items. In
// computer science jargon, `tuple` instances are "internalized" or just
// "interned," which allows for constant-time equality checking, and makes
// it possible for tuple objects to be used as `Map` or `WeakMap` keys, or
// stored in a `Set`.
export default function tuple() {
  let node = root;

  // Because we are building a tree of *weak* maps, the tree will not
  // prevent objects in tuples from being garbage collected, since the
  // tree itself will be pruned over time when the corresponding `tuple`
  // objects become unreachable. In addition to internalization, this
  // property is a key advantage of the `immutable-tuple` package.
  const argc = arguments.length;
  for (let i = 0; i < argc; ++i) {
    const item = arguments[i];
    node = node.get(item) || node.set(item, new UniversalWeakMap);
  }

  // If a `tuple` object has already been created for exactly these items,
  // return that object again.
  if (node.tuple) {
    return node.tuple;
  }

  const t = Object.create(tuple.prototype);

  // Define immutable items with numeric indexes, and permanently fix the
  // `.length` property.
  for (let i = 0; i < argc; ++i) {
    def(t, i, arguments[i], true);
  }
  def(t, "length", argc, false);

  // Remember this new `tuple` object so that we can return the same object
  // earlier next time.
  return node.tuple = t;
}

// Named imports work as well as `default` imports.
export { tuple };

// Convenient helper for defining hidden immutable properties.
function def(obj, name, value, enumerable) {
  Object.defineProperty(obj, name, {
    value: value,
    enumerable: !! enumerable,
    writable: false,
    configurable: false
  });
  return value;
}

// Since the `immutable-tuple` package could be installed multiple times
// in an application, there is no guarantee that the `tuple` constructor
// or `tuple.prototype` will be unique, so `value instanceof tuple` is
// unreliable. Instead, to test if a value is a tuple, you should use
// `tuple.isTuple(value)`.
function isTuple(that) {
  return !! (that && that[brand] === true);
}

def(tuple.prototype, brand, true, false);

tuple.isTuple = isTuple;

function toArray(tuple) {
  const array = [];
  let i = tuple.length;
  while (i--) array[i] = tuple[i];
  return array;
}

// Copy all generic non-destructive Array methods to `tuple.prototype`.
// This works because (for example) `Array.prototype.slice` can be invoked
// against any `Array`-like object.
forEachArrayMethod((name, desc, mustConvertThisToArray) => {
  const method = desc && desc.value;
  if (typeof method === "function") {
    desc.value = function (...args) {
      const result = method.apply(
        mustConvertThisToArray ? toArray(this) : this,
        args
      );
      // Of course, `tuple.prototype.slice` should return a `tuple` object,
      // not a new `Array`.
      return Array.isArray(result) ? tuple(...result) : result;
    };
    Object.defineProperty(tuple.prototype, name, desc);
  }
});

// Like `Array.prototype.concat`, except for the extra effort required to
// convert any tuple arguments to arrays, so that
// ```
// tuple(1).concat(tuple(2), 3) === tuple(1, 2, 3)
// ```
const { concat } = Array.prototype;
tuple.prototype.concat = function (...args) {
  return tuple(...concat.apply(toArray(this), args.map(
    item => isTuple(item) ? toArray(item) : item
  )));
};

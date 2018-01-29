// Although `Symbol` is widely supported these days, we can safely fall
// back to using a non-enumerable string property without violating any
// assumptions elsewhere in the implementation.
const useSymbol = typeof Symbol === "function";

// Used to mark `tuple.prototype` so that all objects that inherit from
// any `tuple.prototype` object (there could be more than one) will test
// positive according to `tuple.isTuple`.
export const brand = useSymbol
  ? Symbol.for("immutable-tuple")
  : "@@__IMMUTABLE_TUPLE__@@";

// Used to save a reference to the globally shared `UniversalWeakMap` that
// stores all known `tuple` objects.
export const globalKey = useSymbol
  ? Symbol.for("immutable-tuple-root")
  : "@@__IMMUTABLE_TUPLE_ROOT__@@";

// The `mustConvertThisToArray` value is true when the corresponding
// `Array` method does not attempt to modify `this`, which means we can
// pass a `tuple` object as `this` without first converting it to an
// `Array`.
export function forEachArrayMethod(fn) {
  function call(name, mustConvertThisToArray) {
    const desc = Object.getOwnPropertyDescriptor(Array.prototype, name);
    fn(name, desc, !! mustConvertThisToArray);
  }
  call("slice");
  call("includes");
  call("indexOf");
  call("forEach");
  call("filter");
  call("map");
  call("every");
  call("some");
  call("reduce");
  call("reduceRight");
  call("toString");
  call("toLocaleString");
  call("join");
  // The `reverse` and `sort` methods are usually destructive, but for
  // `tuple` objects they return a new `tuple` object that has been
  // appropriately reversed/sorted.
  call("reverse", true);
  call("sort", true);
  call("lastIndexOf");
  call("find");
  call("findIndex");
  // Make `[...someTuple]` work.
  call(useSymbol && Symbol.iterator || "@@iterator");
}

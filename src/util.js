const useSymbol = typeof Symbol === "function";

export const brand = useSymbol
  ? Symbol.for("immutable-tuple")
  : "@@__IMMUTABLE_TUPLE__@@";

export const globalKey = useSymbol
  ? Symbol.for("immutable-tuple-root")
  : "@@__IMMUTABLE_TUPLE_ROOT__@@";

// The mustConvertThisToArray value is true if the corresponding Array
// method will not attempt to modify `this`, which means we can pass a
// Tuple object as `this` without first converting it to an Array.
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
  call("reverse", true);
  call("sort", true);
  call("lastIndexOf");
  call("find");
  call("findIndex");
  call(useSymbol && Symbol.iterator || "@@iterator");
}

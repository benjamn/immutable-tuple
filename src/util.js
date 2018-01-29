const useSymbol = typeof Symbol === "function";

export const brand = useSymbol
  ? Symbol.for("immutable-tuple")
  : "@@__IMMUTABLE_TUPLE__@@";

export const arrayMethods = [
  "slice",
  "includes",
  "indexOf",
  "forEach",
  "filter",
  "map",
  "every",
  "some",
  "reduce",
  "reduceRight",
  "toString",
  "toLocaleString",
  "join",
  "reverse",
  "sort",
  "lastIndexOf",
  "find",
  "findIndex",
  useSymbol && Symbol.iterator || "@@iterator",
];

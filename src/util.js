const useSymbol = typeof Symbol === "function";
export const brand = useSymbol
  ? Symbol.for("immutable-tuple")
  : "@@__IMMUTABLE_TUPLE__@@";


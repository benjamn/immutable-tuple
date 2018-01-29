import path from "path";
import buble from "rollup-plugin-buble";

const SRC_DIR = path.resolve("../src");
const DIST_DIR = path.resolve(SRC_DIR, "../dist");

export default {
  sourcemap: false,
  input: path.join(SRC_DIR, "tuple.js"),
  output: {
    exports: "named",
    file: path.join(DIST_DIR, "tuple.mjs"),
    format: "es"
  },
  plugins: [
    buble(),
  ]
};

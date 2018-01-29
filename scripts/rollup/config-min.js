import path from "path";
import buble from "rollup-plugin-buble";
import uglify from "rollup-plugin-uglify";

const SRC_DIR = path.resolve("../src");
const DIST_DIR = path.resolve(SRC_DIR, "../dist");

export default {
  sourcemap: false,
  input: path.join(SRC_DIR, "tuple.js"),
  output: {
    exports: "named",
    file: path.join(DIST_DIR, "tuple.min.js"),
    format: "cjs"
  },
  plugins: [
    buble(),
    uglify({
      mangle: {
        toplevel: true,
        reserved: ["Tuple", "tuple"]
      }
    }),
  ]
};

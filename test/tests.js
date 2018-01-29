import assert from "assert";
import { Tuple, tuple } from "../dist/tuple.js";

describe("Tuple basics", function () {
  it("should be defined and importable", function () {
    assert.strictEqual(typeof Tuple, "function");
    assert.strictEqual(typeof tuple, "function");
  });

  it("should support === deep equality", function () {
    assert.strictEqual(tuple(1,2,3), new Tuple(1,2,3));
  });
});

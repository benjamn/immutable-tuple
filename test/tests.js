import assert from "assert";
import { Tuple, tuple } from "../src/tuple.js";

describe("Tuple basics", function () {
  it("should be defined and importable", function () {
    assert.strictEqual(typeof Tuple, "function");
    assert.strictEqual(typeof tuple, "function");
  });
});

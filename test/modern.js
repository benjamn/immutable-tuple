import assert from "assert";
import tuple from "../dist/tuple.js";

it("includes", function () {
  const t = tuple(1, "asdf", true);
  assert.strictEqual(t.includes("asdf"), true);
  assert.strictEqual(t.includes(false), false);
});

it("Symbol.iterator", function () {
  assert.deepEqual(
    [2, 4, 6, 8],
    [...tuple(1, 2, 3, 4, 5, 6, 7, 8, 9).filter(x => x % 2 === 0)]
  );

  const [a, b, c, ...rest] = tuple(1, 2, 3, 4, 5);
  assert.strictEqual(a, 1);
  assert.strictEqual(b, 2);
  assert.strictEqual(c, 3);
  assert.deepEqual(rest, [4, 5]);
});

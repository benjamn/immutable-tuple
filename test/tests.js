"use strict";

import assert from "assert";
import tuple from "../dist/tuple.js";
import esTuple from "../dist/tuple.mjs";

describe("tuple basics", function () {
  it("should be defined and importable", function () {
    assert.strictEqual(typeof tuple, "function");
  });

  it("should support === deep equality", function () {
    assert.strictEqual(tuple(1,2,3), tuple(1,2,3));
  });

  it("should support tuple.isTuple", function () {
    assert.strictEqual(tuple.isTuple(tuple()), true);
    assert.strictEqual(tuple.isTuple(tuple.prototype), true);
    assert.strictEqual(tuple.isTuple(tuple("asdf", {})), true);
    assert.strictEqual(tuple.isTuple(null), false);
  });

  it("should tolerate multiple package copies", function () {
    assert.notStrictEqual(tuple, esTuple);
    assert.notStrictEqual(tuple.prototype, esTuple.prototype);

    assert.strictEqual(tuple.isTuple(esTuple(1,2,3)), true);
    assert.strictEqual(esTuple.isTuple(tuple(1,2,3)), true);

    assert.strictEqual(
      tuple("I","am","tuple"),
      esTuple("tuple","am","I").reverse()
    );
  });

  it("should be usable as Map keys", function () {
    const map = new Map;

    assert.strictEqual(map.has(tuple(1, tuple(2, "buckle"), true)), false);
    map.set(tuple(1, tuple(2, "buckle"), true), "oh my");
    assert.strictEqual(map.has(tuple(1, tuple(2, "buckle"), true)), true);
    assert.strictEqual(map.get(tuple(1, tuple(2, "buckle"), true)), "oh my");

    map.forEach(function (value, key) {
      assert.strictEqual(key, tuple(1, tuple(2, "buckle"), true));
      assert.strictEqual(value, "oh my");
    });

    map.delete(tuple(1, tuple(2, "buckle"), true));
    map.forEach(function () {
      throw new Error("unreached");
    });
  });

  it("should be storable in a Set", function () {
    const set = new Set([
      tuple(1, 2, tuple(3, 4), 5),
      tuple(1, 2, tuple(3, 4), 5),
    ]);

    assert.strictEqual(set.size, 1);
  });
});

describe("Array methods", function () {
  it("concat", function () {
    assert.strictEqual(
      tuple(1,2,3).concat(4, tuple(5,6), 7),
      tuple(1,2,3,4,5,6,7)
    );
  });

  it("slice", function () {
    assert.strictEqual(
      tuple(1,2,3,4,5).slice(2, 4),
      tuple(3,4)
    );

    assert.strictEqual(
      tuple(1,2,3,4,5).slice(-3),
      tuple(3,4,5)
    );
  });

  it("indexOf and lastIndexOf", function () {
    const t = tuple(1, 1, 2, 3, 5, 8, 13);
    assert.strictEqual(t.indexOf(1), 0)
    assert.strictEqual(t.lastIndexOf(1), 1)
    assert.strictEqual(t.indexOf(4), -1)
    assert.strictEqual(t.lastIndexOf(7), -1)
  });

  it("forEach", function () {
    const t = tuple("a", "b", "c", "d");
    const output = {};
    t.forEach(function (item, i, obj) {
      output[item] = i;
      assert.strictEqual(obj, t);
    });
    assert.deepEqual(output, {
      a: 0,
      b: 1,
      c: 2,
      d: 3
    });
  });

  it("filter", function () {
    assert.strictEqual(
      tuple(1,2,3,4,5,6,7,8,9).filter(x => x % 2),
      tuple(1,3,5,7,9)
    );
  });

  it("map", function () {
    assert.strictEqual(
      tuple(1,2,3,4).map(x => x + 1),
      tuple(2,3,4,5)
    );
  });

  it("every", function () {
    assert.strictEqual(tuple(2,4,6,8).every(x => x % 2 === 0), true);
    assert.strictEqual(tuple(2,4,6,7).every(x => x % 2 === 0), false);
  });

  it("some", function () {
    assert.strictEqual(tuple(1,2,3,4).some(x => x === 3), true);
    assert.strictEqual(tuple(1,2,3,4).some(x => x > 5), false);
  });

  it("reduce", function () {
    assert.strictEqual(
      tuple(1,2,3,4,5).reduce((x, sum) => x + sum, 0),
      15
    );
  });

  it("reduceRight", function () {
    assert.strictEqual(
      [tuple(0, 1), tuple(2, 3), tuple(4, 5)].reduceRight(
        (previous, current) => previous.concat(current)),
      tuple(4, 5, 2, 3, 0, 1)
    );
  });

  it("toString", function () {
    assert.strictEqual(
      String(tuple(1,2,3)),
      [1,2,3].toString()
    );
  });

  it("join", function () {
    assert.strictEqual(tuple(1,2,3).join("|"), "1|2|3");
  });

  it("reverse", function () {
    assert.strictEqual(
      tuple(1,2,3).reverse(),
      tuple(3,2,1)
    );
  });

  it("sort", function () {
    assert.strictEqual(
      tuple(4,2,7,6,9,3,1,0,3,2,7).sort(),
      tuple(0,1,2,2,3,3,4,6,7,7,9)
    );
  });

  it("find", function () {
    assert.deepEqual(
      tuple({
        foo: 1
      }, {
        bar: 2
      }, {
        baz: 3
      }, {
        qux: 4
      }).find(obj => {
        return Object.keys(obj).some(key => {
          return key.length === obj[key];
        });
      }),
      { baz: 3 }
    );
  });

  it("findIndex", function () {
    assert.deepEqual(
      tuple({
        foo: 1
      }, {
        bar: 2
      }, {
        baz: 3
      }, {
        qux: 4
      }).findIndex(obj => {
        return Object.keys(obj).some(key => {
          return key.length === obj[key];
        });
      }),
      2
    );
  });

  if (parseInt(process.versions.node, 10) >= 6) {
    require("./modern.js");
  }
});

describe("performance", function () {
  this.timeout(10000);
  const tupleCount = 100000;
  const elemCount = 10;

  it("can handle a lot of strings", function () {
    for (var i = 0; i < tupleCount; ++i) {
      const elems = [];
      for (var j = 0; j < elemCount; ++j) {
        elems.push(Math.random().toString(36).slice(2));
      }
      assert.deepEqual(tuple.apply(null, elems), elems);
    }
  });
});

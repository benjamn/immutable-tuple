# immutable-tuple [![Build Status](https://travis-ci.org/benjamn/immutable-tuple.svg?branch=master)](https://travis-ci.org/benjamn/immutable-tuple)

Immutable finite list objects with constant-time equality testing (`===`) and no memory leaks.

## Usage

First install the package from npm:

```sh
npm install immutable-tuple
```

or clone it from GitHub and then run `npm install` to compile the source code:

```sh
git clone https://github.com/benjamn/immutable-tuple.git
cd immutable-tuple
npm install
npm test # if skeptical
```

The npm package exports a single function called `tuple`, both as a `default` export and as an equivalent named export, so all of the following import styles will work:

```js
import tuple from "immutable-tuple";
import { tuple } from "immutable-tuple";
const { tuple } = require("immutable-tuple");
const tuple = require("immutable-tuple").tuple;

// Note that this style will *not* work:
const tuple = require("immutable-tuple");
```

The `tuple` function takes any number of arguments, and returns a unique, immutable object that inherits from `tuple.prototype` and is guaranteed to be `===` any other `tuple` object created from the same sequence of arguments:

```js
const obj = { asdf: 1234 };
const t1 = tuple(1, "asdf", obj);
const t2 = tuple(1, "asdf", obj);
assert(t1 === t2);

assert.strictEqual(
  tuple(t1, t2),
  tuple(t2, t1)
);
```

Because `tuple` objects are identical when (and only when) their elements are identical, any two tuples can be compared for equality in constant time, regardless of how many elements they contain.

The `tuple` object has a fixed numeric `.length` property, and its elements may be accessed using array index notation:

```js
assert.strictEqual(t1.length, 3);
t1.forEach((x, i) => assert.strictEqual(x, t2[i]));
```

Every non-destructive method of `Array.prototype` is also supported by `tuple.prototype`, including `sort` and `reverse`, which return a modified copy of the `tuple` without altering the original:

```js
assert.strictEqual(
  tuple(6, 2, 8, 1, 3, 0).sort(),
  tuple(0, 1, 2, 3, 6, 8)
);

assert.strictEqual(
  tuple(1).concat(2, tuple(3, 4), 5),
  tuple(1, 2, 3, 4, 5)
);
```

While the identity, number, and order of elements in the `tuple` is fixed, please note that the contents of the individual elements are not frozen in any way:

```js
const obj = { asdf: 1234 };
tuple(1, "asdf", obj)[2].asdf = "oyez";
assert.strictEqual(obj.asdf, "oyez");
```

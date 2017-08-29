---
title: "Practical Patterns for Redux Reducers with Ramda"
date: "2017-08-26"
path: /blog/practical-redux-ramda
tags: ramda, redux
layout: post
---

In [Redux], changes to your state are computed immutably, meaning that you
never actually change any data, you compute new state based on the existing
state and an action object describing a change to the state. There are several
ways to accomplish this in JavaScript. The two most popular I see on a regular
basis are libraries such as [Immutable.js], which expose an imperative-style
API, or plain ES2015/2017 operators such as the [spread operator].

There's another way. Functional programming using libraries like [Ramda] or
[`lodash/fp`]. Functional programming is often dismissed as too academic or
even confusing. Today I intend to show common patterns you can use with [Ramda]
in your [Redux] reducers in order to demonstrate that there is no need to fear
functional programming and in many cases it can actually be simpler than
imperative programming (especially when it comes to updating immutable data).

## Foundational Concepts

Before we dive into the practical examples, I want to make sure you understand
two concepts in functional programming as they are foundational to working in
[Ramda]. Those concepts are partial application and currying.

### Partial Application

Partially applying a function essentially means creating a version of that
function with some arguments predefined. Practically, with [Ramda] you might do
something like the following:

```js
import { partial } from 'ramda';

const logWithContext = (context, message) => console.log(`[${context}] ${message}`);
const logRequest = partial(logWithContext, ['request']);

logRequest('Foo'); // logs "[request] Foo"
```

In that example the `context` parameter is said to be partially applied.
Calling `logRequest` will call `logWithContext` with `'request'` as the first
argument. Any remaining arguments passed to `logRequest` will be passed to
`logWithContext` after `'request'`.

### Currying

Almost all of the functions exported by [Ramda] are curried. When a function is
curried that means you can pass fewer arguments than it expects to take and it
will simply return a partially applied version of itself that you can call with
any remaining arguments. Practically, consider the following example:

```js
import { add } from 'ramda';

add(1, 1); // 2

const addOne = add(1); // (n) => 1 + n
addOne(2); // 3
```

`add` is a function which accepts two arguments and returns the result of
adding them together. Notice, however, that we can simply pass in one argument
and get a partially applied function which we can call with an additional
argument later. That is what currying is.

## Practical Patterns for Redux Reducers

With that out of the way, let's go over some practical examples of how you can
use [Ramda] in your [Redux] reducers.

### Setting a Value on an Object

### Setting a Nested Value on an Object

### Appending and Prepending to an Array

### Inserting into an Array

### Updating an Item in an Array

In this case, we not only need to update the item, but we need a new array to
contain that item and all of the other items. The easiest way to do this is
with `map`. We simply need to write our mapping function to return...

### Modifying an Array on a Property

This should feel like a very natural extension. We didn't need to do too much
extra, we simply needed to focus on what we wanted to modify using a lens.

### Updating Many Properties All at Once

[Immutable.js] has a function called...

Evolve basically lets you focus operations onto several properties of an object
all at once. You can even recursively nest operations to update nested data
structures.

## Dealing with Bloat

I wrote about...

## Conclusion

[Ramda] gives you a simple way to expressively update state without mutating
your data. Logic becomes declarative. State is stored in plain JavaScript
objects and arrays.

[Immutable.js]: https://facebook.github.io/immutable-js/ "Immutable.js"
[Ramda]: http://ramdajs.com/ "Ramda"
[Redux]: http://redux.js.org/ "Redux"
[`lodash/fp`]: https://github.com/lodash/lodash/wiki/FP-Guide "lodash/fp"
[spread operator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator "Spread Operator"

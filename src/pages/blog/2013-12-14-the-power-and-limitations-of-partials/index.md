---
title: The Power and Limitations of Partials
date: "2013-12-14"
path: /blog/the-power-and-limitations-of-partials
tags: javascript, node
layout: post
---

*Partially applied functions*, or *partials* for short, are functions with
pre-set arguments. The use of partials is very common in functional
programming and has been implemented in several JavaScript libraries and more
recently in ECMAScript 5 through [`Function.prototype.bind`][bind]. Consider
the following examples:

```js
// Adds two numbers
var add = function (a, b) {
  return a + b;
};
// Let's make some partials!
// Underscore.js
var addTwo = _.partial(add, 2);
// Dojo.js
var addFour = lang.partial(add, 4);
// JavaScript 1.8.5
var addSix = add.bind(null, 6);
// Let's use our partials!
console.log(addTwo(1));  // Logs 3
console.log(addFour(3)); // Logs 7
console.log(addSix(5));  // Logs 11
```

In each of the above examples the original function is not modified -- rather,
a new function is created which calls the original function by concatenating
the pre-defined arguments with the call-time arguments. JavaScript's
[`bind`][bind] works a little differently from Underscore's
[`_.partial`][upartial] and Dojo's [`lang.partial`][dpartial] in that its
first argument becomes the value of `this` when the function is called. You
will need to use this if you are partially applying instance methods.
Underscore and Dojo provide similar functionality through [`_.bind`][ubind]
and [`lang.hitch`][hitch] respectively. For the sake of simplicity, these
functions will not be covered here.

How about a more practical example? [Node.js][node] follows a convention for
all asynchronous callbacks -- they are expected to take an error argument
followed by a result argument. [Async.js][async], a library which provides
functions for dealing with asynchronous control flow and collection
manipulation, builds upon this convention with functions like
[`parallel`][parallel] and [`series`][series] which take arrays of functions
that in turn take nothing but these conventional callbacks. Consider the
following examples:

```js
// Without partials
async.parallel([
  // `done` accepts err, result
  function (done) {
    fs.readFile('foo.txt', 'utf8', done):
  },
  function (done) {
    fs.readFile('bar.txt', 'utf8', done):
  }
], function (err, results) {
  // err is the first thrown / passed error
  // results is an array of results
});

// With async's own partial implementation
async.parallel([
  async.apply(fs.readFile, 'foo.txt', 'utf8'),
  async.apply(fs.readFile, 'bar.txt', 'utf8')
], function (err, results) {
  // same as before
});
```

Async provides its own partial implementation by the name of [`apply`][apply]
which is very similar to Underscore's implementation. By partially applying
`fs.readFile` we are able to shorten the function signature from `filename,
encoding, callback` to just `callback` enabling us to make an array of
partials rather than manually declaring functions as in the first example.

As a side note, you may have noticed that the last argument to
`Async.parallel` is a Node-style callback. If you felt so inclined, you could
partially apply `Async.parallel` and `Async.series` and pass those partials to
other calls to `Async.parallel` and `Async.series`, as such:

```js
async.series([
  async.apply(async.parallel, [
    // First group of parallel tasks
  ]),
  async.apply(async.parallel, [
    // Second group of parallel tasks
  ])
], function (err, results) {
  // err is the same as always
  // results is an array of arrays
});
```

This code will run a group of tasks in parallel and when they are all done run
a second group of tasks in parallel. The final `results` array will be an
array of arrays where each internal array contains the results of each group
of tasks. You can easily change up this example to run two groups of serial
tasks in parallel by changing all calls to `series` with `parallel` and vice
versa. This will work for most functions provided by Async.

On to a more practical example, can we read a bunch of files in parallel and
only have to write `async.apply` once? Of course! Enter
[`Array.prototype.map`][map]:

```js
async.parallel([
  'first.txt',
  'second.txt',
  'foo.txt',
  'bar.txt'
].map(function (file) {
  return async.apply(fs.readFile, file, 'utf8');
}), function (err, results) {
  // Same as before.
});
```

In this example calling `map` on the array of file names returns an array of
partially applied `fs.readfile` functions. Using this technique you can
dynamically create a list of files and read them all into memory. Want to
limit the amount of files being read at once? That's what
[`parallelLimit`][parallelLimit] is for.

## Limitations

So partials are pretty cool. But you have to be careful about how you use them
(in JavaScript). In particular things can get tricky when you partially apply
functions which take more arguments than you intend on passing. Consider the
following:

```js
// This function multiplies all of its arguments together
var multiply = function () {
  return Array.prototype.slice.call(arguments, 0).reduce(function (prev, cur) {
    return prev * cur;
  }, 1);
};

// This function multiplies all of its arguments by each other and 2
var mult2 = multiply.bind(null, 2);

// You might expect this to log [2, 4, 6, 8], but it actually logs [NaN, NaN, NaN, NaN]
console.log([1, 2, 3, 4].map(mult2));

// The solution is to explicity call mult2 with the arguments you want to pass
console.log([1, 2, 3, 4].map(function (v) {
  return mult2(v);
}));
```

Really, it's not fair to call this a limitation of partials but JavaScript
functions in general -- we would have gotten a similar result had we not made
a partial. In my experience this problem appears more often when I am using
partials than when I'm not. What is happening here is that the function passed
to [`map`][map] takes three arguments: `value`, `index`, and `array`. Our
intention is to map each `value` to `2 * value` but instead we end up with
`2 * value * index * array`. The solution is to explicitly pass the arguments
you want into the partial.

Another point to note is that partials usually have a `length` of `0`. This
means that they are declared without an arguments list. They still take
arguments but anything that checks for a partial's `length` property will more
than likely malfunction. For example, asynchronous tests in Mocha:

```js
// Some sort of function is declared somewhere as such:
var asyncFunc = function (data, callback) {
  // do something and call callback per node convention;
};

// It may be tempting to test it in Mocha as such since the async callback
// will fail the test if an error is passed:
it('should do something without error', asyncFunc.bind(null, 'foobarbaz')); // DON'T DO THIS!

// However, since the partial doesn't have a `length` property the test will
// complete immediately and the callback will be undefined. The solution is to
// explicity declare async test functions:
it('should do something without error', function (done) {
  asyncFunc('foobarbaz', done);
});
```

To learn more about testing with Mocha check out [my article on the
subject][post] and the [official Mocha documentation][mocha].

## Kinda Partial-Like Things

Throughout JavaScript and JavaScript libraries you will find various functions
which take a function as an argument as well as a parameter list to pass to
the function. They aren't returning a partial for you to use, but they are an
opportunity for you to avoid the creation of a partial if you don't have to
make one. Take for example [`setTimeout`][setTimeout] and
[`setInterval`][setInterval]:

```js
// Consider the following:
setTimeout(function () {
  doSomething(foo, bar, baz);
}, 1000);

// You may think to compress it with a partial as such:
setTimeout(doSomething.bind(null, foo, bar, baz), 1000);

// But this isn't really necessary. The following does the same thing:
setTimeout(doSomething, 1000, foo, bar, baz);

// It also works with setInterval:
setInterval(doSomething, 1000, foo, bar, baz);
```

In compliant JavaScript environments, the extra arguments passed to
`setTimeout` and `setInterval` are passed to the function when it is called.
Be careful as you can't specify a context this way -- you will have to rely on
[`Function.prototype.bind`][bind], [`_.bind`][ubind], and
[`lang.hitch`][hitch] for that.

## Conclusion

Using partials to adapt existing functions to match a given convention is a
very powerful technique. [Async][async] provides more functions which when
combined with [Node][node] conventions and partials can lead to very concise,
readable, and maintainable code. That being said, you will still have to be
careful in situations where arguments don't match up properly or where you
need to specify a special context for the partially applied function.

[bind]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind "Function.prototype.bind"
[upartial]: http://underscorejs.org/#partial "Underscore.js - Partial"
[dpartial]: http://dojotoolkit.org/reference-guide/1.9/dojo/_base/lang.html#partial "Dojo lang.partial"
[hitch]: http://dojotoolkit.org/reference-guide/1.9/dojo/_base/lang.html#hitch "Dojo lang.hitch"
[ubind]: http://underscorejs.org/#bind "Underscore.js - Bind"
[node]: http://nodejs.org/ "Node.js"
[async]: https://github.com/caolan/async "Async.js"
[parallel]: https://github.com/caolan/async#parallel "Async.js - parallel"
[series]: https://github.com/caolan/async#series "Async.js - series"
[apply]: https://github.com/caolan/async#apply "Async.js - apply"
[map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map "Array.prototype.map"
[parallelLimit]: https://github.com/caolan/async#parallellimittasks-limit-callback "Async.js - parallelLimit"
[mocha]: http://visionmedia.github.io/mocha/ "Mocha"
[post]: /blog/testing-in-browsers-and-node/ "Testing in Browsers and Node with Mocha, Chai, Sinon, and Testem"
[setTimeout]: https://developer.mozilla.org/en-US/docs/Web/API/Window.setTimeout "MDN - setTimeout"
[setInterval]: https://developer.mozilla.org/en-US/docs/Web/API/Window.setInterval "MDN - setInterval"

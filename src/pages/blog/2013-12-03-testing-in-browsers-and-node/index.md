---
title: Testing in Browsers and Node with Mocha, Chai, Sinon, and Testem
date: "2013-12-03"
path: /blog/testing-in-browsers-and-node
tags: javascript, testing, node, browser
layout: post
---

So you're writing some JavaScript code that has to run in multiple web
browsers as well as Node. How can you effectively test this code? Effective
testing means that you should be able to run all tests in all environments on
demand, i.e., with the press of a single button the tests should run in Node,
Chrome, Firefox, Internet Explorer, and whatever other environments you have
set up for testing, and we should avoid code duplication whenever possible.
Continue reading and I'll walk you through setting up a basic testing
environment using [Mocha][mocha] as a testing framework, [Chai][chai] for
assertions, [Sinon][sinon] for mocking, and [Testem][testem] as a universal
test runner. Basic knowledge of testing, asserting, and mocking in languages
other than JavaScript is assumed. Those of you who are familiar with testing,
asserting, and mocking in JavaScript will want to [skip to the
Testem](#testem) section below -- that's where the meat and potatoes of
pulling everything together into a working example is.

## Mocha

[Mocha][mocha] is a testing framework for JavaScript which provides a
flexible, intuitive, and consistent interface for testing JavaScript code,
both synchronous and asynchronous. Additionally, it is designed to run in both
major browsers and Node.

Without further to do, a basic test suite looks like the following:

```js
describe('Library Tests', function () {
  before(function () {
    // set up the environment
  });

  it('Should add numbers', function () {
    // make assertions
  });
});
```

The above code should be fairly self-explanatory. `describe` is used to
describe a test suite, and `it` is used to define actual tests. I am also
making use of a `before` hook to set up the environment prior to running any
tests. In addition to the `before` hook, Mocha makes available the `after`
hook, which executes after all tests have run. The `before` and `after` hooks
additionally have `beforeEach` and `afterEach` counterparts, which, as their
names imply, rather than running before or after all tests run before and
after each individual test.

### Asynchronous Testing

One of the advantages of using Mocha as opposed to certain other testing
frameworks is that it makes asynchronous testing really easy. Consider the
following test:

```js
it('should foobar', function (done) {
  // Simulate calling an asynchronous method with `setTimeout`
  setTimeout(function () {
    // Make assertions
    done();
  }, 1000);
});
```

The only change to the test is that the `it` function now accepts a `done`
argument. `done` is a function you should call when the test has completed
(after all assertions). Additionally, `done` accepts an `Error` object as its
first argument if you have one to give it. The previously mentioned `before`,
`beforeEach`, `after`, and `afterEach` hooks can also be set up to run
asynchronously in the same fashion:

```js
describe('async tests', function () {
  // Before Hooks
  before(function (done) {
    setTimeout(done, 1000);
  });

  beforeEach(function (done) {
    setTimeout(done, 1000);
  });

  // Tests
  it('should foo', function (done) {
    setTimeout(done, 1000);
  });

  it('should bar', function (done) {
    setTimeout(done, 1000);
  });

  // After Hooks
  afterEach(function (done) {
    setTimeout(done, 1000);
  });

  after(function (done) {
    setTimeout(done, 1000);
  });
});
```

The above code will take approximately 8 seconds to run and will follow a
serial execution path as such:

* `before`
* `beforeEach`
* `it` should foo
* `afterEach`
* `beforeEach`
* `it` should bar
* `afterEach`
* `after`

Of course, you can mix synchronous and asynchronous hooks and tests and
everything will run serially with no extra effort.

You may have noticed that I haven't been making any assertions. That is
because Mocha is designed to let you use your own assertions library. Node
provides an `assert` module, but we want to use the same tests and assertions
in all of our environments, not just Node. This is where [Chai][chai] comes
in.

## Chai

[Chai][chai] is an assertions library which provides multiple styles of
assertions for your to use as you see fit. I prefer
[`expect`](http://chaijs.com/api/bdd/)-style assertions which read like
sentences. See the following examples:

```js
expect(3).to.equal(3);
expect(3).to.not.equal('three');
expect([1, [2, [3]]]).to.deep.equal([1, [2, [3]]]);
expect(new Error('foo')).to.be.instanceOf(Error);
expect('foo').to.be.a('string');
expect(!false).to.be.true;
```

As you can see, the `expect` style of assertions are very readable and even
self-documenting. The lack of parentheses after `true` in `to.be.true` is not
a mistake. Chai's `expect` style makes use of [JavaScript getters and
setters][mdngs] meaning `to.be.true` is not a function, but a property getter.
If you need to support an environment which does not support getters and
setters, you will have to use `to.equal(true)` or another assertions library
which is purely functional.

Obviously, the above sample does not cover everything you can do in Chai.
There is a [list of all available chains and assertions][bdd] available
through [Chai's documentation][chai]. The assertions provided by Chai cover
everything you may want to assert, including (deep) (in)equality, inclusion,
existence, ranges, regular expression matching, and (static) method
respondence. Additional functionality which extends the core of Chai is
available in community-provided [plugins][chaiplugins].

## Sinon

On to everybody's favorite topic: mocking! [Sinon][sinon] is a library which
provides spies, stubs, and mocks for JavaScript. Let's cover each of those in
order.

### Spies

A [`spy`][spies] is a function which automatically records various metrics
regarding its execution including arguments passed to it, return value, the
value of `this`, and any exceptions thrown for all of its calls. See the
following example:

```js
var func = sinon.spy();
func(1, 'foo');
expect(func.called).to.be.true;
// The following two assertions are identical
expect(func.calledOnce).to.be.true;
expect(func.callCount).to.equal(1);
// The following two assertions are identical
expect(func.firstCall.calledWith(sinon.match.number, sinon.match.string)).to.be.true;
expect(func.getCall(0).calledWith(sinon.match.number, sinon.match.string)).to.be.true;
// You can even verify that a function was called with specific arguments (not just types)
expect(func.firstCall.calledWith(1, 'foo')).to.be.true;
```

As you can see, Sinon spies are extremely flexible. This example only begins
to scratch the surface of spies in Sinon. `calledOnce` is accompanied by
`calledTwice` and `calledThrice` which are all aliases for checking the
`callCount`. In addition to `firstCall`, Sinon spies provide `secondCall` and
`thirdCall` properties which are all aliases for `getCall(0)`, `getCall(1)`,
and `getCall(2)`, respectively. Anything beyond the third call must be
accessed with `getCall(n)` where `n` is the number call you want to access.
Calls can additionally be inspected, in this case to make sure they were
called with a `number` and a `string`. Sinon provides even more matchers for
the following situations:

* All basic JavaScript primitives
* Truthy / falsy values
* Referential equality to a given object
* Making sure an argument is an instance of a particular constructor
* Making sure an argument has a property (or its own property) which
  optionally match additional expectations

Matchers can even be combined; for example, you can check to make sure an
argument is either a `string` or a `number`. To learn more about this
functionality check out Sinon's [matchers documentation][matchers].

Spies can wrap themselves around existing methods on existing methods.
Consider the following example utilizing [jQuery][jquery]:

```js
// Spy on the `ajax` method of the `jQuery` object
sinon.spy(jQuery, 'ajax');
// Call `jQuery.get(...)` which calls `jQuery.ajax` down the chain
jQuery.get('/some/resource');
// Assert that `jQuery.ajax` was called with the given url.
expect(jQuery.ajax.calledOnce).to.be.true;
expect(jQuery.ajax.getCall(0).args[0].url).to.equal('/some/resource');
// Unwrap `jQuery.ajax` so other tests will be unaffected and can get up their own spies
jQuery.ajax.restore();
```

In this example I referenced the passed argument directly and checked a
property on it for equality to what was passed. I also called the `restore()`
method on the spy to return `jQuery.ajax` to its original functionality. This
is an important step in testing (often run in `after` or `afterEach` hooks) to
make sure tests and their spies do not interfere with each other.

For more information on spy functionality in Sinon, including verifying order
of calls to multiple spies, check out the [Sinon spy documentation][spies].

### Stubs

A [`stub`][stubs] is a [`spy`][spies] with pre-programmed functionality. You
should use a stub when you need to control the behavior of a function you are
spying on. You can very easily program a stub to throw an exception, return a
given value, return and argument which was passed to it, or even call an
argument which was passed to it -- with or without arguments, synchronously or
asynchronously. Stubs can even be programmed to do different things when
different arguments are passed to them. Consider the following example:

```js
var func = sinon.stub();
func.withArgs(42).returns(1);
func.throws();

expect(func(42)).to.equal(1);
expect(func).to.throw(Error);
```

When `func` is passed `42`, it will return `1`. Otherwise, it will throw an
exception.

Just like how you can spy on methods of objects, you can stub methods of
objects. Consider the following example of stubbing the `readFile` method on
Node's filesystem module:

```js
// Stub the file system module
sinon.stub(fs, 'readFile');
// Asynchronously call the third argument with a null error and some text when passed certain arguments
fs.readFile
  .withArgs('foo.txt', 'utf8', sinon.matchers.func)
  .callsArgWithAsync(2, null, 'Foo!');
// Asynchronously call the third argument with an error when passed certain arguments
fs.readFile
  .withArgs('bar.txt', 'utf8', sinon.matchers.func)
  .callsArgWithAsync(2, new Error('File not found!'));
// Do your testing
// Afterwards make sure you restore `fs.readFile` to its original functionality.
fs.readFile.restore();
```

Now everything that calls `fs.readFile('foo.txt', 'utf8', callback)` will have
`callback` called with `null` for an error and `'Foo!'` for data and
everything that calls `fs.readFile('bar.txt', 'utf8', callback)` will have
`callback` called with an `Error` object. The `callback`s are called
asynchronously so all other functionality of your program is preserved, but
your tests are no longer dependent on the file system. Stubbing methods which
rely on external resources such as file systems or network connections is very
common in testing as your tests will run faster and will be more portable
overall.

To learn more about Sinon stubs, read the [Sinon stub documentation][stubs].

### Mocks

[Mocks][mocks] provide fake methods with pre-programmed functionality and with
pre-programmed expectations. For example, you can program a mock to expect a
certain number of calls, at most a certain number of calls, at least a certain
number of calls, to never be called, to be called with certain arguments, and
more. After your test is done you can call your mock's `verify` method which
will throw an exception if the preset expectations are not met. To learn more
about mocks and expectations in Sinon you can read [Sinon's mock
documentation][mocks].

### Chai Assertions

Sinon provides its own assertions. Despite this, for the sake of consistency,
I was using Chai assertions in the examples above. There is a plugin available
for Chai which can streamline expectations for Sinon spies, stubs, and mocks.
Using the plugin, my first Sinon example from above would look like the
following:

```js
var func = sinon.spy();
func(1, 'foo');
expect(func).to.have.been.called;
expect(func).to.have.been.calledOnce;
expect(func).to.have.been.calledWith(sinon.match.number, sinon.match.string);
expect(func).to.have.been.calledWith(1, 'foo');
```

For more information, check out the [Sinon-Chai plugin
documentation][sinonchai].

### More Sinon Functionality

Sinon provides a plethora of other features specific to JavaScript including
fake timers, fake `XMLHttpRequest`s, and fake servers. To learn more about
these features take a look at [Sinon's official
documentation][sinondocs].

## Testem

This is where we tie everything together. [Testem][testem] is a test runner
which can automatically run tests in multiple web browsers and other
environments such as Node. By default tests will run when you connect a
browser or other environment and can be rerun in all connected environments
with the press of a button. By default, tests are also automatically rerun
when a change is detected on the file system. Testem is even capable of giving
you native system notifications meaning you can just code away in your
favorite editor and immediately see test results upon saving without having to
do anything.

Testem provides default HTML pages for running and auto-rerunning as well as
collecting test results. Setting it up to run tests in Node requires a little
bit of set up; however, it is entirely worth it, trust me. Once everything is
set up not only are tests run automatically but all results are collected
centrally so you can instantly see what happened where. In order to streamline
this process I have made a [project available on github][github-project].

First, you need to install [Node][node]. My preferred method is to use
[nvm][nvm] but you can set it up however you like.

Next, clone the project down to your local workspace, change into the project
directory, and install all dependencies using the following commands:

```
$ git clone https://github.com/KenPowers/testing-in-browsers-and-node.git
$ cd testing-in-browsers-and-node
$ npm install
```

Optionally, you can install Testem and Mocha globally (they are both installed
locally as a part of the project, but installing them globally will allow you
to use them elsewhere):

```
$ npm install -g testem mocha
```

Be aware that as of the writing of this article, if you are running Windows
then you will need to [follow one extra step][windows].

Now we can take a look at how everything works together. First, `testem.json`:

```json
{
  "framework": "mocha",
  "src_files": [
    "node_modules/chai/chai.js",
    "lib/*",
    "test/setup.js",
    "test/*.test.js"
  ],
  "launchers": {
    "node": {
      "command": "./node_modules/.bin/mocha -r test/setup.js -R tap test/*.test.js",
      "protocol": "tap"
    }
  },
  "launch_in_dev": [
    "node"
  ]
}
```

Let's walk through this file key-by-key. First we have the `framework` option
set to `mocha`. This tells Testem to load Mocha into all connected web
browsers. Next we have a `src_files` option. These are the files which are
monitored for changes as well as served (in order) to all connected web
browsers. We explicity list `test/setup.js` before `*.test.js` to make sure
our setup file is served and executed before the tests. Next, we set up
launching tests in Node. This is required because by default Testem just sets
up a server for browsers to connect to. All we need to do to get Node working
with Testem is get it running in a similar setup that the browsers will have.
The command `./node_modules/.bin/mocha -r test/setup.js -R tap test/*.test.js`
runs Mocha (node) telling it to require the file `test/setup.js`, use
[tap][tap] as the protocol (so Testem can read the results), and run all files
matching the pattern `test/*.test.js` as tests. If you have Mocha installed
globally then you can simply use `mocha` instead of
`./node_modules/.bin/mocha`. *Finally*, `launch_in_dev` tells Testem to run
our Node launcher.

Now we just have to take a look at one section of `package.json`:

```json
"scripts": {
  "test": "./node_modules/.bin/testem"
}
```

With this piece of configuration you can run `npm test` which will run the
local installation of Testem which will read `testem.json` and start running
the tests. Alternatively, if you have `testem` installed globally then you can
just run `testem` directly.

One last file needs a walk though: `test/setup.js`:

```js
// Export modules to global scope as necessary (only for testing)
if (typeof process !== 'undefined' && process.title === 'node') {
  // We are in node. Require modules.
  expect = require('chai').expect;
  sinon = require('sinon');
  num = require('..');
  isBrowser = false;
} else {
  // We are in the browser. Set up variables like above using served js files.
  expect = chai.expect;
  // num and sinon already exported globally in the browser.
  isBrowser = true;
}
```

This file exports the libraries we are using as global variables. I know what
you are thinking: "NO! NOT GLOBAL VARIABLES! GLOBAL VARIABLES ARE EVIL!" The
truth of the matter is that when we are testing in multiple environments there
are different ways to load these dependencies -- we can either do this for
each test suite or we can do it once up front. Take your pick. This file
additionally sets a boolean value `isBrowser` which you can use in the tests
if you need to test things differently in browsers than you do in Node. You
can even set up tests to only run in certain environments by using code like
the following:

```js
describe('multi-environment testing', function () {
  if (isBrowser) {
    it('should foo', function () {
      // This test will only run in browsers.
    });
  } else {
    it('should bar', function () {
      // This test will only run in Node.
    });
  }
  it('shold baz', function () {
    // This test will run everywhere.
  });
});
```

Take a moment to look through the other files included in the project. There
is no need to walk through them here because after reading this article their
contents should be fairly intuitive. That being said, let's do a quick rundown
of each file. `lib/num.js` contains a basic math library. It has a `square`
method, which squares a given number, and a `squareRandomNumber` method, which
depends on a method that asynchronously retrieves a random number.
`test/num.test.js` tests each of the previously mentioned methods, making use
of assertions and stubs as necessary.

Go ahead and run either `npm test` (or `testem` if you installed globally)
now.

Now that Testem is running you'll see a few things. One thing you'll see is a
tab with the test results for node. Another thing you'll see is a URL you can
visit to connect a web browser for testing. After opening the URL in a few web
browsers Testem should look like the following:

![Testem Screenshot](./testem.png)

By using the left and right arrow keys you can see test results and error
messages for all browsers and connected launchers. Pressing `enter` will rerun
tests in all connected environments, and pressing `q` will quit Testem.

Try making a change to `lib/num.js` that you think will make one or more of
the tests fail. You should see Testem automatically rerun the tests and
further see which tests failed in which environments.

## Other features in Testem

Testem does more than just run tests in multiple environments very easily. You
can specify preprocessors that run before tests run (e.g., compiling
CoffeeScript or running a CSS preprocessor), separate source files (monitored
for changes) and served files (not monitored for changes), and more (such as
the previously mentioned system notifications). To learn about these features
take a look at [Testem's documentation][testem].

## Conclusion

This article is meant to get you familiar with the basics of multi-environment
testing in JavaScript. More articles about each of the above projects
featuring more advanced features are in the pipeline. In the meantime, you can
read the official documentation of each project here:

* [Mocha][mocha]
* [Chai][chai]
* [Sinon][sinon]
* [Testem][testem]

[mocha]: http://visionmedia.github.io/mocha/ "Mocha"
[chai]: http://chaijs.com/ "Chai"
[sinon]: http://sinonjs.org/ "Sinon"
[testem]: https://github.com/airportyh/testem "Testem"
[mdngs]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Defining_getters_and_setters "Defining Getters and Setters"
[bdd]: http://chaijs.com/api/bdd/ "Chai BDD API"
[chaiplugins]: http://chaijs.com/plugins "Chai Plugins"
[spies]: http://sinonjs.org/docs/#spies "Sinon Spies API"
[matchers]: http://sinonjs.org/docs/#sinon-match "Sinon Matchers API"
[stubs]: http://sinonjs.org/docs/#stubs "Sinon Stubs API"
[mocks]: http://sinonjs.org/docs/#mocks "Sinons Mocks API"
[sinonchai]: http://chaijs.com/plugins/sinon-chai "Sinon-Chai Plugin Documentation"
[sinondocs]: http://sinonjs.org/docs "Sinon Official Documentation"
[jquery]: http://jquery.com "jQuery"
[node]: http://nodejs.org "Node"
[nvm]: https://github.com/creationix/nvm "Node Version Manager"
[windows]: https://github.com/airportyh/testem#known-issues "Windows Workaround"
[tap]: http://en.wikipedia.org/wiki/Test_Anything_Protocol "Test Anything Protocol"
[github-project]: https://github.com/KenPowers/testing-in-browsers-and-node "GitHub Project"

---
title: Advanced Features in Sinon
date: "2014-01-01"
path: /blog/advanced-features-in-sinon
tags: javascript, testing
layout: post
---

In [my previous post on testing][prev] I covered the basics of testing with
[Mocha][mocha], [Chai][chai], and [Sinon][sinon] -- including asynchronous
testing and stubbing methods with asynchronous callbacks (such as methods
which make a server request). That's all well and good, but sometimes it's
more convenient or natural to synchronously manipulate the JavaScript timer or
create fake servers to instantly and synchronously respond to requests.
[Sinon][sinon] provides the facilities to work such magic -- read on to learn
more.

## Fake Timers

If you are testing code which uses `setTimeout` or `setInterval` it can be
tricky to get the asynchronous test right and if your timeouts are of any
substantial length your tests can take longer than ideal to complete. Sinon
lets us replace the global `setTimeout` and `setInterval` functions with fake
versions that we can control. Observe:

```js
describe('fake timers', function () {
  beforeEach(function () {
    // Overwrite the global timer functions (setTimeout, setInterval) with Sinon fakes
    this.clock = sinon.useFakeTimers();
  });

  afterEach(function () {
    // Restore the global timer functions to their native implementations
    this.clock.restore();
  });

  it('should synchronously advance the JavaScript clock', function () {
    // Create a spy to record all calls
    var spy = sinon.spy();
    // Call the spy in 1000ms
    setTimeout(spy, 1000);
    // Tick the clock forward 999ms
    this.clock.tick(999);
    // The spy should not have been called yet
    expect(spy).to.not.be.called;
    // Tick the clock forward 1ms
    this.clock.tick(1);
    // Now the spy should have been called
    expect(spy).to.be.called;
  });

  it('should also work with setInterval', function () {
    // Faking the JavaScript clock also works with setInterval:
    var spy = sinon.spy();
    setInterval(spy, 200);
    this.clock.tick(400);
    expect(spy).to.be.calledTwice;
    this.clock.tick(200);
    expect(spy).to.be.calledThrice;
  });
});
```

When we call `sinon.useFakeTimers()` Sinon replaces the global `setTimeout`
and `setInterval` functions and returns a clock object we can control. By
calling `clock.tick(n)` we are able to advance the clock by `n` milliseconds.
When the milliseconds we have ticked forward are greater than or equal to the
delay parameter given to a timeout or interval the respective callbacks are
called synchronously. In our case the callback is a Sinon spy which we are
able to examine for call details when we need to make assertions.

## Ensuring Spy Call Order

Spies are capable of determining the order they were called relative to each
other. We can demonstrate this by testing that a number of timeouts were
triggered in the proper order:

```js
it('should be able to verify call order', function () {
  // Create some spies
  var spy1 = sinon.spy(), spy2 = sinon.spy();
  // Set some timeouts
  setTimeout(spy1, 200);
  setTimeout(spy2, 500);
  // Advance the clock
  this.clock.tick(500);
  // Expectations
  expect(spy1).to.be.called;
  expect(spy2).to.be.called;
  expect(spy1).to.be.calledBefore(spy2);
});
```

I am using `sinon-chai` but you can also verify call order using
`spy.calledBefore(otherSpy)` and `spy.calledAfter(otherSpy)`.

## Fake Requests

On to faking `XMLHttpRequest`! Sinon allows us to override the global
`XMLHttpRequest` object and synchronously control its behavior. Consider the
following:

```js
describe('fake requests', function () {
  beforeEach(function () {
    // Overwrite the global XMLHttpRequest with Sinon fakes
    this.xhr = sinon.useFakeXMLHttpRequest();
    // Create an array to store requests
    var requests = this.requests = [];
    // Keep references to created requests
    this.xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };
  });

  afterEach(function () {
    // Restore the global timer functions to their native implementations
    this.xhr.restore();
  });

  it('should fake XMLHttpRequests', function () {
    // Create a spy
    var spy = sinon.spy();
    // Request using jQuery
    $.get('/foo/bar/baz').done(spy);
    // Verify that the request is tracked -- not really necessary, just a demonstration
    expect(this.requests).to.have.length(1);
    // Respond to the request
    this.requests[0].respond(200, {'Content-Type': 'text/plain'}, 'FooBarBaz!');
    // The spy was called synchrnously, verify its call details.
    expect(spy).to.be.calledWith('FooBarBaz!');
  });
});
```

Before each test we set up the fake `XMLHttpRequest` and override `onCreate`
so that we may track all requests we make using it. After each test we restore
the native `XMLHttpRequest` object. In the actual test we make a request with
jQuery, make sure the proper number of requests were sent, and then respond to
the request with headers and data which causes jQuery to synchronously call a
spy we set up.

Cool stuff, but shouldn't there be an easier way to accomplish all of this
without having to keep track of requests? Read on to learn about fake servers
in Sinon.

## Fake Servers

Fake servers in Sinon are an extension of fake requests which keep track of
requests for us so we don't have to! Fake servers work very similarly to fake
requests, as such:

```js
describe('fake servers', function () {
  beforeEach(function () {
    // Set up a fake server (calls `sinon.useFakeXMLHttpRequest()`)
    this.server = sinon.fakeServer.create();
  });

  afterEach(function () {
    // Create a spy to record server responses.
    var spy = sinon.spy();
    // Request with jQuery
    $.get('/foo/bar/baz').always(spy);
    // MAKE SURE YOU CALL `server.respond()`!
    this.server.respond();
    // Make assertions, onces again, everything is synchronous.
    expect(spy).to.be.calledOnce;
    expect(spy).to.be.calledWith('FooBarBaz!');
    // Restore native functionality.
    this.server.restore();
  });

  it('should fake server responses (basic response)', function () {
    this.server.respondWith('FooBarBaz!');
  });

  it('should fake server responses (url, response)', function () {
    this.server.respondWith('/foo/bar/baz', 'FooBarBaz!');
  });

  it('should fake server responses (url regex, response)', function () {
    this.server.respondWith(/\/foo\/bar\/baz$/, 'FooBarBaz!');
  });

  it('should fake server responses (method, url, response)', function () {
    this.server.respondWith('GET', '/foo/bar/baz', 'FooBarBaz!');
  });

  it('should fake server responses (method, url regex, response)', function () {
    this.server.respondWith('GET', /\/foo\/bar\/baz$/, 'FooBarBaz!');
  });

  it('should fake server responses (method, url, [code, headers, response])', function () {
    this.server.respondWith('GET', '/foo/bar/baz', [200, {'Content-Type': 'text/plain'}, 'FooBarBaz!']);
  });

  it('should fake server responses (method, url regex, [code, headers, response])', function () {
    this.server.respondWith('GET', /\/foo\/bar\/baz$/, [200, {'Content-Type': 'text/plain'}, 'FooBarBaz!']);
  });
});
```

Here we have seven tests which all have the same assertions. For that reason,
I put the assertions in the `afterEach` hook. The basic flow of using fake
servers is as such:

* **Before Each:** Create a fake server, overriding native functionality.
* **Test:** Tell the fake server how to respond to requests with
  `server.respondWith(...)`.
* **Test:** Make requests using your favorite method.
* **Test:** Tell the fake server to synchronously respond with
  `server.respond()`.
* **After Each:** Restore native functionality.

The reason I have seven tests is to demonstrate all the different ways you can
have a server respond to requests by using the different signatures of
`server.respondWith(...)`. In order, each of the tests do the following:

1. Respond to all requests with the same plain text.
1. Respond to all requests with a specific url.
1. Respond to all requests to an url matching a given regular expression.
1. Respond to all `GET` requests to a specific url.
1. Respond to all `GET` requests to an url matching a given regular
   expression.
1. Respond to all `GET` requests to a specific url with custom headers.
1. Respond to all `GET` requests to an url matching a given regular expression
   with custom headers.

As you can see, fake servers are extremely flexible and are capable of
completely decoupling your front-end tests from your back end enabling you to
not have to run a server for your tests. This, of course, can be accomplished
with regular stubbing, but the fake server approach is often simpler and more
natural.

## JSON-P

As of this writing, Sinon doesn't support fake JSON-P requests and it probably
never will. The official recommendation is to fall back to stubbing whenever
you need to make a JSON-P request. For more information, check out [the
official documentation][jsonp].

## Conclusion

By using advanced features provided by [Sinon][sinon] we are able to simplify
and even drastically improve the performance of tests which rely on
`setTimeout`, `setInterval`, and making requests for external resources. To
learn more, be sure to check out [Sinon's Official Documentation][sinondoc].

[sinon]: http://sinonjs.org/ "Sinon.JS"
[mocha]: http://visionmedia.github.io/mocha/ "Mocha"
[chai]: http://chaijs.com/ "Chai"
[prev]: /blog/testing-in-browsers-and-node/ "Testing in Browsers and Node with Mocha, Chai, Sinon, and Testem"
[filter]: http://sinonjs.org/docs/#filtered-requests "Filtered Requests in Sinon"
[jsonp]: http://sinonjs.org/docs/#json-p "Sinon JSON-P Workaround"
[sinondoc]: http://sinonjs.org/docs/ "Sinon.JS Official Documentation"

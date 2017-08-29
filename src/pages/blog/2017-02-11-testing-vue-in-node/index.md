---
title: "Testing Single-File Vue Components in Node"
date: "2017-02-11"
path: /blog/testing-vue-in-node
tags: vue, testing
layout: post
---

[Vue] is a progressive framework for building user interfaces in JavaScript,
HTML, and CSS. One of its most unique features is that it allows you to combine
the JavaScript (logic), HTML (template), and CSS (style) for a single component
into a [single `.vue` file].

One of the benefits of writing universal JavaScript is that you can test all of
your code, front-end and back-end, together in node without having to spin up
browser processes. Unfortunately, `.vue` files don't quite fit this pattern.
Until now.

I just published version `1.0.0` of [`vue-node`], a require hook for loading
single-file vue components in node. What follows is an example of how to use
[`vue-node`] with [AVA], a popular node testing framework.

## Let's do this!

First, make sure you have [`vue-node`] and [`browser-env`] installed as
development dependencies. If you are running an environment with `vue-loader`
and `webpack@2` then you will already have all required peer dependencies:

```sh
npm i -D vue-node browser-env
```

Now create a setup file called `test/helpers/setup.js`. Putting it in the
`test/helpers` directory will let [AVA] know that this file is not a test.

```js
const browserEnv = require('browser-env');
const hook = require('vue-node');
const { join } = require('path');

// Setup a fake browser environment
browserEnv();
// Pass an absolute path to your webpack configuration to the hook function.
hook(join(__dirname, 'webpack.config.test.js'));
```

Now you can configure AVA to require this file in all test processes. In
`package.json`:

```json
{
  "ava": {
    "require": [
      "./test/helpers/setup.js"
    ]
  }
}
```

Now you can `require` / `import` `.vue` files and test like you would in a
browser! If you need to test DOM updates, I recommend using the [`p-immediate`]
package from npm along with `async` / `await`.

```js
import Vue from 'vue';
import test from 'ava';
import nextTick from 'p-immediate';
import TestComponent from './test.vue';

test('renders the correct message', async (t) => {
  const Constructor = Vue.extend(TestComponent);
  const vm = new Constructor().$mount();
  t.is(vm.$el.querySelector('h1').textContent, 'Hello, World!');
  // Update
  vm.setName('Foo');
  await nextTick();
  t.is(vm.$el.querySelector('h1').textContent, 'Hello, Foo!');
});
```

There are more examples in the [`test` directory] of [`vue-node`].

## How does this work?

Node allows developers to hook `require` to load files that aren't JavaScript or
JSON. Unfortunately, require hooks have to be synchronous. Using `vue-loader` on
the other hand, is inherently asynchronous. [`vue-node`] works by synchronously
running webpack in a separate process and collecting the output to pass to
node's module compilation system. The compilation is done completely in memory
without writing to the filesystem. It also modifies your webpack configuration
to automatically build for node and commonjs with all dependencies of your
component externalized. This means that the built component modules are as small
as possible with dependency resolution left up to node.

## Why not just test in browsers using Karma?

Unit testing in web browsers is a very heavy process with many tradeoffs.
Configuration and tooling is tricky as is getting browsers to run in CI. I
personally like saving browsers for end-to-end testing with things like
[`Nightwatch.js`].

## What if I use vueify?

I am personally more familiar with webpack than browserify, so for the time
being this will only work in combination with webpack. I will gladly accept a
pull request to implement browserify functionality.

## Don't `.vue` files violate the principle of separation of concerns?

No. For the same reason React doesn't violate that very same principle for
putting angle brackets in your JavaScript. Separation of technologies is often
confused with separation of concerns. Far from separating your concerns, using
separate files just spreads out your concerns and makes them hard to manage.

## What now?

Use [`vue-node`] in your projects and submit issues and pull requests. I would
love to see the [Vue] community embrace headless testing in node just like the
React community has. Feel free to leave any questions or feedback in the
comments section below.

[`browser-env`]: https://github.com/lukechilds/browser-env
[`Nightwatch.js`]: http://nightwatchjs.org/ "Node.js powered End-to-End testing framework"
[`p-immediate`]: https://github.com/sindresorhus/p-immediate "Returns a promise resolved in the next event loop"
[`test` directory]: https://github.com/knpwrs/vue-node/tree/master/test
[`vue-node`]: https://github.com/knpwrs/vue-node "vue-node: A require hook for loading single-file vue components in node."
[AVA]: https://github.com/avajs/ava "AVA: Futuristic Test Runner"
[single `.vue` file]: https://vuejs.org/v2/guide/single-file-components.html "Single File Components"
[Vue]: https://vuejs.org/ "Vue.js"

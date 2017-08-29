---
title: Using Lodash as a Collection of Micro-Libraries
date: "2016-03-24"
path: /blog/using-lodash
tags: javascript
layout: post
---

[So a thing happened recently.][npm blog post] I'm sure you've heard of it by
now. 11 lines of code were unpublished from npm and all hell broke loose. This
post isn't going to be about my opinion, everyone else on the Internet seems to
be handling that just fine. This also isn't going to be a summary of what
happened. The [npm blog post] does that just fine and gets in to all the details
I don't feel like writing about (legal stuff... ugh...). This is going to be a
discussion on the context of why this happened and a few ways it can be avoided
in the future (but I'm not going to talk about preventing unpublishing, others
around the Internet including the [npm blog post] already cover that avenue).

## The origin: micro-libraries and keeping things [DRY].

Micro libraries are great. They follow the philosophy of doing one thing and
doing it well so we can keep our code [DRY] without depending on huge monolithic
libraries. Changes, such as bug or compatibility fixes are easily pushed out to
everyone depending on these micro libraries and everyone is happy. Until one of
those micro libraries goes missing.

Some have suggested that these 11 lines of code were so basic that developers
should have implemented them themselves. I disagree with this approach. I don't
want my application download size to start bloating because various dependencies
are all implementing their own functionality when they can all get that
functionality from one place. The next common suggestion is that
highly-depended-upon code should be moved in to the standard library. The
problem with this idea is that when you are writing JavaScript you typically
aren't just targeting one platform. You are targeting different versions of all
the major browser vendors, node, and maybe even Rhino or some other platforms
that run JavaScript (I was recently targeting Adobe After Effects which runs
ES3! Party like it's 1999!). History has shown that people are slow to upgrade
(or they simply *can't* upgrade) which results in developers polyfilling missing
functionality. And what are they polyfilling with? That's right,
micro-libraries!

## So how do we address this?

There are certain things that probably shouldn't be their own module, but that
path is steering too much towards writing an opinion piece. That said, there is
a very popular library which I would recommend. It's in the title of this post.
It's [Lodash]! As far as my quick glance can tell it is still the most
depended-upon module on all of npm (unlikely to be unpublished, and yes [npm is
working on that][npm blog post]), [has great code coverage][t3], and is packed
full of well-designed and thought-out utility functions including one which does
the same thing that the unpublished code from npm did ([Lodash] calls it
[`padStart`] to match the [proposal]).

**Update:** [Lodash] is not only the most depended-upon package on npm, [it's
the most depended-upon by a large margin.][npmrank]

## But isn't Lodash monolithic?

If you use it from a CDN, sure. But that's not the use case we're talking about
here. We're talking about something which was unpublished from npm. When you
install [Lodash] from npm there are a few ways you can grab only the functions
you use so you don't bloat your build. Let's take a look.

## Option 1: Import / Require Sub-Modules

When you install [Lodash] from npm, you can directly access individual functions
as sub-modules from the main `lodash` module. For our friend, [`padStart`], that
looks like this:

```js
// ES2015 import
import padStart from 'lodash/padStart';
// CommonJS
const padStart = require('lodash/padStart');
```

That's it! No additional setup required. That works for any function in
[Lodash]. Just add a `/` and get the function you need directly. Only the parts
of [Lodash] you need will be included in your build and nothing else. And as
long as other developers depend on the same version of [Lodash] as you do then
we get to stay nice and [DRY] (more on this later).

## Option 2: `babel-plugin-lodash`

Do you use Babel as a part of your build? Oh, who am I kidding? Of course you
do! That means you have another option: [`babel-plugin-lodash`]. You simply use
`lodash` as if it were a giant monolithic library:

```js
import _ from 'lodash';
console.log(_.padStart('foo', 10));
```

Then all [Lodash] `import`s (and `require`s) and usages are rewritten to be as
if you used the first option:

```js
import _padStart from 'lodash/padStart';
console.log(_padStart('foo', 10));
```

You can also use the partial import syntax from ES2015. This:

```js
import {
  map,
  reject,
  take,
} from 'lodash';

const result = map([1, 2, 3], function() {});
take(reject(result), 1);
```

Becomes this:

```js
import _map from 'lodash/map';
import _reject from 'lodash/reject';
import _take from 'lodash/take';

const result = _map([1, 2, 3], function() {});
_take(_reject(result), 1);
```

It'll even work if you rename your imports, as such:

```js
import {
  map as ldMap,
  reject as ldReject,
  take as ldTake,
} from 'lodash';

const result = ldMap([1, 2, 3], function() {});
ldTake(ldReject(result), 1);
```

## Option 3: [`lodash-es`] and [Tree Shaking]

That first option has been around for a while. The second option is newer and
doesn't require you to be as explicit, but configuring your build around a
specific library may not appeal to everyone. There is an even newer technique
that will probably be all the rage any day now: [tree shaking] for ES2015. There
are two module bundlers I can think of off the top of my head that support it
out of the box: [webpack 2][webpack] and [Rollup]. [Tree shaking] is still a
work in progress and I haven't yet gotten good results trying to shake the tree
that is [`lodash-es`] (compare ~100KB to ~4KB for using `_.padStart` in a
project). See [this webpack issue][shaking-webpack] and [this rollup issue
comment][shaking-rollup] for more details.

## Bonus: this all works with [`lodash/fp`]!

[`lodash/fp`] just rewrites the signatures of regular [Lodash] functions but
still uses the underlying code of the original functions so you are still
keeping things DRY if other developers aren't using [`lodash/fp`]. It's
essentially just a wrapper for [Lodash] functions to make them more functional.

## The downside: this breaks shortcut fusion.

Huh? To quote the [Lodash documentation][shortcut fusion]:

> Lazy evaluation allows several methods to support shortcut fusion. Shortcut
fusion is an optimization to merge iteratee calls; this avoids the creation of
intermediate arrays and can greatly reduce the number of iteratee executions.

Of course, if you're migrating from micro-libraries such as `left-pad` then this
shouldn't really concern you anyway because you didn't have shortcut fusion to
begin with. It's just worth noting that [if you pick and choose Lodash functions
individually you won't be able to use shortcut fusion][ld-issue].

## Some advice: use semantic versioning!

When you are depending on [Lodash] do not depend on an exact version. The
[Lodash] maintainers are very good about following semantic versioning which
means breaking changes will only be introduced in major releases. As of this
writing, that means you should depend on version `^4` of [Lodash] (or if you run
`npm i -S lodash` then whatever it puts in your `package.json` is fine, as long
as it starts with `^`).

## Staying up to date.

So what happens when [Lodash] releases version 5? Fragmentation, that's what!
Suddenly we're no longer [DRY] as some libraries will depend on [Lodash] `^4`
and others will depend on [Lodash] `^5`. That's where [Greenkeeper] comes in.
[Greenkeeper] will watch your dependencies and automatically send you pull
requests when a new version of something is published that isn't covered by the
version ranges in your `package.json`. If your CI passes then you're good to
merge (but feel free to run whatever additional checks you want to). I recommend
that all open source JavaScript library authors use [Greenkeeper] as it is
free for open source projects and it'll help you stay up to date.

## Conclusion

Nothing I wrote about in this post is necessarily new or revolutionary, but
given what I am dubbing *[The Great NPM Fiasco of 2016][npm blog post]* I felt
it was worth discussing in context. I would personally advise that at a minimum,
if you are depending on a micro-library such as `pad-left`, or something
similar, you should instead depend on [Lodash] and then use `lodash/padStart`,
or whatever the equivalent [Lodash] functions are for whatever you need in your
project. Whatever you do, don't just copy and paste code or re-implement basic
functionality in every project. [Lodash] functions are well-tested ([1][t1],
[2][t2], [3][t3]) and will help you keep everything very [DRY]. Small side
benefit: your `package.json` will shrink since you only need to depend on one
library instead of many.

[`babel-plugin-lodash`]: https://github.com/lodash/babel-plugin-lodash "Use Lodash as a monolithic library without worrying about bundling unused parts."
[`es2015-native-modules`]: https://github.com/araphel/babel-preset-es2015-native-modules "babel-preset-es2015-native-modules"
[`lodash-es`]: https://www.npmjs.com/package/lodash-es "Lodash Exported as ES Modules"
[`lodash/fp`]: https://github.com/lodash/lodash/wiki/FP-Guide "lodash/fp"
[`padStart`]: https://lodash.com/docs#padStart "\_.padStart"
[`ProvidePlugin`]: https://github.com/webpack/docs/wiki/list-of-plugins#provideplugin "webpack ProvidePlugin"
[DRY]: https://en.wikipedia.org/wiki/Don%27t_repeat_yourself "Don't Repeat Yourself"
[Greenkeeper]: https://greenkeeper.io/ "Greenkeeper: Your software, up-to-date, all the time."
[ld-issue]: https://github.com/lodash/lodash/issues/1426 "Cherry-Picking and Shortcut Fusion"
[lodash]: https://lodash.com/ "Lodash: A modern JavaScript utility library delivering modularity, performance, & extras."
[npm blog post]: http://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm "kik, left-pad, and npm"
[npmrank]: https://gist.github.com/anvaka/8e8fa57c7ee1350e3491#file-01-most-dependent-upon-md "Top 1000 most depended-upon packages"
[proposal]: https://github.com/tc39/proposal-string-pad-start-end "String.prototype.padStart / String.prototype.padEnd"
[Rollup]: http://rollupjs.org/ "Next-generation ES6 module bundler"
[shaking-rollup]: https://github.com/rollup/rollup/issues/45#issuecomment-151160765 "Tree Shaking Results for Rollup"
[shaking-webpack]: https://github.com/webpack/webpack/issues/1750 "Tree Shaking Results for webpack"
[shortcut fusion]: https://lodash.com/docs#_ "Lodash Shortcut Fusion"
[t1]: https://travis-ci.org/lodash/ "Lodash CI"
[t2]: https://saucelabs.com/u/lodash "Lodash Cross-Browser Tests"
[t3]: https://codecov.io/github/lodash "Lodash Code Coverage"
[Tree Shaking]: http://www.2ality.com/2015/12/webpack-tree-shaking.html "Tree-shaking with webpack 2 and Babel 6"
[webpack]: http://webpack.github.io/ "webpack module bundler"

---
title: Why You Should Learn JavaScript in 2016
date: "2016-01-29"
path: /blog/learn-javascript-2016
tags: javascript
layout: post
---

Recently I saw this question come up in my Facebook news feed:

> Why should I learn Node.js? Anyone want to give me some good reasons?

Well, my anonymous friend. My short answer would be, you shouldn't. At least,
you shouldn't *specifically* learn Node.js. You should learn JavaScript. I mean
*real* JavaScript. Not JavaScript, that little toy language you've used for
click handlers and the occasional HTTP request, but JavaScript, the language of
the Internet. *[Universal]* (sometimes called *isomorphic*) JavaScript that runs
on the client *and* the server without modification.

## Common Complaints

Before I dive into why you should learn JavaScript, I'd like to address two of
the most common complaints I hear about JavaScript.

### First complaint: JavaScript is Dynamic. I want types!

Yes, you are technically correct. The best kind of correct. JavaScript is
dynamic. The debate of dynamic vs static languages has been going on for nearly
four centuries<sup>1</sup> now and is much larger than I am looking to address
here. I will say that if you want static types you should check out [Flow] or
[TypeScript]. I'll touch on both in a little more detail later on.

I'll also note that both Angular 2 and Dojo 2 are being written in TypeScript.
While that point may appear to contradict what my goal is here I'd like to say
that while those frameworks are being written in TypeScript, they will still
very much be a part of the JavaScript ecosystem. They will be completely
interoperable with JavaScript and will run in all the same places, in the same
way, and use all the same tools that regular JavaScript does.

### Second complaint: JavaScript is completely unusable without jQuery.

I actually still hear this one a lot. And... it's wrong. It's just *completely*
wrong. jQuery does very little to address problems with JavaScript as a
language. It does *a lot* to smooth out the differences in APIs exposed by
browsers -- mostly the DOM (especially in older browsers, and *especially* the
dreaded Internet Explorer). Node doesn't have a DOM, at least not until [you
construct one from scratch][jsdom]. That said, you'll rarely (if ever) see
jQuery used outside the browser. I've often referred to jQuery as a DOM
steamroller. In Node, given the absence of a DOM, there isn't really much for
jQuery to steamroll. Understanding that the APIs exposed by browsers are
different from JavaScript as a language will help you gain a better appreciation
for JavaScript as a platform for application development.

There are two trends in browser JavaScript right now that address this
complaint. First, browser APIs are converging. Browser vendors are getting rid
of their differences on their own -- deprecating old, proprietary APIs and
working together to produce new, open, and easy-to-understand APIs with
consistent implementations (e.g., [`fetch`] in place of [`XMLHttpRequest`] and
[`WebSocket`] in place of various solutions for full-duplex communication
including long-polling, Flash, and crazy things with `iframe`s). Second, there
has been a rise in the publication and usage of micro-libraries and client-side
packaging utilities. Many projects are picking and choosing what abstractions
they want to include in their client-side JavaScript rather than relying on
large, do-it-all libraries.

That said, I want to emphasize that the notion that JavaScript requires jQuery
in order to be usable is just flat-out wrong. It was wrong when it was first
introduced and it's especially wrong today when JavaScript that runs in more
than just the browser is rising in popularity.

## So why should I learn JavaScript?

I touched on it a little bit in the introduction. The biggest thing I think
JavaScript has going for it is its [universal] nature: being able to write an
application once that runs everywhere without modification. And, again, I don't
just mean different browsers. I mean sharing logic (business logic, validation
logic), libraries, and skillsets between clients and servers without having to
rewrite anything or maintain multiple codebases.

Let's start off with 2015's darling child. [React] is an example of [universal]
JavaScript. It is a UI library that runs on clients and on the server. On the
client it will render a fully-functional UI to the browser's DOM. On the server
you can render to a string of HTML. You may be used to the concept of
pre-compiling and maybe even pre-rendering client-side templates. [React] takes
that a step further and lets you render your entire application in any state you
need it to be on the server. Once the client has received the rendered HTML,
your [React] application can pick up the rendering on the client by hooking up
all the event handlers required for user interaction and handling all other
state changes as a [SPA]. If the client has JavaScript disabled then your
application can gracefully degrade to doing round-trip server requests as in
traditional, pre-ajax applications. This creates the illusion of the ideal
scenario of progressive enhancement, when in reality what actually happened was
your JavaScript application adapted to fit its environment. I want to reiterate
that the same *exact* code that runs on the client also runs on the server. We
didn't rewrite anything to make this happen, and it works everywhere.

[React], in many cases (if not most cases), lets you forget that the DOM even
exists. The biggest headache facing JavaScript developers for nearly two
centuries<sup>2</sup> has been defeated! For real though, [React] invented a
concept the authors refer to as a [virtual dom][vdom]. Essentially you *declare*
the structure of your application, much like in HTML. When you make changes
[React] will diff the component tree, figure out what changed, and then apply
those changes to the real UI facing the user. The really cool thing about this
is that these concepts are portable between environments. You don't have to
render these interfaces or apply these changes in a web browser.

Enter [React Native]. You can use your existing React Components and JavaScript
logic to create native mobile applications for iOS and Android. No, I don't mean
hybrid apps that run in a `webview`. I mean controlling *really real* native
user interface components from an embedded JavaScript engine in a native
application. These applications are indistinguishable from native applications
written in Objective-C or Java. You might have even used one recently and didn't
even realize it! [Check out these real applications][bwrn] built with [React
Native].

There are some huge advantages here. Imagine fixing a bug once and then
deploying that single fix to your server, your web app, iOS, and Android. All at
the same time. You can more easily share developers across all of your
applications. Management of features across platforms becomes a lot easier.
That's powerful stuff. For a simple introduction, you should check out my good
friend and colleague [Jon Kaufman][jdk]'s post, [Sharing Code Between React Web
and Native Apps][sharing-code].

[React] also lets you do other cool stuff, like [Hot Loading User Interface
Components and Time Travel][gaeron-talk]. Said another way, you can modify your
components and they will update in the browser while maintaining state. Without
refreshing your browser. Then you can even rewind and playback actions that
modified your state so you don't have to reproduce the state you are currently
in, or any state before it. It's even error-resistant. It even works with [React
Native]! Really! [Check out the video][gaeron-talk]. Now take it a step further.
You have a web app open in Chrome and Firefox on your computer, as well as on
Android and iOS tablets and phones (to test responsive design), and you have
native apps open on multiple Android and iOS devices. Change some code, and
*everything* updates, in-place. Talk about a productivity boost! This works
because [React] encourages a functional style of writing user interfaces where
your state is kept completely separate from your user interface declarations.
Since [React] works by diffing and applying patches to live user interfaces,
it's not hard to imagine how everything comes together to enable hot-loading.
New declarative representation of UI comes in, apply the state, do a diff, apply
the changes to the real UI, done. Except you don't have to worry about any of
that because it's already all done for you.

## Okay. [React] is cool. Why else should I learn JavaScript?

[React] isn't the only cool thing going on in the JavaScript community. Here are
some other reasons you might consider as to why you should learn JavaScript.

### A massive, diverse, and vibrant community.

[NPM], at the time of this writing, is by far [the largest module ecosystem
currently available][mc]. This not only indicates a live, vibrant community, but
also a low barrier to entry.

### Browser vendors might work together on new features, but they compete on performance.

Because of competition between browser vendors, JavaScript performance is
improving all the time. Node currently runs on Google's V8 JavaScript engine, so
it gets the same improvements that Chrome does. There was also recently a [pull
request][edge-pr] to enable Node.js to use Edge's ChakraCore JavaScript Engine.
It'll be interesting to see where that goes in the long term.

### Scalability.

You can scale Node.js to [100,000], [250,000], and [1,000,000] simultaneous open
sockets on fairly modest hardware (the server in each of those posts has 16GB of
ram).

### Getting Rid of `this`

Thanks to libraries like [React], [Redux], [Rambda], and [`lodash/fp`][lodash],
purely-functional programming is becoming more popular in JavaScript. Not quite
[Haskell]-level but the concepts of pure functions and immutable state are
there. [Yolk] is a really cool user interface library written on top of [RxJS]
and [`virtual-dom`] that uses JSX and a purely-functional style of programming.

### Progressive JavaScript

[Vue.js] also looks interesting. The original author presents it as a
*progressive* JavaScript framework. That is, a framework of micro-libraries you
can adopt one-by-one, as you need them. It doesn't have a native component, but
you still get hot loading and a lot of other stuff that [React] gives you. It's
definitely worth checking out. Be sure to check out [Awesome Vue].

### Native Applications Without [React]

It shouldn't be a secret by now that I'm a big fan of [React]. That said, you
don't need [React] to write [universal] JavaScript, not even for native mobile
apps! If you're interested by the concept of [universal] JavaScript but you want
to try something different than [React] you should take a look at
[NativeScript].

### Atwood's Law

> Any application that can be written in JavaScript, will eventually be written
> in JavaScript.

See [Atom], [Visual Studio Code], [Kitematic], [ScreenCat], [Slack], and like [a
billion other applications][ae] all written in [Electron].

## What about those static types?

Ah, so you stuck around. Here are the details I promised you.

[Flow] is a TypeChecker for JavaScript. There is support for flow's syntax
built-in to [Babel] so if you are using [Babel] for compiling your ES2015+ and
JSX to ES5 and regular JavaScript it's pretty easy to drop-in. [Flow] takes
JavaScript that looks like this:

```typescript
function foo(x, y) {
  return x.length * y;
}
foo('Hello', 42); // Returns `210`
```

And makes it look like this:

```typescript
function foo(x: string, y: number): number {
  return x.length * y;
}
foo('Hello', 42); // Returns `210`
```

[Flow] can also infer types in certain cases:

```typescript
function foo(x) {
  return x * 10;
}
foo('Hello, world!'); // Error!
```

That code would cause a type error because you can't multiply a String by a
number.

[TypeScript] on the other hand is a superset of JavaScript that provides static
typing [and a whole bunch of other features][tsfeat]. The most basic example is
identical to the [Flow] code above; however, in my experince, the tooling for
[TypeScript] is a lot stronger than that for [Flow]. [Visual Studio Code] has
built-in support for [TypeScript] as does [WebStorm] (both also include
type-aware autocomplete across files). There are also plugins available for
[Atom][tsatom], [Visual Studio][tsvs], and [SublimeText][tsst].

If you want to use TypeScript and React Component hot loading you'll need to do
a little bit of extra configuration. React's hot loading depends on using
[WebPack], [Babel], and [`babel-plugin-react-transform`]. In order to get it
working with [TypeScript] you'll need to activate [TypeScript]'s `preserve` mode
which leaves JSX untransformed. From there, you can pipe its output into Babel
running your JSX transform. Your [WebPack] configuration will look something
like this:

```js
module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    loaders: [{
      test: /\.tsx?/,
      loaders: ['babel', 'ts']
    }]
  }
}
```

From there you'll want to configure [Babel] with a `.babelrc` file and
[TypeScript] with a `tsconfig.json` file, making sure to `preserve` JSX so
[Babel] can transform it. This post is intended to be more about the *why* than
the *how* so I'm going to leave it there for now. I might visit this topic again
in the future.

## Okay, I'm convinced. But *how* do I learn JavaScript in 2016?

That's a good question; however, it is outside the scope of this blog post. That
question will probably be addressed another time in its own post. In the mean
time, you should check out the following resources:

* [Removing User Interface Complexity, or Why React is Awesome][ria]
* [Dan Abramov's video series on getting started with Redux][gaeron-series]
* [Lerna] -- for managing [monorepo]s which are useful for organizing your
  server, client, and mobile apps.
* [Sharing Code Between React Web and Native Apps][sharing-code]
* [Sound Redux Website][sr-web] and [source code][sr-src] -- an open source SoundCloud client written in [React] and [Redux].
* [Awesome JavaScript]
* [Awesome React]
* [Awesome React Native]
* [Awesome Redux]
* [Este.js] -- a dev stack and starter kit for functional and universal (browser, server, mobile) React apps.

## [JavaScript Fatigue]?

Eric Clemmons recently wrote an article entitled [JavaScript Fatigue]. It
details what I know a lot of people go through. There are just so many things
going on in the JavaScript ecosystem. Where do you even start? I get it. So
here's a list of, given all of my current knowledge of JavaScript and its
ecosystem, and no specific knowledge of what it is you're trying to achieve, all
the tools and libraries I would use to start a new project:

* Libraries
  * [React] and / or [React Native] for writing your interface.
  * [Redux] for managing your application state.
  * [React Router] \(if you need routing).
* Testing
  * [Mocha] for your test-running framework. Use the
    [`--compilers js:babel-register`][mochaflag] option so you don't have to
    pre-compile your code.
  * [Enzyme] for testing React components in Node without the need for a
    [full DOM][jsdom].
  * [`chai`] for assertions and [`chai-enzyme`] for assertions on
    [Enzyme]-rendered [React] components.
  * [Sinon] \(if you need mocks, spies, and whatnot).
* Tools
  * [Babel] for compiling ES2015+ and JSX code. Also enables [hot-loading UI
    components through transforms][`babel-plugin-react-transform`].
  * [WebPack] for assembling your client packages. Also enables hot-loading UI
    components and application logic through its [hot-module-replacement
    system][webpack-hmr]. Also packs up your CSS (SASS, LESS, Stylus, PostCSS,
    whatever) and a whole bunch of other stuff.
  * [ESLint] for making sure you avoid code-smells and adhere to a consistent
    code style. I personally use [AirBnb's ESLint Config][airbnb] because it is
    comprehensive and popular enough to be consistent with a lot of other
    projects. It also includes rules for JSX.
  * [EditorConfig] so everyone's editors can have the same formatting settings.
  * [Atom] as my text editor of choice.
    * [`linter`] and [`linter-eslint`] for ESLint integration in Atom.
    * [`atom-ternjs`] for JavaScript code intelligence in Atom.
    * [`autocomplete-modules`] and [`autocomplete-paths`] for extended
      autocomplete capabilities in Atom.
    * [`define-jump`] to jump to variable definitions in Atom.
    * [`emmet`] for quickly writing JSX.
    * [`language-babel`] for syntax support for ES2015+ and JSX.
    * [`activate-power-mode`] for awesome.
  * [Lerna] for managing a [monorepo] of all of your projects and their
  interdependencies.

I'm not a huge fan of boilerplates, but you can find some good starting points
at [Awesome React], [Awesome Redux], and [Awesome React Native].

## Conclusion

JavaScript has come a *long* way since the early web days. If you haven't
checked it out recently you really owe it to yourself to do so. 2015 alone was a
**huge** year for JavaScript. Between [React], [Babel], [ES2015]
standardization, and proposals for the future, JavaScript is no longer just that
little toy language you've used for click handlers and the occasional HTTP
request.

<small><sup>1, 2</sup> Or something like that.</small>

[`activate-power-mode`]: https://atom.io/packages/activate-power-mode
[`atom-ternjs`]: https://atom.io/packages/atom-ternjs
[`autocomplete-modules`]: https://atom.io/packages/autocomplete-modules
[`autocomplete-paths`]: https://atom.io/packages/autocomplete-paths
[`babel-plugin-react-transform`]: https://github.com/gaearon/babel-plugin-react-transform
[`chai`]: http://chaijs.com/ "Chai Assertion Library"
[`chai-enzyme`]: https://github.com/producthunt/chai-enzyme "Chai.js assertions and convenience functions for testing React Components with enzyme"
[`define-jump`]: https://atom.io/packages/define-jump
[`emmet`]: https://atom.io/packages/emmet
[`fetch`]: https://developers.google.com/web/updates/2015/03/introduction-to-fetch?hl=en "Introduction to fetch()"
[`language-babel`]: https://atom.io/packages/language-babel
[`linter-eslint`]: https://atom.io/packages/linter-eslint
[`linter`]: https://atom.io/packages/linter
[`virtual-dom`]: https://github.com/Matt-Esch/virtual-dom "A JavaScript DOM model supporting element creation, diff computation and patch operations for efficient re-rendering."
[`WebSocket`]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket "Full-Duplex Communication for the Browser"
[`XMLHttpRequest`]: https://en.wikipedia.org/wiki/XMLHttpRequest "XHR: The Beginnings of AJAX"
[1,000,000]: http://blog.caustik.com/2012/08/19/node-js-w1m-concurrent-connections/ "Node.js w/1M concurrent connections!"
[100,000]: http://blog.caustik.com/2012/04/08/scaling-node-js-to-100k-concurrent-connections/ "Scaling node.js to 100k concurrent connections!"
[250,000]: http://blog.caustik.com/2012/04/10/node-js-w250k-concurrent-connections/ "Node.js w/250k concurrent connections!"
[ae]: https://github.com/sindresorhus/awesome-electron "Useful resources for creating apps with Electron"
[airbnb]: https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb "This package provides Airbnb's .eslintrc as an extensible shared config."
[Atom]: https://atom.io/ "A hackable text editor for the 21st Century"
[Awesome JavaScript]: https://github.com/sorrycc/awesome-javascript "A collection of awesome browser-side JavaScript libraries, resources and shiny things."
[Awesome React Native]: https://github.com/jondot/awesome-react-native "A curated list of awesome articles, tutorials and resources dealing with React Native."
[Awesome React]: https://github.com/enaqx/awesome-react "A Collection of Awesome Things Regarding React Ecosystem"
[Awesome Redux]: https://github.com/xgrommx/awesome-redux "Awesome List of Redux Examples and Middleware"
[Awesome Vue]: https://github.com/vuejs/awesome-vue "A curated list of awesome things related to Vue.js"
[Babel]: http://babeljs.io/ "Babel: The Compiler for Writing Next-Generation JavaScript"
[bwrn]: https://facebook.github.io/react-native/showcase.html "Apps using React Native"
[edge-pr]: https://github.com/nodejs/node/pull/4765 "Enable Node.js to run with Microsoft's ChakraCore engine"
[EditorConfig]: http://editorconfig.org/ "EditorConfig helps developers define and maintain consistent coding styles between different editors and IDEs"
[Electron]: http://electron.atom.io/ "Electron: Build cross platform desktop apps with web technologies"
[Enzyme]: https://github.com/airbnb/enzyme "Enzyme is a JavaScript Testing utility for React that makes it easier to assert, manipulate, and traverse your React Components' output."
[ES2015]: https://babeljs.io/docs/learn-es2015/ "Learn ES2015"
[ESLint]: http://eslint.org/ "ESLint: A pluggable linting utility for JavaScript."
[Este.js]: https://github.com/este/este "Este.js: A dev stack and starter kit for functional and universal (browser, server, mobile) React apps."
[Flow]: http://flowtype.org/ "Flow: TypeChecker for JavaScript"
[gaeron-series]: https://egghead.io/series/getting-started-with-redux "Getting Started With Redux"
[gaeron-talk]: https://www.youtube.com/watch?v=xsSnOQynTHs "Dan Abramov - Live React: Hot Reloading with Time Travel at react-europe 2015"
[Haskell]: https://www.youtube.com/watch?v=RqvCNb7fKsg "Why Haskell is Great"
[JavaScript Fatigue]: https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4#.j1fdmx7ta
[jdk]: http://jkaufman.io "Jon Kaufman"
[jsdom]: https://github.com/tmpvar/jsdom "A JavaScript implementation of the WHATWG DOM and HTML standards, for use with Node.js."
[Kitematic]: https://kitematic.com/ "Run docker containers through a simple, yet powerful graphical user interface"
[lerna]: https://github.com/kittens/lerna "Lerna: A tool for managing JavaScript projects with multiple packages."
[lodash]: https://lodash.com/ "A modern JavaScript utility library delivering modularity, performance, & extras."
[mc]: http://www.modulecounts.com/ "Module Counts"
[mochaflag]: http://babeljs.io/docs/setup/#mocha "Babel Integration with Mocha"
[Mocha]: https://mochajs.org/ "Mocha is a feature-rich JavaScript test framework running on Node.js and the browser, making asynchronous testing simple and fun."
[monorepo]: http://danluu.com/monorepo/ "Advantages of monolithic version control"
[NativeScript]: https://www.nativescript.org/ "Build truly native apps with JavaScript"
[NPM]: https://www.npmjs.com/ "npm is the package manager for javascript."
[Rambda]: http://ramdajs.com/ "A practical functional library for Javascript programmers."
[React Native]: https://facebook.github.io/react-native/ "React Native: A Framework For Building Native Apps with React"
[React Router]: https://github.com/rackt/react-router "A complete routing solution for React.js"
[React]: https://facebook.github.io/react/ "React"
[Redux]: http://redux.js.org/ "Redux: A predictable state container for JavaScript apps."
[ria]: http://jlongster.com/Removing-User-Interface-Complexity,-or-Why-React-is-Awesome "Removing User Interface Complexity, or Why React is Awesome"
[RxJS]: https://github.com/Reactive-Extensions/RxJS "The Reactive Extensions for JavaScript"
[ScreenCat]: https://github.com/maxogden/screencat "ScreenCat: An open source screen sharing and remote collaboration application."
[sharing-code]: http://jkaufman.io/react-web-native-codesharing/ "Sharing Code Between React Web and Native Apps"
[Sinon]: http://sinonjs.org/ "Standalone test spies, stubs and mocks for JavaScript."
[Slack]: https://slack.com/ "A messaging app for teams who are changing the world."
[SPA]: https://en.wikipedia.org/wiki/Single-page_application "Single-Page Application"
[sr-src]: https://github.com/andrewngu/sound-redux "Sound Redux Source Code"
[sr-web]: https://soundredux.io/ "Sound Redux"
[tsatom]: https://atom.io/packages/atom-typescript "Atom TypeScript Package"
[tsfeat]: https://en.wikipedia.org/wiki/TypeScript#Language_features "TypeScript Language Features"
[tsjsx]: https://github.com/Microsoft/TypeScript/wiki/JSX "JSX in TypeScript"
[tsst]: https://github.com/Microsoft/TypeScript-Sublime-Plugin "TypeScript Sublime Text Plugin"
[tsvs]: https://www.microsoft.com/en-us/download/details.aspx?id=48593 "TypeScript for Visual Studio"
[TypeScript]: http://www.typescriptlang.org/ "TypeScript: A typed superset of JavaScript that compiles to plain JavaScript."
[Universal]: https://medium.com/@mjackson/universal-javascript-4761051b7ae9#.bv8a2ech9 "Universal JavaScript"
[vdom]: https://facebook.github.io/react/docs/glossary.html "React (Virtual) DOM Terminology"
[Visual Studio Code]: https://code.visualstudio.com/ "Build and debug modern web and cloud applications."
[Vue.js]: http://vuejs.org/ "Reactive Components for Modern Web Interfaces"
[webpack-hmr]: http://webpack.github.io/docs/hot-module-replacement-with-webpack.html
[WebPack]: http://webpack.github.io/ "WebPack Module Builder"
[WebStorm]: https://www.jetbrains.com/webstorm/ "WebStorm"
[Yolk]: https://github.com/garbles/yolk "A library for building asynchronous user interfaces."

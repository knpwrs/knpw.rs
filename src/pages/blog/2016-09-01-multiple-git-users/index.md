---
title: "Quick Tip: Multiple User Configs with Git"
date: "2016-09-01"
path: /blog/multiple-git-users
tags: git, quick tip
layout: post
---

On my personal laptop I often write code for multiple organizations as well as
my own personal projects. Being the git neat freak I am sometimes I prefer to
use different user configurations in git depending on what project I'm working
on (e.g., personal projects might use my email address here at `knpw.rs`
whereas non-personal projects might use a different email address).  The
solution for a small number of projects is simple: just use `git config` to set
local user configuration for a given repo. However, that breaks down very
easily. For instance, sometimes I would clone down a repo just to make a quick
change and I would forget to set local user configuration. A quick Google
search revealed that [I'm not alone][Stack Overflow]. What follows is my
solution to make using multiple users in git easy and convenient.

## Authorship With Environment Variables

A look around the [git docs] shows that you can set the name and email for a
commit through environment variables. For instance:

```sh
$ export GIT_AUTHOR_NAME="Foo Barrington"
$ export GIT_AUTHOR_EMAIL="bears@banana.dev"
$ git commit -am "Foo"
[master b51714c] Foo
 Author: Foo Barrington <bears@banana.dev>
 1 file changed, 21 insertions(+)
```

`GIT_AUTHOR_NAME` and `GIT_AUTHOR_EMAIL` are now set for that shell session.
All commits until the shell exits  will use the name `Foo Barrington` and the
email `bears@banana.dev` for their user configuration. What we need is a way to
make sure we always have these variables set for a given set of projects.

## Introducing [`direnv`]

[`direnv`] describes itself as an environment switcher for the shell. If you've
ever used tools like [`rvm`] then you're already familiar with the concept.
Essentially it lets you change your environment variables depending on what
your current working directory is. Unlike [`rvm`], it's just a small, static
binary with no external dependencies and it is language-agnostic.

### Part One: Installation and Setup

On macOS installation is simple enough with [Homebrew]:

```sh
$ brew install direnv
```

Installation for other platforms (or from source) is covered on the [`direnv`]
website.

You will also need to set it up to hook in to your shell. For `zsh`, I have the
following in my `.zshrc`:

```sh
# Load direnv
if hash direnv 2>/dev/null; then
  eval "$(direnv hook zsh)"
fi
```

Because I use [my dotfiles] on multiple machines I check to make sure
[`direnv`] is installed before attempting to hook it into the shell.
Documentation for other shells is available on the [`direnv`] website, though
it's very similar.

Now that you have [`direnv`] setup you can create `.envrc` files that export
variables. For our purposes we can create a `.envrc` file with the following
contents:

```sh
export GIT_AUTHOR_NAME="Foo Barrington"
export GIT_AUTHOR_EMAIL="bears@banana.dev"
export GIT_COMMITTER_NAME="Foo Barrington"
export GIT_COMMITTER_EMAIL="bears@banana.dev"
```

Now whenever we change in to this directory, *or any directory underneath this
directory*, those environment variables will be set. Note that the first time
you encounter any given `.envrc` file [`direnv`] will ask you to whitelist the
file.

```
direnv: error .envrc is blocked. Run `direnv allow` to approve its content.
```

This is a security feature. Essentially since [`direnv`] is just executing
arbitrary code it wants to make sure that you are aware of what is going on in
your shell. That way if you clone down a project that contains a `.envrc` file
you won't just be blindly executing code whenever you enter the project.

Also note that when you enter a directory that contains a `.envrc` file (or a
sub-directory as previously noted) you will get a little notice indicating that
you have new variables in your shell:

```sh
direnv: loading .envrc
direnv: export +GIT_AUTHOR_EMAIL +GIT_AUTHOR_NAME +GIT_COMMITTER_EMAIL +GIT_COMMITTER_NAME
```

Let's whitelist that `.envrc` file, initialize a new git repository, and make
an initial commit:

```sh
$ direnv allow
direnv: loading .envrc
direnv: export +GIT_AUTHOR_EMAIL +GIT_AUTHOR_NAME +GIT_COMMITTER_EMAIL +GIT_COMMITTER_NAME
$ git init foo
Initialized empty Git repository in /Users/kpowers/Workspace/tmp/foo/.git/
$ cd foo
$ echo "# foo" > README.md
$ git add README.md
$ git commit -m "Initial commit."
[master (root-commit) 9a31ade] Initial commit.
 Author: Foo Barrington <bears@banana.dev>
 1 file changed, 1 insertion(+)
 create mode 100644 README.md
```

Looks like we're in business!

### Part Two: Workspace Structure

The a-ha moment is that the `.envrc` file cascades to deeper directories. The
trick to get this working the way we want relies on structuring your workspace
in a certain way. In my home directory I have a workspace directory that looks
like the following:

```
workspace
├── git.my.org
│   ├── .envrc       # User configuration when I'm working on my.org.
│   └── team
│       ├── proj1
│       ├── proj2
│       └── proj3
└── github.com
    └── knpwrs
        ├── .envrc   # User configuration when I'm working on my personal projects.
        ├── proj1
        ├── proj2
        └── proj3
```

Essentially I can set user configuration on a per-subtree basis rather than
a per-repo basis. It doesn't matter where in the tree the `.envrc` files are
located, as long as relevant projects are kept at the same level or lower in
the directory tree.

## For the Gophers

If you are a Go developer you might already be [using direnv to manage your
`GOPATH`][gopath]. To implement what I am writing about here you would have a
`.envrc` in the root of your workspace for `GOPATH` (and probably `PATH`, for
that matter) and then you may want individual `.envrc` files for packages or
organizations:

```
.
├── .envrc               # Go workspace configuration (GOPATH, etc).
├── bin
├── pkg
└── src
    └── github.com
        ├── knpwrs
        │   ├── .envrc   # Git user configuration for knpwrs.
        │   └── proj1
        ├── mattn
        └── nsf
```

But there's a problem! By default [`direnv`] will only use the closest `.envrc`
file. What we want is to combine the root `.envrc` with the project or
organization `.envrc` so we can have our `GOPATH` and `PATH` correct but still
have granual authorship configuration. Fortunately, [`direnv`] has a mechanism
for this:

```sh
source_up
export GIT_AUTHOR_NAME="Foo Barrington"
export GIT_AUTHOR_EMAIL="bears@banana.dev"
```

`source_up` is a command in [`direnv-stdlib`] which looks for `.envrc` files in
parent directories. Now whenever I am working inside of `src/github.com/knwprs`
I will be known as `Foo Barrington <bears@banana.dev>` and my `GOPATH` and
`PATH` variables will be properly set up. Sweet!

## My Original (Failed) Idea

I thought that `.gitconfig` might be able to cascade much like `.gitignore`
does inside a repo (or rather, I was hoping it would scan up through the
directory tree and apply settings from any `.gitconfig` files it finds, much
like `source_up` in [`direnv`]).  Essentially instead of creating `.envrc`
files I would create `.gitconfig` files. Unfortunately git doesn't work this
way. It checks for config in three places: `.git/config`, `~/.gitconfig`, and
`$(prefix)/etc/gitconfig`. For more information, see [`git-config`].

## Conclusion

The problem may seem a little convoluted at first (I was internally debating
whether or not to even write this) but the existence of that [Stack Overflow]
thread shows that I'm not alone in my desire for easily switching user
configuration in git. Unfortunately my original idea of just using `.gitconfig`
files didn't work and so I had to introduce an external tool to solve the
problem. That said, [`direnv`] is very useful on its own outside of this
context anyway (like for `GOPATH`), so I'm happy to have it installed.

[Homebrew]: http://brew.sh/ "Homebrew"
[Stack Overflow]: http://stackoverflow.com/questions/4220416/can-i-specify-multiple-users-for-myself-in-gitconfig "Stack Overflow: Can I specify multiple users for myself in .gitconfig?"
[`direnv-stdlib`]: http://direnv.net/#man/direnv-stdlib.1 "direnv-stdlib.1"
[`direnv`]: http://direnv.net/ "direnv"
[`git-config`]: https://git-scm.com/docs/git-config "git-config"
[`rvm`]: http://rmv.io/ "rvm"
[git docs]: https://git-scm.com/book/en/v2/Git-Internals-Environment-Variables#Committing "Git Internals: Environment Variables"
[gopath]: http://tammersaleh.com/posts/manage-your-gopath-with-direnv/ "Manage Your GOPATH with direnv"
[my dotfiles]: https://github.com/knpwrs/dotfiles

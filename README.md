# Inspiration
This idea of this project came up after I read
[this](https://github.com/blog/818-github-reflog-v1-3-21) github blog post.
The [CLI Ruby Script](https://github.com/drbrain/meme) for generating memes
caught my attention but being an Ubuntu user, I couldn't get ruby to work
properly or even gem to compile native extensions. After wasting 1h30 of
my time, installing emacs without my knowledge, and ripping out my grub
when apt-get removing ruby, I decided to rewrite it so that I can one day
make it work. My favourite toy at the moment is [node.js](http://github.com/joyent/node).

So my bet is to rewrite this in less than 150 lines and to be able to
actually run it easily ; node.js as very few dependencies and 
[npm](http://npmjs.org) is just the best (easy when compared to gem)

# Description
Big Thanks to [drbrain](http://github.com/drbrain) and contributors to
[meme](http://github.com/drbrain/meme) from whom I took everything that
works.

Generate meme images using http://memegenerator.net!  Save yourself some time!

# Features/Problems
* Features many popular memes
* no tests

# Example
Generate a Y U NO meme:
	$ meme Y_U_NO 'write tests?'

See a list of available generators:
	$ meme --list

Get the url to the online interface for a given meme
    $ meme view P_HERE_THERE

# Requirements
* [node](http://nodejs.org)
* [npm](http://npmjs.org) is a big plus. It will make your life bearable

# Install

## Winners' way
	$ npm install meme

*/!\ DEPRECATED I am no longer the owner of the meme package on npm. This won't be what you're looking for /!\*

## Losers' way
	$ git clone https://github.com/floby/node-meme
	$ cd node-meme

# License
The MIT License

Copyright (c) <2011> <Florent Jaby>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.




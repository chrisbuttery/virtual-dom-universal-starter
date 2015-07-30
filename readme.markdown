# virtual-dom-universal-starter

bare-bones [virtual-dom](https://npmjs.com/package/virtual-dom) starter
for universal (node+browser) routing and rendering

using [main-loop](https://npmjs.com/package/main-loop),
[routes](https://npmjs.com/package/routes),
[single-page](https://npmjs.com/package/single-page),
[catch-links](https://npmjs.com/package/catch-links),
and [browserify](http://browserify.org)/[watchify](https://npmjs.com/package/watchify)
with [npm run scripts](http://substack.net/task_automation_with_npm_run)

# quick start

```
$ npm install
$ npm run watch &
$ npm start
```

# commands

* `npm run build` - build js for production
* `npm run watch` - automatically build js on file changes for development
* `npm start` - start a development server

# starter code

## browser code

``` js
var h = require('virtual-dom/h')
var xtend = require('xtend')

var main = require('main-loop')
var state = {
  path: location.pathname
}
var router = require('./router.js')
var loop = main(state, render, require('virtual-dom'))
var target = document.querySelector('#content')
target.parentNode.replaceChild(loop.target, target)

var show = require('single-page')(function (href) {
  loop.update(xtend({ path: href }))
})
require('catch-links')(window, show)

function render (state) {
  var m = router.match(state.path)
  if (!m) return h('div.error', 'not found')
  else return m.fn(xtend(m, { state: state }))
}
```

## server code

``` js
var fs = require('fs')
var path = require('path')
var xtend = require('xtend')
var hyperstream = require('hyperstream')

var ecstatic = require('ecstatic')
var st = ecstatic(path.join(__dirname, 'public'))
var createElement = require('virtual-dom/create-element')

var http = require('http')
var router = require('./router.js')

var server = http.createServer(function (req, res) {
  var state = { path: req.url }
  var m = router.match(req.url)
  if (m) {
    var elem = createElement(m.fn(xtend(m, { state: state })))
    read('index.html').pipe(hyperstream({
      '#content': elem.toString()
    })).pipe(res)
  }
  else st(req, res)
})
server.listen(8000)

function read (x) {
  return fs.createReadStream(path.join(__dirname, 'public', x))
}
```

## shared routing code

``` js
var h = require('virtual-dom/h')
var router = require('routes')()
module.exports = router

router.addRoute('/', function (m) {
  return layout(m.state, h('div', 'welcome!'))
})

router.addRoute('/wow', function (m) {
  return layout(m.state, h('div', 'wowsers!'))
})

router.addRoute('/amaze', function (m) {
  return layout(m.state, h('div', [
    h('div', 'such universal javascript!'),
    h('div', 'very client server')
  ]))
})

function layout (state, page) {
  var links = [ '/', '/wow', '/amaze' ]
  var titles = {
    '/': 'home',
    '/wow': 'wow',
    '/amaze': 'amaze'
  }
  return h('div', [
    h('h1', titles[state.path]),
    h('div.links', links.map(function (href) {
      return h(
        'a' + (state.path === href ? '.active' : ''),
        { href: href },
        titles[href]
      )
    })),
    page
  ])
}
```

# contributing

If you like what you see, but want to add something more, fork this repo and add
your additional feature to the name of the fork. Try to be specific with the
name of your fork, listing the technologies used plus what features the fork
adds.

# variations

Check out the [list of forks](https://github.com/substack/virtual-dom-starter/network/members)
to see how other people have customized this starter repo.

# license

This software is released into the public domain.

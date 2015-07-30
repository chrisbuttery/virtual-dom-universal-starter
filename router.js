var h = require('virtual-dom/h')
var router = require('routes')()
module.exports = router

router.addRoute('/', function (m) {
  return layout(h('div', 'welcome!'))
})

router.addRoute('/wow', function (m) {
  return layout(h('div', 'wowsers!'))
})

router.addRoute('/amaze', function (m) {
  return layout(h('div', [
    h('div', 'such universal javascript!'),
    h('div', 'very client server')
  ]))
})

function layout (page) {
  return h('div', [
    h('h1', 'universal routing demo'),
    h('div.links', [
      h('a', { href: '/' }, 'home'),
      h('a', { href: '/wow' }, 'wow'),
      h('a', { href: '/amaze' }, 'amaze')
    ]),
    page
  ])
}

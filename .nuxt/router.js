import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _0a1b9f76 = () => interopDefault(import('..\\pages\\ComponentLesson.vue' /* webpackChunkName: "pages/ComponentLesson" */))
const _1a23242a = () => interopDefault(import('..\\pages\\inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _809ca7bc = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _319d779f = () => interopDefault(import('..\\pages\\planets\\_id.vue' /* webpackChunkName: "pages/planets/_id" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/ComponentLesson",
    component: _0a1b9f76,
    name: "ComponentLesson"
  }, {
    path: "/inspire",
    component: _1a23242a,
    name: "inspire"
  }, {
    path: "/",
    component: _809ca7bc,
    name: "index"
  }, {
    path: "/planets/:id?",
    component: _319d779f,
    name: "planets-id"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}

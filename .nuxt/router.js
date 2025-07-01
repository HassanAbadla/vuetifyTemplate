import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _2f1a36aa = () => interopDefault(import('..\\pages\\ComponentLesson.vue' /* webpackChunkName: "pages/ComponentLesson" */))
const _0d799e90 = () => interopDefault(import('..\\pages\\inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _612ca724 = () => interopDefault(import('..\\pages\\products\\index.vue' /* webpackChunkName: "pages/products/index" */))
const _130f8808 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _7d5ce60e = () => interopDefault(import('..\\pages\\planets\\_id.vue' /* webpackChunkName: "pages/planets/_id" */))

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
    component: _2f1a36aa,
    name: "ComponentLesson"
  }, {
    path: "/inspire",
    component: _0d799e90,
    name: "inspire"
  }, {
    path: "/products",
    component: _612ca724,
    name: "products"
  }, {
    path: "/",
    component: _130f8808,
    name: "index"
  }, {
    path: "/planets/:id?",
    component: _7d5ce60e,
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

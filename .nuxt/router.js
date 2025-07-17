import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _c519aeb8 = () => interopDefault(import('..\\pages\\ComponentLesson.vue' /* webpackChunkName: "pages/ComponentLesson" */))
const _76f5eb89 = () => interopDefault(import('..\\pages\\inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _7a06817e = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _3e8b73a0 = () => interopDefault(import('..\\pages\\planets\\_id.vue' /* webpackChunkName: "pages/planets/_id" */))

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
    component: _c519aeb8,
    name: "ComponentLesson"
  }, {
    path: "/inspire",
    component: _76f5eb89,
    name: "inspire"
  }, {
    path: "/",
    component: _7a06817e,
    name: "index"
  }, {
    path: "/planets/:id?",
    component: _3e8b73a0,
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

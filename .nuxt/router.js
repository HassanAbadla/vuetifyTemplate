import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _c5b5b880 = () => interopDefault(import('../pages/Aorder.vue' /* webpackChunkName: "pages/Aorder" */))
const _74a6aef2 = () => interopDefault(import('../pages/ComponentLesson.vue' /* webpackChunkName: "pages/ComponentLesson" */))
const _a9c6aa9e = () => interopDefault(import('../pages/food.vue' /* webpackChunkName: "pages/food" */))
const _bf78c052 = () => interopDefault(import('../pages/inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _69e7e10a = () => interopDefault(import('../pages/orders/index.vue' /* webpackChunkName: "pages/orders/index" */))
const _067e0d4a = () => interopDefault(import('../pages/Orders2.vue' /* webpackChunkName: "pages/Orders2" */))
const _c0faaf0c = () => interopDefault(import('../pages/products/index.vue' /* webpackChunkName: "pages/products/index" */))
const _65b1a1e2 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))
const _994a2ffa = () => interopDefault(import('../pages/planets/_id.vue' /* webpackChunkName: "pages/planets/_id" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/Aorder",
    component: _c5b5b880,
    name: "Aorder"
  }, {
    path: "/ComponentLesson",
    component: _74a6aef2,
    name: "ComponentLesson"
  }, {
    path: "/food",
    component: _a9c6aa9e,
    name: "food"
  }, {
    path: "/inspire",
    component: _bf78c052,
    name: "inspire"
  }, {
    path: "/orders",
    component: _69e7e10a,
    name: "orders"
  }, {
    path: "/Orders2",
    component: _067e0d4a,
    name: "Orders2"
  }, {
    path: "/products",
    component: _c0faaf0c,
    name: "products"
  }, {
    path: "/",
    component: _65b1a1e2,
    name: "index"
  }, {
    path: "/planets/:id?",
    component: _994a2ffa,
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

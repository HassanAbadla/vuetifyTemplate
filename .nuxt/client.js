import Vue from 'vue'
import fetch from 'unfetch'
import middleware from './middleware.js'
import {
  applyAsyncData,
  promisify,
  middlewareSeries,
  sanitizeComponent,
  resolveRouteComponents,
  getMatchedComponents,
  getMatchedComponentsInstances,
  flatMapComponents,
  setContext,
  getLocation,
  compile,
  getQueryDiff,
  globalHandleError,
  isSamePath,
  urlJoin
} from './utils.js'
import { createApp, NuxtError } from './index.js'
import fetchMixin from './mixins/fetch.client'
import NuxtLink from './components/nuxt-link.client.js' // should be included after ./index.js

// Fetch mixin
if (!Vue.__nuxt__fetch__mixin__) {
  Vue.mixin(fetchMixin)
  Vue.__nuxt__fetch__mixin__ = true
}

// Component: <NuxtLink>
Vue.component(NuxtLink.name, NuxtLink)
Vue.component('NLink', NuxtLink)

if (!global.fetch) { global.fetch = fetch }

// Global shared references
let _lastPaths = []
let app
let router
let store

// Try to rehydrate SSR data from window
const NUXT = window.__NUXT__ || {}

const $config = NUXT.config || {}
if ($config._app) {
  __webpack_public_path__ = urlJoin($config._app.cdnURL, $config._app.assetsPath)
}

Object.assign(Vue.config, {"silent":false,"performance":true})

const logs = NUXT.logs || []
  if (logs.length > 0) {
  const ssrLogStyle = 'background: #2E495E;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 0.5em;'
  console.group && console.group ('%cNuxt SSR', ssrLogStyle)
  logs.forEach(logObj => (console[logObj.type] || console.log)(...logObj.args))
  delete NUXT.logs
  console.groupEnd && console.groupEnd()
}

// Setup global Vue error handler
if (!Vue.config.$nuxt) {
  const defaultErrorHandler = Vue.config.errorHandler
  Vue.config.errorHandler = async (err, vm, info, ...rest) => {
    // Call other handler if exist
    let handled = null
    if (typeof defaultErrorHandler === 'function') {
      handled = defaultErrorHandler(err, vm, info, ...rest)
    }
    if (handled === true) {
      return handled
    }

    if (vm && vm.$root) {
      const nuxtApp = Object.keys(Vue.config.$nuxt)
        .find(nuxtInstance => vm.$root[nuxtInstance])

      // Show Nuxt Error Page
      if (nuxtApp && vm.$root[nuxtApp].error && info !== 'render function') {
        const currentApp = vm.$root[nuxtApp]

        // Load error layout
        let layout = (NuxtError.options || NuxtError).layout
        if (typeof layout === 'function') {
          layout = layout(currentApp.context)
        }
        if (layout) {
          await currentApp.loadLayout(layout).catch(() => {})
        }
        currentApp.setLayout(layout)

        currentApp.error(err)
      }
    }

    if (typeof defaultErrorHandler === 'function') {
      return handled
    }

    // Log to console
    if (process.env.NODE_ENV !== 'production') {
      console.error(err)
    } else {
      console.error(err.message || err)
    }
  }
  Vue.config.$nuxt = {}
}
Vue.config.$nuxt.$nuxt = true

const errorHandler = Vue.config.errorHandler || console.error

// Create and mount App
createApp(null, NUXT.config).then(mountApp).catch(errorHandler)

function componentOption (component, key, ...args) {
  if (!component || !component.options || !component.options[key]) {
    return {}
  }
  const option = component.options[key]
  if (typeof option === 'function') {
    return option(...args)
  }
  return option
}

function mapTransitions (toComponents, to, from) {
  const componentTransitions = (component) => {
    const transition = componentOption(component, 'transition', to, from) || {}
    return (typeof transition === 'string' ? { name: transition } : transition)
  }

  const fromComponents = from ? getMatchedComponents(from) : []
  const maxDepth = Math.max(toComponents.length, fromComponents.length)

  const mergedTransitions = []
  for (let i=0; i<maxDepth; i++) {
    // Clone original objects to prevent overrides
    const toTransitions = Object.assign({}, componentTransitions(toComponents[i]))
    const transitions = Object.assign({}, componentTransitions(fromComponents[i]))

    // Combine transitions & prefer `leave` properties of "from" route
    Object.keys(toTransitions)
        .filter(key => typeof toTransitions[key] !== 'undefined' && !key.toLowerCase().includes('leave'))
        .forEach((key) => { transitions[key] = toTransitions[key] })

    mergedTransitions.push(transitions)
  }
  return mergedTransitions
}

async function loadAsyncComponents (to, from, next) {
  // Check if route changed (this._routeChanged), only if the page is not an error (for validate())
  this._routeChanged = Boolean(app.nuxt.err) || from.name !== to.name
  this._paramChanged = !this._routeChanged && from.path !== to.path
  this._queryChanged = !this._paramChanged && from.fullPath !== to.fullPath
  this._diffQuery = (this._queryChanged ? getQueryDiff(to.query, from.query) : [])

  if ((this._routeChanged || this._paramChanged) && this.$loading.start && !this.$loading.manual) {
    this.$loading.start()
  }

  try {
    if (this._queryChanged) {
      const Components = await resolveRouteComponents(
        to,
        (Component, instance) => ({ Component, instance })
      )
      // Add a marker on each component that it needs to refresh or not
      const startLoader = Components.some(({ Component, instance }) => {
        const watchQuery = Component.options.watchQuery
        if (watchQuery === true) {
          return true
        }
        if (Array.isArray(watchQuery)) {
          return watchQuery.some(key => this._diffQuery[key])
        }
        if (typeof watchQuery === 'function') {
          return watchQuery.apply(instance, [to.query, from.query])
        }
        return false
      })

      if (startLoader && this.$loading.start && !this.$loading.manual) {
        this.$loading.start()
      }
    }
    // Call next()
    next()
  } catch (error) {
    const err = error || {}
    const statusCode = err.statusCode || err.status || (err.response && err.response.status) || 500
    const message = err.message || ''

    // Handle chunk loading errors
    // This may be due to a new deployment or a network problem
    if (/^Loading( CSS)? chunk (\d)+ failed\./.test(message)) {
      window.location.reload(true /* skip cache */)
      return // prevent error page blinking for user
    }

    this.error({ statusCode, message })
    this.$nuxt.$emit('routeChanged', to, from, err)
    next()
  }
}

function applySSRData (Component, ssrData) {
  if (NUXT.serverRendered && ssrData) {
    applyAsyncData(Component, ssrData)
  }

  Component._Ctor = Component
  return Component
}

// Get matched components
function resolveComponents (route) {
  return flatMapComponents(route, async (Component, _, match, key, index) => {
    // If component is not resolved yet, resolve it
    if (typeof Component === 'function' && !Component.options) {
      Component = await Component()
    }
    // Sanitize it and save it
    const _Component = applySSRData(sanitizeComponent(Component), NUXT.data ? NUXT.data[index] : null)
    match.components[key] = _Component
    return _Component
  })
}

function callMiddleware (Components, context, layout, renderState) {
  let midd = []
  let unknownMiddleware = false

  // If layout is undefined, only call global middleware
  if (typeof layout !== 'undefined') {
    midd = [] // Exclude global middleware if layout defined (already called before)
    layout = sanitizeComponent(layout)
    if (layout.options.middleware) {
      midd = midd.concat(layout.options.middleware)
    }
    Components.forEach((Component) => {
      if (Component.options.middleware) {
        midd = midd.concat(Component.options.middleware)
      }
    })
  }

  midd = midd.map((name) => {
    if (typeof name === 'function') {
      return name
    }
    if (typeof middleware[name] !== 'function') {
      unknownMiddleware = true
      this.error({ statusCode: 500, message: 'Unknown middleware ' + name })
    }
    return middleware[name]
  })

  if (unknownMiddleware) {
    return
  }
  return middlewareSeries(midd, context, renderState)
}

async function render (to, from, next, renderState) {
  if (this._routeChanged === false && this._paramChanged === false && this._queryChanged === false) {
    return next()
  }
  // Handle first render on SPA mode
  let spaFallback = false
  if (to === from) {
    _lastPaths = []
    spaFallback = true
  } else {
    const fromMatches = []
    _lastPaths = getMatchedComponents(from, fromMatches).map((Component, i) => {
      return compile(from.matched[fromMatches[i]].path)(from.params)
    })
  }

  // nextCalled is true when redirected
  let nextCalled = false
  const _next = (path) => {
    if (from.path === path.path && this.$loading.finish) {
      this.$loading.finish()
    }

    if (from.path !== path.path && this.$loading.pause) {
      this.$loading.pause()
    }

    if (nextCalled) {
      return
    }

    nextCalled = true
    next(path)
  }

  // Update context
  await setContext(app, {
    route: to,
    from,
    error: (err) => {
      if (renderState.aborted) {
        return
      }
      app.nuxt.error.call(this, err)
    },
    next: _next.bind(this)
  })
  this._dateLastError = app.nuxt.dateErr
  this._hadError = Boolean(app.nuxt.err)

  // Get route's matched components
  const matches = []
  const Components = getMatchedComponents(to, matches)

  // If no Components matched, generate 404
  if (!Components.length) {
    // Default layout
    await callMiddleware.call(this, Components, app.context, undefined, renderState)
    if (nextCalled) {
      return
    }
    if (renderState.aborted) {
      next(false)
      return
    }

    // Load layout for error page
    const errorLayout = (NuxtError.options || NuxtError).layout
    const layout = await this.loadLayout(
      typeof errorLayout === 'function'
        ? errorLayout.call(NuxtError, app.context)
        : errorLayout
    )

    await callMiddleware.call(this, Components, app.context, layout, renderState)
    if (nextCalled) {
      return
    }
    if (renderState.aborted) {
      next(false)
      return
    }

    // Show error page
    app.context.error({ statusCode: 404, message: 'This page could not be found' })
    return next()
  }

  // Update ._data and other properties if hot reloaded
  Components.forEach((Component) => {
    if (Component._Ctor && Component._Ctor.options) {
      Component.options.asyncData = Component._Ctor.options.asyncData
      Component.options.fetch = Component._Ctor.options.fetch
    }
  })

  // Apply transitions
  this.setTransitions(mapTransitions(Components, to, from))

  try {
    // Call middleware
    await callMiddleware.call(this, Components, app.context, undefined, renderState)
    if (nextCalled) {
      return
    }
    if (renderState.aborted) {
      next(false)
      return
    }
    if (app.context._errored) {
      return next()
    }

    // Set layout
    let layout = Components[0].options.layout
    if (typeof layout === 'function') {
      layout = layout(app.context)
    }
    layout = await this.loadLayout(layout)

    // Call middleware for layout
    await callMiddleware.call(this, Components, app.context, layout, renderState)
    if (nextCalled) {
      return
    }
    if (renderState.aborted) {
      next(false)
      return
    }
    if (app.context._errored) {
      return next()
    }

    // Call .validate()
    let isValid = true
    try {
      for (const Component of Components) {
        if (typeof Component.options.validate !== 'function') {
          continue
        }

        isValid = await Component.options.validate(app.context)

        if (!isValid) {
          break
        }
      }
    } catch (validationError) {
      // ...If .validate() threw an error
      this.error({
        statusCode: validationError.statusCode || '500',
        message: validationError.message
      })
      return next()
    }

    // ...If .validate() returned false
    if (!isValid) {
      this.error({ statusCode: 404, message: 'This page could not be found' })
      return next()
    }

    let instances
    // Call asyncData & fetch hooks on components matched by the route.
    await Promise.all(Components.map(async (Component, i) => {
      // Check if only children route changed
      Component._path = compile(to.matched[matches[i]].path)(to.params)
      Component._dataRefresh = false
      const childPathChanged = Component._path !== _lastPaths[i]
      // Refresh component (call asyncData & fetch) when:
      // Route path changed part includes current component
      // Or route param changed part includes current component and watchParam is not `false`
      // Or route query is changed and watchQuery returns `true`
      if (this._routeChanged && childPathChanged) {
        Component._dataRefresh = true
      } else if (this._paramChanged && childPathChanged) {
        const watchParam = Component.options.watchParam
        Component._dataRefresh = watchParam !== false
      } else if (this._queryChanged) {
        const watchQuery = Component.options.watchQuery
        if (watchQuery === true) {
          Component._dataRefresh = true
        } else if (Array.isArray(watchQuery)) {
          Component._dataRefresh = watchQuery.some(key => this._diffQuery[key])
        } else if (typeof watchQuery === 'function') {
          if (!instances) {
            instances = getMatchedComponentsInstances(to)
          }
          Component._dataRefresh = watchQuery.apply(instances[i], [to.query, from.query])
        }
      }
      if (!this._hadError && this._isMounted && !Component._dataRefresh) {
        return
      }

      const promises = []

      const hasAsyncData = (
        Component.options.asyncData &&
        typeof Component.options.asyncData === 'function'
      )

      const hasFetch = Boolean(Component.options.fetch) && Component.options.fetch.length

      const loadingIncrease = (hasAsyncData && hasFetch) ? 30 : 45

      // Call asyncData(context)
      if (hasAsyncData) {
        const promise = promisify(Component.options.asyncData, app.context)

        promise.then((asyncDataResult) => {
          applyAsyncData(Component, asyncDataResult)

          if (this.$loading.increase) {
            this.$loading.increase(loadingIncrease)
          }
        })
        promises.push(promise)
      }

      // Check disabled page loading
      this.$loading.manual = Component.options.loading === false

      // Call fetch(context)
      if (hasFetch) {
        let p = Component.options.fetch(app.context)
        if (!p || (!(p instanceof Promise) && (typeof p.then !== 'function'))) {
          p = Promise.resolve(p)
        }
        p.then((fetchResult) => {
          if (this.$loading.increase) {
            this.$loading.increase(loadingIncrease)
          }
        })
        promises.push(p)
      }

      return Promise.all(promises)
    }))

    // If not redirected
    if (!nextCalled) {
      if (this.$loading.finish && !this.$loading.manual) {
        this.$loading.finish()
      }

      if (renderState.aborted) {
        next(false)
        return
      }
      next()
    }
  } catch (err) {
    if (renderState.aborted) {
      next(false)
      return
    }
    const error = err || {}
    if (error.message === 'ERR_REDIRECT') {
      return this.$nuxt.$emit('routeChanged', to, from, error)
    }
    _lastPaths = []

    globalHandleError(error)

    // Load error layout
    let layout = (NuxtError.options || NuxtError).layout
    if (typeof layout === 'function') {
      layout = layout(app.context)
    }
    await this.loadLayout(layout)

    this.error(error)
    this.$nuxt.$emit('routeChanged', to, from, error)
    next()
  }
}

// Fix components format in matched, it's due to code-splitting of vue-router
function normalizeComponents (to, ___) {
  flatMapComponents(to, (Component, _, match, key) => {
    if (typeof Component === 'object' && !Component.options) {
      // Updated via vue-router resolveAsyncComponents()
      Component = Vue.extend(Component)
      Component._Ctor = Component
      match.components[key] = Component
    }
    return Component
  })
}

const routeMap = new WeakMap()
async function getLayoutForNextPage (to, from, next) {
  // Set layout
  let hasError = Boolean(this.$options.nuxt.err)
  if (this._hadError && this._dateLastError === this.$options.nuxt.dateErr) {
    hasError = false
  }
  let layout = hasError
    ? (NuxtError.options || NuxtError).layout
    : to.matched[0].components.default.options.layout

  if (typeof layout === 'function') {
    layout = layout(app.context)
  }

  routeMap.set(to, layout);

  await this.loadLayout(layout)

  if (next) next();
}

function setLayoutForNextPage(to) {
  const layout = routeMap.get(to)
  routeMap.delete(to)

  const prevPageIsError = this._hadError && this._dateLastError === this.$options.nuxt.dateErr

  if (prevPageIsError) {
    this.$options.nuxt.err = null
  }

  this.setLayout(layout)
}

function checkForErrors (app) {
  // Hide error component if no error
  if (app._hadError && app._dateLastError === app.$options.nuxt.dateErr) {
    app.error()
  }
}

// When navigating on a different route but the same component is used, Vue.js
// Will not update the instance data, so we have to update $data ourselves
function fixPrepatch (to, ___) {
  if (this._routeChanged === false && this._paramChanged === false && this._queryChanged === false) {
    return
  }

  const instances = getMatchedComponentsInstances(to)
  const Components = getMatchedComponents(to)

  let triggerScroll = false

  Vue.nextTick(() => {
    instances.forEach((instance, i) => {
      if (!instance || instance._isDestroyed) {
        return
      }

      if (
        instance.constructor._dataRefresh &&
        Components[i] === instance.constructor &&
        instance.$vnode.data.keepAlive !== true &&
        typeof instance.constructor.options.data === 'function'
      ) {
        const newData = instance.constructor.options.data.call(instance)
        for (const key in newData) {
          Vue.set(instance.$data, key, newData[key])
        }

        triggerScroll = true
      }
    })

    if (triggerScroll) {
      // Ensure to trigger scroll event after calling scrollBehavior
      window.$nuxt.$nextTick(() => {
        window.$nuxt.$emit('triggerScroll')
      })
    }

    checkForErrors(this)

    // Hot reloading
    setTimeout(() => hotReloadAPI(this), 100)
  })
}

function nuxtReady (_app) {
  window.onNuxtReadyCbs.forEach((cb) => {
    if (typeof cb === 'function') {
      cb(_app)
    }
  })
  // Special JSDOM
  if (typeof window._onNuxtLoaded === 'function') {
    window._onNuxtLoaded(_app)
  }
  // Add router hooks
  router.afterEach((to, from) => {
    // Wait for fixPrepatch + $data updates
    Vue.nextTick(() => _app.$nuxt.$emit('routeChanged', to, from))
  })
}

const noopData = () => { return {} }
const noopFetch = () => {}

// Special hot reload with asyncData(context)
function getNuxtChildComponents ($parent, $components = []) {
  $parent.$children.forEach(($child) => {
    if ($child.$vnode && $child.$vnode.data.nuxtChild && !$components.find(c =>(c.$options.__file === $child.$options.__file))) {
      $components.push($child)
    }
    if ($child.$children && $child.$children.length) {
      getNuxtChildComponents($child, $components)
    }
  })

  return $components
}

function hotReloadAPI(_app) {
  if (!module.hot) return

  let $components = getNuxtChildComponents(_app.$nuxt, [])

  $components.forEach(addHotReload.bind(_app))

  if (_app.context.isHMR) {
    const Components = getMatchedComponents(router.currentRoute)
    Components.forEach((Component) => {
      Component.prototype.constructor = Component
    })
  }
}

function addHotReload ($component, depth) {
  if ($component.$vnode.data._hasHotReload) return
  $component.$vnode.data._hasHotReload = true

  var _forceUpdate = $component.$forceUpdate.bind($component.$parent)

  $component.$vnode.context.$forceUpdate = async () => {
    let Components = getMatchedComponents(router.currentRoute)
    let Component = Components[depth]
    if (!Component) {
      return _forceUpdate()
    }
    if (typeof Component === 'object' && !Component.options) {
      // Updated via vue-router resolveAsyncComponents()
      Component = Vue.extend(Component)
      Component._Ctor = Component
    }
    this.error()
    let promises = []
    const next = function (path) {
      this.$loading.finish && this.$loading.finish()
      router.push(path)
    }
    await setContext(app, {
      route: router.currentRoute,
      isHMR: true,
      next: next.bind(this)
    })
    const context = app.context

    if (this.$loading.start && !this.$loading.manual) {
      this.$loading.start()
    }

    callMiddleware.call(this, Components, context)
    .then(() => {
      // If layout changed
      if (depth !== 0) {
        return
      }

      let layout = Component.options.layout || 'default'
      if (typeof layout === 'function') {
        layout = layout(context)
      }
      if (this.layoutName === layout) {
        return
      }
      let promise = this.loadLayout(layout)
      promise.then(() => {
        this.setLayout(layout)
        Vue.nextTick(() => hotReloadAPI(this))
      })
      return promise
    })

    .then(() => {
      return callMiddleware.call(this, Components, context, this.layout)
    })

    .then(() => {
      // Call asyncData(context)
      let pAsyncData = promisify(Component.options.asyncData || noopData, context)
      pAsyncData.then((asyncDataResult) => {
        applyAsyncData(Component, asyncDataResult)
        this.$loading.increase && this.$loading.increase(30)
      })
      promises.push(pAsyncData)

      // Call fetch()
      Component.options.fetch = Component.options.fetch || noopFetch
      let pFetch = Component.options.fetch.length && Component.options.fetch(context)
      if (!pFetch || (!(pFetch instanceof Promise) && (typeof pFetch.then !== 'function'))) { pFetch = Promise.resolve(pFetch) }
      pFetch.then(() => this.$loading.increase && this.$loading.increase(30))
      promises.push(pFetch)

      return Promise.all(promises)
    })
    .then(() => {
      this.$loading.finish && this.$loading.finish()
      _forceUpdate()
      setTimeout(() => hotReloadAPI(this), 100)
    })
  }
}

async function mountApp (__app) {
  // Set global variables
  app = __app.app
  router = __app.router
  store = __app.store

  // Create Vue instance
  const _app = new Vue(app)

  // Load layout
  const layout = NUXT.layout || 'default'
  await _app.loadLayout(layout)
  _app.setLayout(layout)

  // Mounts Vue app to DOM element
  const mount = () => {
    _app.$mount('#__nuxt')

    // Add afterEach router hooks
    router.afterEach(normalizeComponents)

    router.beforeResolve(getLayoutForNextPage.bind(_app))
    router.afterEach(setLayoutForNextPage.bind(_app))

    router.afterEach(fixPrepatch.bind(_app))

    // Listen for first Vue update
    Vue.nextTick(() => {
      // Call window.{{globals.readyCallback}} callbacks
      nuxtReady(_app)

      // Enable hot reloading
      hotReloadAPI(_app)
    })
  }

  // Resolve route components
  const Components = await Promise.all(resolveComponents(app.context.route))

  // Enable transitions
  _app.setTransitions = _app.$options.nuxt.setTransitions.bind(_app)
  if (Components.length) {
    _app.setTransitions(mapTransitions(Components, router.currentRoute))
    _lastPaths = router.currentRoute.matched.map(route => compile(route.path)(router.currentRoute.params))
  }

  // Initialize error handler
  _app.$loading = {} // To avoid error while _app.$nuxt does not exist
  if (NUXT.error) {
    _app.error(NUXT.error)
    _app.nuxt.errPageReady = true
  }

  // Add beforeEach router hooks
  router.beforeEach(loadAsyncComponents.bind(_app))

  // Each new invocation of render() aborts previous invocation
  let renderState = null
  const boundRender = render.bind(_app)
  router.beforeEach((to, from, next) => {
    if (renderState) {
      renderState.aborted = true
    }
    renderState = { aborted: false }
    boundRender(to, from, next, renderState)
  })

  // Fix in static: remove trailing slash to force hydration
  // Full static, if server-rendered: hydrate, to allow custom redirect to generated page

  // Fix in static: remove trailing slash to force hydration
  if (NUXT.serverRendered && isSamePath(NUXT.routePath, _app.context.route.path)) {
    return mount()
  }

  const clientFirstLayoutSet = async () => {
    await getLayoutForNextPage.call(_app, router.currentRoute)
    setLayoutForNextPage.call(_app, router.currentRoute)
  }

  // First render on client-side
  const clientFirstMount = () => {
    normalizeComponents(router.currentRoute, router.currentRoute)
    clientFirstLayoutSet()
    checkForErrors(_app)
    // Don't call fixPrepatch.call(_app, router.currentRoute, router.currentRoute) since it's first render
    mount()
  }

  // fix: force next tick to avoid having same timestamp when an error happen on spa fallback
  await new Promise(resolve => setTimeout(resolve, 0))
  render.call(_app, router.currentRoute, router.currentRoute, (path) => {
    // If not redirected
    if (!path) {
      clientFirstMount()
      return
    }

    // Add a one-time afterEach hook to
    // mount the app wait for redirect and route gets resolved
    const unregisterHook = router.afterEach((to, from) => {
      unregisterHook()
      clientFirstMount()
    })

    // Push the path and let route to be resolved
    router.push(path, undefined, (err) => {
      if (err) {
        errorHandler(err)
      }
    })
  },
  { aborted: false })
}

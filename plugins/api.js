// API plugin for centralized API management
export default function ({ $axios, redirect, store }) {
  // Request interceptor
  $axios.onRequest((config) => {
    console.log("Making request to " + config.url)

    // Add auth token if available
    const token = store.state.auth?.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  // Response interceptor
  $axios.onResponse((response) => {
    console.log("Response received:", response.status)
    return response
  })

  // Error interceptor
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)

    if (code === 400) {
      console.error("Bad Request")
    }

    if (code === 401) {
      console.error("Unauthorized - redirecting to login")
      // Clear auth state
      store.dispatch("auth/logout")
      redirect("/login")
    }

    if (code === 403) {
      console.error("Forbidden")
    }

    if (code === 404) {
      console.error("Not Found")
    }

    if (code >= 500) {
      console.error("Server Error")
    }

    return Promise.reject(error)
  })

  // Create API methods
  const api = {
    // GET request
    get(url, config = {}) {
      return $axios.get(url, config)
    },

    // POST request
    post(url, data = {}, config = {}) {
      return $axios.post(url, data, config)
    },

    // PUT request
    put(url, data = {}, config = {}) {
      return $axios.put(url, data, config)
    },

    // PATCH request
    patch(url, data = {}, config = {}) {
      return $axios.patch(url, data, config)
    },

    // DELETE request
    delete(url, config = {}) {
      return $axios.delete(url, config)
    },
  }

  // Inject API methods
  // eslint-disable-next-line no-undef
  inject("api", api)
}

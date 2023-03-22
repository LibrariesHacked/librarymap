export function addService (navigate, systemName) {
  const currentUrlParams = new URLSearchParams(window.location.search)
  currentUrlParams.set('service', systemName)
  navigate(window.location.pathname + '?' + currentUrlParams.toString())
}

export function clearService (navigate) {
  const currentUrlParams = new URLSearchParams(window.location.search)
  currentUrlParams.delete('service')
  navigate(window.location.pathname)
}

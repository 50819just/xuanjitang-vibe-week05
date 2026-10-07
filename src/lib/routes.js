export function normalizeRoute(path) {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//') || /[\\\r\n]/.test(path)) return '/'
  return path
}

export function parseHashRoute(hash = '') {
  const route = normalizeRoute(hash.startsWith('#/') ? hash.slice(1) : '/')
  const separator = route.indexOf('?')
  return separator < 0 ? { pathname: route, search: '' } : { pathname: route.slice(0, separator), search: route.slice(separator) }
}

export function routeHref(path) {
  return `#${normalizeRoute(path)}`
}

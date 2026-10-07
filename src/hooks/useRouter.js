import { useEffect, useState } from 'react'
import { normalizeRoute, parseHashRoute, routeHref } from '../lib/routes'

const NAVIGATE_EVENT = 'app:navigate'
const getLocation = () => parseHashRoute(window.location.hash)

export function navigateTo(path) {
  const route = normalizeRoute(path)
  if (window.location.hash === routeHref(route)) return
  window.history.pushState({}, '', routeHref(route))
  window.dispatchEvent(new Event(NAVIGATE_EVENT))
  window.scrollTo({ top: 0 })
}

export function navigateToSection(sectionId) {
  if (getLocation().pathname !== '/') {
    navigateTo('/')
    window.setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }), 80)
    return
  }
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
}

export function useRouter() {
  const [location, setLocation] = useState(getLocation)
  useEffect(() => {
    const handleChange = () => setLocation(getLocation())
    window.addEventListener('popstate', handleChange)
    window.addEventListener('hashchange', handleChange)
    window.addEventListener(NAVIGATE_EVENT, handleChange)
    return () => {
      window.removeEventListener('popstate', handleChange)
      window.removeEventListener('hashchange', handleChange)
      window.removeEventListener(NAVIGATE_EVENT, handleChange)
    }
  }, [])
  return location
}

export function useSearchParam(key) {
  return new URLSearchParams(useRouter().search).get(key)
}

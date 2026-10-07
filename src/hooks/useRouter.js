import { useEffect, useState } from 'react'

const NAVIGATE_EVENT = 'app:navigate'

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '')

function stripBasePath(pathname) {
  if (BASE_PATH && pathname.startsWith(BASE_PATH)) {
    const stripped = pathname.slice(BASE_PATH.length)
    return stripped || '/'
  }

  return pathname
}

function getLocation() {
  return {
    pathname: stripBasePath(window.location.pathname),
    search: window.location.search,
  }
}

export function navigateTo(path) {
  const current = `${stripBasePath(window.location.pathname)}${window.location.search}`

  if (path === current) {
    return
  }

  window.history.pushState({}, '', BASE_PATH + path)
  window.dispatchEvent(new Event(NAVIGATE_EVENT))
  window.scrollTo({ top: 0 })
}

export function navigateToSection(sectionId) {
  if (stripBasePath(window.location.pathname) !== '/') {
    navigateTo('/')
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    }, 80)
    return
  }

  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
}

export function useRouter() {
  const [location, setLocation] = useState(getLocation)

  useEffect(() => {
    const handleChange = () => setLocation(getLocation())
    window.addEventListener('popstate', handleChange)
    window.addEventListener(NAVIGATE_EVENT, handleChange)

    return () => {
      window.removeEventListener('popstate', handleChange)
      window.removeEventListener(NAVIGATE_EVENT, handleChange)
    }
  }, [])

  return location
}

export function useSearchParam(key) {
  const { search } = useRouter()
  return new URLSearchParams(search).get(key)
}

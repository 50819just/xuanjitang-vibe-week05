import { useEffect } from 'react'

export const DEFAULT_TITLE = '玄機堂擇日舘'

const MANAGED_META_SELECTORS = [
  'meta[name="description"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="og:type"]',
  'meta[property="og:url"]',
  'link[rel="canonical"]',
]

function resolveSiteBaseUrl() {
  const configured = import.meta.env.VITE_APP_SITE_URL

  if (configured) {
    return configured.replace(/\/$/, '')
  }

  if (typeof window === 'undefined') {
    return ''
  }

  return `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, '')}`
}

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector)

  if (!el) {
    el = document.createElement('meta')
    document.head.appendChild(el)
  }

  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value))
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)

  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }

  el.setAttribute('href', href)
  return el
}

function upsertJsonLd(id, data) {
  let el = document.head.querySelector(`script[data-seo-jsonld="${id}"]`)

  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.setAttribute('data-seo-jsonld', id)
    document.head.appendChild(el)
  }

  el.textContent = JSON.stringify(data)
}

/**
 * 為單一 route 設定 document.title、meta description、canonical、Open Graph 與
 * 選用的 JSON-LD；卸載時整批還原，避免影響未呼叫這個 hook 的頁面（例如 Booking／付款頁）。
 */
export function useDocumentHead({ title, description, path, structuredData }) {
  useEffect(() => {
    const fullTitle = title ? `${title}｜${DEFAULT_TITLE}` : DEFAULT_TITLE
    document.title = fullTitle

    if (description) {
      upsertMeta('meta[name="description"]', { name: 'description', content: description })
      upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    }

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })

    if (path) {
      const canonicalHref = `${resolveSiteBaseUrl()}/#${path}`
      upsertLink('canonical', canonicalHref)
      upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalHref })
    }

    const jsonLdIds = (structuredData || []).map((entry, index) => {
      const id = `${path || 'page'}-${index}`
      upsertJsonLd(id, entry)
      return id
    })

    return () => {
      document.title = DEFAULT_TITLE
      MANAGED_META_SELECTORS.forEach((selector) => document.head.querySelector(selector)?.remove())
      jsonLdIds.forEach((id) => document.head.querySelector(`script[data-seo-jsonld="${id}"]`)?.remove())
    }
  }, [title, description, path, structuredData])
}

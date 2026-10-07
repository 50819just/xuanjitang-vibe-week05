export const primaryNav = [
  { key: 'services', label: '服務項目', type: 'anchor', anchor: 'services' },
  { key: 'guides', label: '擇日與宅事知識', type: 'route', path: '/guides' },
  { key: 'about', label: '服務方式', type: 'route', path: '/about-service' },
  { key: 'pricing', label: '價格說明', type: 'route', path: '/pricing' },
]

export const contactNavLink = { key: 'contact', label: '聯絡我們', type: 'anchor', anchor: 'contact' }

export const footerNav = [
  { key: 'home', label: '首頁', type: 'route', path: '/' },
  ...primaryNav,
  contactNavLink,
]

export const primaryCta = { label: '開始預約', path: '/booking' }

export function getNavHref(link) {
  return link.type === 'anchor' ? `/#${link.anchor}` : link.path
}

export function isNavLinkActive(link, pathname) {
  if (link.key === 'services') {
    return pathname.startsWith('/services/')
  }

  if (link.type === 'route') {
    return pathname === link.path
  }

  return false
}

import Icon from '../ui/Icon'
import { routeHref } from '../../lib/routes'
import { assetUrl } from '../../lib/assets'
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { navigateTo, navigateToSection, useRouter } from '../../hooks/useRouter'
import { primaryNav, primaryCta, isNavLinkActive, getNavHref } from '../../data/navigation'

function handleNavClick(link) {
  if (link.type === 'anchor') {
    navigateToSection(link.anchor)
    return
  }

  navigateTo(link.path)
}

function Header() {
  const { pathname } = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const headerRef = useRef(null)
  const closeButtonRef = useRef(null)
  const menuButtonRef = useRef(null)

  // 首頁與內頁共用品牌導覽，避免測試提示上方形成灰色空帶。

  useLayoutEffect(() => {
    const header = headerRef.current
    if (!header) return undefined
    // Measure the actual header, including font changes, zoom and responsive wrapping.
    const measure = () => document.documentElement.style.setProperty('--site-header-height', `${header.getBoundingClientRect().height}px`)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    function handlePopState() {
      setIsMenuOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('popstate', handlePopState)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isMenuOpen])

  return (
    <Fragment>
      {/* backdrop-blur 會建立新的 containing block，drawer 的 fixed overlay 不能放在這個 header 裡面，
          否則 inset-0 只會貼齊 header 自己的高度，不會蓋滿整個視窗。 */}
      <header
        ref={headerRef}
        className="relative lg:fixed top-0 left-0 right-0 z-50 bg-paper/95 backdrop-blur-md border-b border-ink/10"
      >
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-[96px] py-4 md:py-5 lg:py-6 max-w-[1440px] mx-auto">
          <a
              href={routeHref('/')}
              aria-label="回到首頁"
              className="flex items-center gap-2 shrink-0"
              onClick={(event) => {
                event.preventDefault()
                navigateTo('/')
              }}
            >
              <img
                alt="玄機堂擇日舘 Logo"
                className="h-8 md:h-9 lg:h-10 w-auto opacity-80"
                src={assetUrl('branding/logo-symbol-on-light.png')}
              />
              <span className="text-style-title-lg md:text-[24px] lg:text-[26px] tracking-wide text-ink">玄機堂擇日舘</span>
          </a>

          <nav className="hidden lg:flex gap-8 xl:gap-10" aria-label="主要導覽">
            {primaryNav.map((link) => (
              <a
                key={link.key}
                href={getNavHref(link)}
                className={`text-style-body-md lg:text-[17px] xl:text-[18px] transition-colors duration-300 ${
                  isNavLinkActive(link, pathname)
                    ? 'text-vermilion border-vermilion border-b-2 pb-1'
                    : 'text-ink hover:text-vermilion'
                }`}
                onClick={(event) => {
                  event.preventDefault()
                  handleNavClick(link)
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
              <a
                href={routeHref('/booking')}
                className="hidden md:inline-flex bg-vermilion text-on-primary hover:bg-primary px-6 py-2 md:px-7 md:py-2.5 lg:px-8 lg:py-3 rounded-[2px] text-style-body-md md:text-[17px] transition-colors shrink-0"
                onClick={(event) => {
                  event.preventDefault()
                  navigateTo(primaryCta.path)
                }}
              >
                {primaryCta.label}
              </a>

            <button
              ref={menuButtonRef}
              type="button"
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 shrink-0 text-ink"
              aria-label="開啟導覽選單"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setIsMenuOpen(true)}
            >
              <Icon>menu</Icon>
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen ? (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            type="button"
            aria-label="關閉導覽選單背景"
            className="absolute inset-0 bg-ink/40"
            onClick={() => setIsMenuOpen(false)}
          />

          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="主要導覽"
            className="absolute top-0 right-0 h-full w-full max-w-xs bg-paper border-l border-ink/10 flex flex-col p-6"
          >
            <div className="flex justify-end mb-8">
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="關閉導覽選單"
                className="inline-flex items-center justify-center w-11 h-11 text-ink"
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon>close</Icon>
              </button>
            </div>

            <nav className="flex flex-col gap-6" aria-label="行動裝置導覽">
              {primaryNav.map((link) => (
                <a
                  key={link.key}
                  href={getNavHref(link)}
                  className={`text-style-title-lg ${
                    isNavLinkActive(link, pathname) ? 'text-vermilion' : 'text-ink'
                  }`}
                  onClick={(event) => {
                    event.preventDefault()
                    setIsMenuOpen(false)
                    handleNavClick(link)
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <a
              href={routeHref('/booking')}
              className="mt-auto bg-vermilion text-on-primary px-6 py-3 rounded-[2px] text-style-body-lg hover:bg-primary transition-colors text-center"
              onClick={(event) => {
                event.preventDefault()
                setIsMenuOpen(false)
                navigateTo(primaryCta.path)
              }}
            >
              {primaryCta.label}
            </a>
          </div>
        </div>
      ) : null}
    </Fragment>
  )
}

export default Header

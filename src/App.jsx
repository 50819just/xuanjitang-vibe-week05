import { routeHref } from './lib/routes'
import { useEffect } from 'react'
import AOS from 'aos'
import { useRouter, navigateTo } from './hooks/useRouter'
import PageShell from './components/layout/PageShell'
import HomePage from './pages/HomePage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import PricingPage from './pages/PricingPage'
import GuidesPage from './pages/GuidesPage'
import GuideArticlePage from './pages/GuideArticlePage'
import AboutServicePage from './pages/AboutServicePage'
import BookingPage from './pages/BookingPage'
import BookingSubmittedPage from './pages/BookingSubmittedPage'
import DepositPaymentSuccessPage from './pages/DepositPaymentSuccessPage'
import DepositPaymentFailedPage from './pages/DepositPaymentFailedPage'
import SignInPage from './pages/SignInPage'

function matchServiceId(pathname) {
  const match = pathname.match(/^\/services\/([\w-]+)\/?$/)
  return match ? match[1] : null
}

function matchGuideSlug(pathname) {
  const match = pathname.match(/^\/guides\/([\w-]+)\/?$/)
  return match ? match[1] : null
}

function NotFoundPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-[80px] py-24 text-center">
      <p className="text-style-label-sm text-vermilion mb-4">404</p>
      <h1 className="text-style-headline-lg text-ink mb-6">找不到這個頁面</h1>
      <p className="text-style-body-md text-tea-brown mb-8">這個網址可能已調整，請回到首頁重新開始。</p>
      <a
        className="inline-block bg-vermilion text-on-primary px-8 py-3 rounded-[2px] text-style-title-lg"
        href={routeHref('/')}
        onClick={(event) => {
          event.preventDefault()
          navigateTo('/')
        }}
      >
        回到首頁
      </a>
    </div>
  )
}

function resolvePage(pathname) {
  const serviceId = matchServiceId(pathname)
  const guideSlug = matchGuideSlug(pathname)

  if (pathname === '/') {
    return <HomePage />
  }

  if (serviceId) {
    return <ServiceDetailPage serviceId={serviceId} />
  }

  if (guideSlug) {
    return <GuideArticlePage slug={guideSlug} />
  }

  switch (pathname) {
    case '/pricing':
      return <PricingPage />
    case '/guides':
      return <GuidesPage />
    case '/about-service':
      return <AboutServicePage />
    case '/booking':
      return <BookingPage />
    case '/booking/submitted':
      return <BookingSubmittedPage />
    case '/booking/payment/success':
      return <DepositPaymentSuccessPage />
    case '/booking/payment/failed':
      return <DepositPaymentFailedPage />
    case '/sign-in':
      return <SignInPage />
    default:
      return <NotFoundPage />
  }
}

function App() {
  const { pathname, search } = useRouter()

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out',
      once: true,
      offset: 60,
    })
  }, [])

  useEffect(() => {
    AOS.refreshHard()
    const section = new URLSearchParams(search).get('section')
    if (pathname === '/' && section) window.setTimeout(() => document.getElementById(section)?.scrollIntoView(), 80)
  }, [pathname, search])

  return <PageShell>{resolvePage(pathname)}</PageShell>
}

export default App

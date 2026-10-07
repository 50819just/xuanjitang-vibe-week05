import Header from './Header'
import Footer from './Footer'
import { useRouter } from '../../hooks/useRouter'

function PageShell({ children }) {
  const { pathname } = useRouter()
  const isHome = pathname === '/'

  return (
    <div id="top" className="min-h-screen bg-background bg-paper-grain text-ink" style={{ paddingTop: 'var(--site-header-height, 100px)' }}>
      <Header />
      <aside role="note" className="relative z-30 bg-vermilion px-4 py-3 text-center text-sm text-white">
        第五週作業・綠界測試環境｜不收真錢、不成立真實預約，請勿填寫真實個資或正式卡號。
      </aside>
      <main className={isHome ? '' : 'pt-4'}>{children}</main>
      <Footer />
    </div>
  )
}

export default PageShell

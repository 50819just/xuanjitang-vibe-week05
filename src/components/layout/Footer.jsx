import { assetUrl } from '../../lib/assets'
import { navigateTo, navigateToSection } from '../../hooks/useRouter'
import { contact } from '../../data/siteContent'
import { footerNav, getNavHref } from '../../data/navigation'

function handleFooterNavClick(link) {
  if (link.type === 'anchor') {
    navigateToSection(link.anchor)
    return
  }

  navigateTo(link.path)
}

function Footer() {
  return (
    <footer className="relative w-full px-6 md:px-10 lg:px-[80px] py-16 md:py-[120px] flex flex-col md:flex-row justify-between gap-6 bg-surface-container-highest border-t border-ink/10 overflow-hidden">
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover object-bottom opacity-40 blur-[2px]"
        src={assetUrl('branding/banners/site/footer-landscape-v2.jpg')}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-surface-container-highest via-surface-container-highest/45 to-surface-container-highest" />

      <div className="relative z-10 flex flex-col gap-4 max-w-sm">
        <div className="flex items-center gap-2">
          <img
            alt="玄機堂擇日舘 Logo"
            className="h-8 w-auto opacity-80"
            src={assetUrl('branding/logo-symbol-on-light.png')}
          />
          <span className="text-style-title-lg text-ink tracking-wide">玄機堂擇日舘</span>
        </div>

        <div className="text-style-body-md text-tea-brown space-y-1">
          <p className="text-style-label-sm text-tea-brown/70 tracking-widest uppercase mb-1">聯絡老師</p>
          <p>{contact.teacherName}</p>
          <p>
            電話：
            <span>
              {contact.phone}
            </span>
          </p>
          <p>
            Email：
            <span>
              {contact.email}
            </span>
          </p>
          <p>LINE：{contact.line}</p>
          <p>地址：{contact.address}</p>
          <p className="text-style-label-sm text-tea-brown/70 mt-2">{contact.note}</p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-start md:items-end gap-4 justify-between">
        <nav className="relative flex flex-wrap gap-4 md:gap-6 md:justify-end px-1 py-3" aria-label="頁尾導覽">
          {footerNav.map((link) => (
            <a
              key={link.key}
              href={getNavHref(link)}
              className="text-style-body-md text-tea-brown hover:underline"
              onClick={(event) => {
                event.preventDefault()
                handleFooterNavClick(link)
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-style-body-md text-tea-brown">© 玄機堂擇日舘 版權所有</p>
      </div>
    </footer>
  )
}

export default Footer

import Icon from '../components/ui/Icon'
import { routeHref } from '../lib/routes'
import { assetUrl } from '../lib/assets'
import { navigateTo } from '../hooks/useRouter'
import { services } from '../data/services'
import { contact } from '../data/siteContent'
import MaskedHeading from '../components/ui/MaskedHeading'
import BotanicalCorners from '../components/ui/BotanicalCorners'

const PROCESS_STEPS = [
  { title: '提出需求', description: '填寫初步需求表單，簡述所需服務類別。' },
  { title: '老師確認內容', description: '由老師親自審閱需求內容，評估所需相關資訊與複雜度。' },
  { title: '事前說明費用', description: '人工評估完成後，詳盡說明服務內容細節與對應之確切費用。' },
  { title: '雙方確認安排', description: '確認理解並同意服務細節，正式建立委託。' },
  { title: '完成服務', description: '依約定內容，嚴謹執行服務並依事前約定辦理。' },
]

function PricingPage() {
  return (
    <div className="relative">
      <BotanicalCorners variant="peony" />
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 lg:px-[80px] pb-16 md:pb-[120px]">
      <section className="mb-16 md:mb-[120px] pt-8 md:pt-16 text-center">
        <MaskedHeading className="text-style-headline-lg text-ink mb-6">價格說明</MaskedHeading>
        <p className="text-style-body-lg text-tea-brown max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="80">
          我們深知每件託付皆承載著獨特的期許。在此提供基礎服務方向之參考，確切細節與最終費用，將於了解您的具體需求後，於事前詳盡說明。
        </p>
        <div className="mt-8 w-16 h-px bg-tea-brown/30 mx-auto mb-10" />
        <div className="h-[200px] md:h-[280px] overflow-hidden border border-tea-brown/15 bg-paper">
          <img
            className="w-full h-full object-cover"
            src={assetUrl('branding/banners/site/pricing-hero.jpg')}
            alt="手持毛筆書寫費用說明的情境插畫"
            loading="eager"
          />
        </div>
      </section>

      <section className="mb-16 md:mb-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="bg-surface border border-tea-brown/20 p-8 rounded-[2px] relative overflow-hidden flex flex-col justify-between h-full group hover:border-tea-brown/40 transition-colors"
              data-aos="fade-up"
              data-aos-delay={(index % 3) * 80}
            >
              <div>
                <Icon className="text-tea-brown/50 mb-4 text-3xl">{service.icon}</Icon>
                <h2 className="text-style-title-lg text-ink mb-2">{service.title}</h2>
                <p className="text-style-body-md text-tea-brown mb-6">{service.summary}</p>
              </div>
              <div>
                <div className="text-ink text-style-title-lg mb-1">{service.pricingLabel}</div>
                <div className="text-style-label-sm text-tea-brown/70">
                  {service.pricingNote || '* 參考資訊，非正式固定價目'}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-tea-brown/5 to-transparent" />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16 md:mb-[120px]" data-aos="fade-up">
        <h2 className="text-style-title-lg text-ink mb-8 flex items-center gap-3 justify-center">
          <Icon className="text-tea-brown">linear_scale</Icon>
          服務流程
        </h2>
        <div className="max-w-2xl mx-auto relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[0.5px] before:bg-tea-brown/30 space-y-8">
          {PROCESS_STEPS.map((step, index) => (
            <div
              className="relative pl-10 flex flex-col gap-1"
              key={step.title}
              data-aos="fade-right"
              data-aos-delay={index * 80}
            >
              <div
                className={`absolute left-0 top-1.5 w-6 h-6 bg-surface rounded-full flex items-center justify-center z-10 border ${
                  index === 0 ? 'border-vermilion' : 'border-tea-brown/40'
                }`}
              >
                {index === PROCESS_STEPS.length - 1 ? (
                  <Icon className="text-[14px] text-tea-brown/60">check</Icon>
                ) : (
                  <span className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-vermilion' : 'bg-tea-brown/40'}`} />
                )}
              </div>
              <h3 className="text-style-title-lg text-ink">{step.title}</h3>
              <p className="text-style-label-sm text-tea-brown">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center pb-8" data-aos="zoom-in">
        <p className="text-style-body-md text-tea-brown mb-8">
          若需進一步了解您的專屬需求，歡迎透過電話 {contact.phone} 與我們聯繫。
        </p>
        <a
          className="bg-vermilion text-on-primary px-10 py-3 rounded-[2px] text-style-body-lg hover:bg-primary transition-colors duration-300 flex items-center gap-2 mx-auto w-fit"
          href={routeHref('/booking')}
          onClick={(event) => {
            event.preventDefault()
            navigateTo('/booking')
          }}
        >
          開始預約
          <Icon className="text-sm">arrow_forward</Icon>
        </a>
      </section>
      </div>
    </div>
  )
}

export default PricingPage

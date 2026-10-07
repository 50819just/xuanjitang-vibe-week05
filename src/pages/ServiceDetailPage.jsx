import { routeHref } from '../lib/routes'
import { navigateTo } from '../hooks/useRouter'
import { getServiceById } from '../data/services'
import MaskedHeading from '../components/ui/MaskedHeading'
import DecorativePanel from '../components/ui/DecorativePanel'

const PROCESS_STEPS = [
  { label: '一', title: '提出需求', description: '填寫初步需求與希望辦理時間' },
  { label: '二', title: '老師確認與補充資料', description: '人工確認需求，視需要再補資料' },
  { label: '三', title: '說明費用與安排', description: '確認可承接範圍、服務內容與費用' },
  { label: '四', title: '依約完成服務', description: '雙方確認後，依約定方式辦理' },
]

const ONSITE_NOTE =
  '到場範圍目前以「宜蘭縣內可到場、外縣市需另議」作為方向，精確範圍、可行時間與車馬費用，仍由老師依您的所在地區與實際需求人工確認。'

function ChapterHeading({ number, title }) {
  return (
    <div className="flex items-baseline gap-4 mb-8 justify-center">
      <span className="text-style-headline-md text-tea-brown/25" aria-hidden="true">
        {number}
      </span>
      <h2 className="text-style-headline-md text-ink">{title}</h2>
    </div>
  )
}

function ServiceDetailPage({ serviceId }) {
  const service = getServiceById(serviceId)

  if (!service) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-[80px] py-24 text-center">
        <h1 className="text-style-headline-lg text-ink mb-6">找不到這項服務</h1>
        <p className="text-style-body-md text-tea-brown mb-8">這個服務項目可能已調整，請回到首頁重新選擇。</p>
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

  const { detail } = service

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-[80px] pb-16 md:pb-[120px]">
      <nav className="mb-8 text-style-body-md text-tea-brown" aria-label="麵包屑">
        <a
          className="hover:text-vermilion"
          href={routeHref('/')}
          onClick={(event) => {
            event.preventDefault()
            navigateTo('/')
          }}
        >
          服務介紹
        </a>{' '}
        <span className="mx-2">/</span> <span className="text-ink">{service.title}</span>
      </nav>

      {/* 情境 Hero */}
      <section className="flex flex-col items-center text-center mt-4 md:mt-12 mb-14 md:mb-20">
        <MaskedHeading className="text-style-headline-lg text-ink mb-6">{service.title}</MaskedHeading>
        <p className="text-style-body-lg text-tea-brown max-w-2xl mb-6" data-aos="fade-up" data-aos-delay="80">
          {detail.heroSummary}
        </p>
        <div
          className="inline-flex items-center gap-2 bg-surface-container py-2 px-4 rounded-[999px] border border-tea-brown/20 text-tea-brown mb-10"
          data-aos="fade-up"
          data-aos-delay="160"
        >
          <span className="material-symbols-outlined text-[18px]">payments</span>
          <span className="text-style-body-md">{detail.priceBadge}</span>
        </div>
        {service.banner ? (
          <div className="w-full h-[200px] md:h-[320px] overflow-hidden border border-tea-brown/15 bg-paper">
            <img
              className="w-full h-full object-cover"
              src={service.banner}
              alt={service.title}
              loading="eager"
            />
          </div>
        ) : (
          <DecorativePanel className="w-full h-[200px] md:h-[320px]" />
        )}
        <a
          className="mt-8 bg-vermilion text-on-primary px-10 py-3 rounded-[2px] border border-vermilion hover:bg-transparent hover:text-vermilion transition-colors duration-300 text-style-title-lg flex items-center gap-2"
          href={routeHref(`/booking?service=${service.id}`)}
          onClick={(event) => {
            event.preventDefault()
            navigateTo(`/booking?service=${service.id}`)
          }}
        >
          {detail.ctaLabel}
          <span className="material-symbols-outlined">arrow_forward</span>
        </a>
      </section>

      <div className="space-y-16 md:space-y-24">
        <section className="max-w-3xl mx-auto" data-aos="fade-up">
          <ChapterHeading number="01" title="適合什麼情況" />
          <div className="flex flex-wrap gap-3 justify-center">
            {detail.fitScenarios.map((item) => (
              <span key={item} className="text-style-body-md text-vermilion border border-vermilion/30 bg-vermilion/5 px-4 py-2 rounded-[2px]">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section data-aos="fade-up">
          <ChapterHeading number="02" title="第一次先準備什麼" />
          <p className="text-style-body-md text-tea-brown text-center max-w-2xl mx-auto mb-8">資料不完整也沒關係，先提出需求；後續由老師視情況確認需要補充的內容。</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            <div className="bg-paper p-7 md:p-8 border border-tea-brown/20">
              <h3 className="text-style-title-lg text-ink mb-4">現在先提供即可</h3>
              <ul className="space-y-3">
                {detail.prepared.map((item) => (
                  <li className="flex items-start gap-3" key={item}>
                    <span className="w-1.5 h-1.5 bg-tea-brown rounded-full mt-2 shrink-0" />
                    <span className="text-style-body-md text-tea-brown">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface-container-low p-7 md:p-8 border border-tea-brown/15">
              <h3 className="text-style-title-lg text-ink mb-4">確認後可再補充</h3>
              <ul className="space-y-3">
                {detail.supplemental.map((item) => (
                  <li className="flex items-start gap-3" key={item}>
                    <span className="w-1.5 h-1.5 bg-vermilion rounded-full mt-2 shrink-0" />
                    <span className="text-style-body-md text-tea-brown">{item.startsWith('<') ? '相關資料將由老師依需求確認' : item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {service.onsiteRelevant ? (
            <aside className="max-w-4xl mx-auto mt-5 border-l-2 border-vermilion bg-surface px-6 py-5">
              <p className="text-style-title-lg text-ink mb-2">到場服務提醒</p>
              <p className="text-style-body-md text-tea-brown">{ONSITE_NOTE}</p>
            </aside>
          ) : null}
        </section>

        <section data-aos="fade-up">
          <ChapterHeading number="03" title="送出後如何進行" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {PROCESS_STEPS.map((step, index) => (
              <div className="bg-paper border border-tea-brown/15 p-6" key={step.title} data-aos="fade-up" data-aos-delay={index * 80}>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-vermilion text-on-primary text-style-label-sm mb-4">{step.label}</span>
                <h3 className="text-style-title-lg text-ink mb-2">{step.title}</h3>
                <p className="text-style-body-md text-tea-brown">{step.description}</p>
              </div>
            ))}
          </div>
          <p className="text-style-body-md text-tea-brown mt-6 max-w-2xl mx-auto text-center">{detail.deliverable}</p>
          <a
            className="mt-4 text-style-body-md text-vermilion hover:underline flex items-center justify-center gap-1"
            href={routeHref('/about-service')}
            onClick={(event) => {
              event.preventDefault()
              navigateTo('/about-service')
            }}
          >
            查看完整服務方式 <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </section>

        <section className="text-center bg-surface-container-low px-6 py-10 md:py-12" data-aos="zoom-in">
          <p className="text-style-body-md text-tea-brown mb-6">不確定資料是否齊全也沒關係，先描述需求，後續由老師人工確認。</p>
          <a
            className="bg-vermilion text-on-primary px-12 py-4 rounded-[2px] border border-vermilion hover:bg-transparent hover:text-vermilion transition-colors duration-300 text-style-title-lg inline-flex items-center gap-2"
            href={routeHref(`/booking?service=${service.id}`)}
            onClick={(event) => {
              event.preventDefault()
              navigateTo(`/booking?service=${service.id}`)
            }}
          >
            {detail.ctaLabel}
            <span className="material-symbols-outlined">arrow_forward</span>
          </a>
        </section>
      </div>
    </div>
  )
}

export default ServiceDetailPage

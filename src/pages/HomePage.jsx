import Icon from '../components/ui/Icon'
import { routeHref } from '../lib/routes'
import { assetUrl } from '../lib/assets'
import { navigateTo } from '../hooks/useRouter'
import { services } from '../data/services'
import { brand, principleStrip, trustPrinciples, workflow, faq } from '../data/siteContent'
import { guideTopics } from '../data/guides'
import { DEPOSIT_TIER_RULES, DEPOSIT_EXAMPLE } from '../data/pricingRules'
import BotanicalCorners from '../components/ui/BotanicalCorners'

const SERVICE_GROUPS = [
  {
    title: '人生重要時刻',
    description: '為婚嫁與迎接新成員的重要安排，先整理方向，再由老師人工確認。',
    serviceIds: ['marriage', 'newborn'],
  },
  {
    title: '住宅與空間',
    description: '搬遷、入宅、空間與禮俗相關需求，可依實際情況提出說明。',
    serviceIds: ['moving', 'onsite', 'ancestral'],
  },
  {
    title: '其他需求',
    description: '尚未確定服務方向也沒關係，先描述需求，由老師協助確認。',
    serviceIds: ['other-date', 'other-consult'],
  },
]

function HomePage() {
  return (
    <div>
      <BotanicalCorners variant="bamboo" />
      {/* 1. Hero */}
      <section className="relative isolate h-[100svh] min-h-[720px] overflow-hidden bg-ink text-on-primary">
        <div className="hero-image-fade-in absolute inset-x-0 bottom-0 top-2 -z-20 overflow-hidden md:top-4">
          <img
            className="h-full w-full object-cover object-[30%_center] sm:object-[38%_center] lg:object-center"
            src={assetUrl('branding/banners/site/home-hero-elder.png')}
            alt="老師在工作室書寫與整理傳統擇日資料的情境照片"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/25 to-ink/5" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/15" aria-hidden="true" />
        </div>

        <div className="relative mx-auto flex h-full max-w-[1440px] lg:items-start lg:px-[80px] lg:pt-40">
          <div className="absolute bottom-6 left-1/2 flex w-[330px] max-w-[calc(100%-2rem)] -translate-x-1/2 flex-col items-center text-center sm:bottom-10 sm:w-[390px] md:bottom-16 md:w-[430px] lg:static lg:ml-auto lg:mr-[92px] lg:w-full lg:max-w-[520px] lg:translate-x-0 lg:items-start lg:text-left">
            <div className="mb-5 sm:mb-6 md:mb-10">
              <h1 className="hero-content-reveal hero-content-reveal-1 mb-2 sm:mb-3 md:mb-4">
                <img
                  src={assetUrl('branding/home-brand-calligraphy.png')}
                  alt="玄機堂｜擇日（紅色印章）"
                  className="h-auto w-[210px] drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)] sm:w-[240px] md:w-[300px] lg:w-[440px] xl:w-[500px]"
                />
              </h1>
              <img
                src={assetUrl('branding/home-service-labels-v2.png')}
                alt="婚嫁擇日、入宅開市、命名命狀"
                className="hero-content-reveal hero-content-reveal-2 ml-0 h-auto w-[270px] drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)] sm:ml-0 sm:w-[330px] md:ml-[17px] md:w-[400px] lg:ml-[20px] lg:w-[500px]"
              />
            </div>
            <img
              src={assetUrl('branding/hero-headline-single-line.png')}
              alt={brand.headline}
              className="hero-content-reveal hero-content-reveal-3 mb-6 h-auto w-full drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)] sm:w-[370px] md:w-[430px] lg:w-[520px]"
            />
            <div className="hero-content-reveal hero-content-reveal-4 flex flex-row justify-center gap-3 sm:gap-4 lg:justify-start">
              <a
                className="inline-block self-start whitespace-nowrap rounded-[2px] bg-vermilion px-4 py-2 text-center text-[15px] sm:px-8 sm:py-3 sm:text-style-title-lg text-on-primary transition-colors hover:bg-primary"
                href={routeHref('/booking')}
                onClick={(event) => {
                  event.preventDefault()
                  navigateTo('/booking')
                }}
              >
                {brand.primaryCta}
              </a>
              <a
                className="inline-block self-start whitespace-nowrap rounded-[2px] border border-on-primary/70 px-4 py-2 text-center text-[15px] sm:px-8 sm:py-3 sm:text-style-title-lg text-on-primary transition-colors hover:bg-on-primary hover:text-ink"
                href={routeHref('/about-service')}
                onClick={(event) => {
                  event.preventDefault()
                  navigateTo('/about-service')
                }}
              >
                {brand.secondaryCta}
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-[80px]">
      {/* 2. 三項原則 Strip */}
      <section className="border-b border-ink/10 py-8" data-aos="fade-up">
        <h2 className="sr-only">人工服務三原則</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {principleStrip.map((item) => (
            <div key={item.label} className="flex items-center justify-center gap-3">
              <Icon className="text-vermilion">{item.icon}</Icon>
              <span className="text-style-body-md text-ink">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 服務項目 */}
      <section className="py-16 md:py-[120px] border-t border-ink/10" id="services">
        <div className="mb-16" data-aos="fade-up">
          <h2 className="text-style-headline-md text-ink">服務項目</h2>
        </div>
        <div className="space-y-12 md:space-y-16">
          {SERVICE_GROUPS.map((group) => {
            const groupedServices = group.serviceIds.map((id) => services.find((service) => service.id === id)).filter(Boolean)

            return (
              <section key={group.title} className="space-y-6" data-aos="fade-up">
                <div className="max-w-2xl">
                  <p className="text-style-label-sm text-vermilion tracking-[0.18em] mb-2">SERVICE CATEGORY</p>
                  <h3 className="text-style-headline-sm text-ink mb-2">{group.title}</h3>
                  <p className="text-style-body-md text-tea-brown">{group.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedServices.map((service) => (
                    <div key={service.id} className="border border-tea-brown/20 bg-surface overflow-hidden group hover:border-tea-brown/50 transition-colors flex flex-col">
                      <div className="h-36 overflow-hidden bg-paper border-b border-tea-brown/15">
                        <img
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          src={service.cardImage}
                          alt={`${service.title}情境水墨插畫`}
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6 flex grow flex-col">
                        <h4 className="text-style-title-lg text-ink mb-3">{service.title}</h4>
                        <p className="text-style-body-md text-tea-brown grow mb-5">{service.summary}</p>
                        <p className="text-style-label-sm text-tea-brown/70 mb-4">{service.pricingLabel}</p>
                        <a
                          className="text-vermilion text-style-title-lg flex items-center gap-2 group-hover:gap-4 transition-all"
                          href={routeHref(`/services/${service.id}`)}
                          onClick={(event) => {
                            event.preventDefault()
                            navigateTo(`/services/${service.id}`)
                          }}
                        >
                          查看詳情 <Icon className="text-sm">arrow_forward</Icon>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </section>

      {/* 4. 服務理念 */}
      <section className="py-16 md:py-[120px] border-t border-ink/10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" id="trust">
        <div data-aos="fade-right">
          <h2 className="text-style-headline-md text-ink mb-6">服務理念</h2>
          <p className="text-style-body-md text-tea-brown mb-8">
            玄機堂擇日舘相信重要日子與禮俗安排，值得被好好理解，而不是套版產生。每一次需求都由老師親自檢視，說明清楚才進入下一步。
          </p>
          <ul className="space-y-4">
            {trustPrinciples.map((item) => (
              <li key={item.title} className="flex items-center gap-3">
                <Icon className="text-vermilion">{item.icon}</Icon>
                <div>
                  <span className="text-style-body-md text-ink">{item.title}</span>
                  <span className="text-style-label-sm text-tea-brown/70 block">{item.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-[280px] md:h-[360px] overflow-hidden border border-tea-brown/15 bg-paper">
          <img
            className="w-full h-full object-cover"
            src={assetUrl('branding/banners/site/home-trust.jpg')}
            alt="手持筆審閱案件記錄的情境插畫"
            loading="lazy"
          />
        </div>
      </section>

      {/* 5. 工作方式 */}
      <section
        className="py-16 md:py-[120px] border-t border-ink/10 bg-surface-container-low px-6 md:px-8 rounded-[8px] my-8"
        id="workflow"
        data-aos="fade-up"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-style-headline-md text-ink mb-4 text-center">工作方式</h2>
          <p className="text-center text-style-body-md text-tea-brown mb-12">
            ※ 送出的是預約申請，需經確認後才正式成立；適用案件才於確認總價後支付預約訂金。
          </p>
          <ol className="relative border-l border-tea-brown/30 ml-3 space-y-12">
            {workflow.map((item, index) => (
              <li
                className="pl-10 relative"
                key={item.step}
                data-aos="fade-right"
                data-aos-delay={index * 100}
              >
                <div
                  className={`absolute w-3 h-3 -left-[6.5px] top-1.5 ${
                    index === workflow.length - 1 ? 'bg-vermilion rounded-[2px]' : 'bg-tea-brown rounded-full'
                  }`}
                />
                <h3
                  className={`text-style-title-lg ${
                    index === workflow.length - 1 ? 'text-vermilion' : 'text-ink'
                  }`}
                >
                  {item.step}. {item.title}
                </h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. 知識導讀 */}
      <section className="py-16 md:py-[120px] border-t border-ink/10" id="guides-preview">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12" data-aos="fade-up">
          <h2 className="text-style-headline-md text-ink">擇日與宅事知識</h2>
          <a
            className="text-style-body-md text-vermilion hover:underline w-fit"
            href={routeHref('/guides')}
            onClick={(event) => {
              event.preventDefault()
              navigateTo('/guides')
            }}
          >
            查看全部
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guideTopics.map((topic, index) => (
            <a
              key={topic.slug}
              className="block bg-surface border border-tea-brown/20 overflow-hidden rounded-[2px] hover:border-tea-brown/50 transition-colors group"
              href={routeHref(topic.path)}
              data-aos="fade-up"
              data-aos-delay={index * 80}
              onClick={(event) => {
                event.preventDefault()
                navigateTo(topic.path)
              }}
            >
              <div className="h-44 overflow-hidden bg-paper">
                <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" src={topic.banner} alt="" loading="lazy" />
              </div>
              <div className="p-8">
                <p className="text-style-label-sm text-tea-brown/70 mb-2">{topic.intent}</p>
                <h3 className="text-style-title-lg text-ink mb-6">{topic.title}</h3>
                <span className="text-vermilion text-style-body-md flex items-center gap-2">
                  閱讀說明 <Icon className="text-sm">arrow_forward</Icon>
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 7. 費用說明 */}
      <section className="py-16 md:py-[120px] border-t border-ink/10 text-center" id="pricing-preview">
        <h2 className="text-style-headline-md text-ink mb-10" data-aos="fade-up">
          費用說明
        </h2>
        <div
          className="inline-block border border-tea-brown/20 bg-surface px-6 md:px-12 py-8 text-left w-full md:min-w-[400px] md:w-auto"
          data-aos="zoom-in"
        >
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`flex justify-between items-center gap-4 ${
                index < services.length - 1 ? 'border-b border-ink/10 pb-4 mb-4' : 'pb-2'
              }`}
            >
              <span className="text-style-title-lg text-ink">{service.title}</span>
              <span className="text-style-body-lg text-tea-brown whitespace-nowrap">{service.pricingLabel}</span>
            </div>
          ))}
          <p className="text-style-label-sm text-tea-brown mt-6 text-right">* MVP 參考資訊，非正式固定價目</p>
        </div>
        <p className="text-style-body-md text-tea-brown mt-8 max-w-2xl mx-auto text-left md:text-center" data-aos="fade-up">
          外縣市、到場、多地點、特殊或時間較急的案件，由老師依需求確認服務範圍與費用，不進行網站自動計價。
        </p>

        <div
          className="mt-10 max-w-2xl mx-auto text-left bg-surface-container-low border border-tea-brown/20 rounded-[2px] p-6 md:p-8"
          data-aos="fade-up"
        >
          <h3 className="text-style-title-lg text-ink mb-4">人工確認總價後，才收預約訂金</h3>
          <ul className="space-y-2">
            {DEPOSIT_TIER_RULES.map((rule) => (
              <li key={rule.label} className="flex justify-between gap-4 text-style-body-md text-tea-brown">
                <span>{rule.label}</span>
                <span className="text-ink whitespace-nowrap">
                  預約訂金 NT${rule.depositAmount.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-style-label-sm text-tea-brown/70 mt-4">
            尾款 = 老師確認的服務總價 − 已付預約訂金。例：總價 NT${DEPOSIT_EXAMPLE.serviceTotalAmount.toLocaleString()}
            時，預約訂金 NT${DEPOSIT_EXAMPLE.depositAmount.toLocaleString()}，尾款 NT$
            {DEPOSIT_EXAMPLE.balanceAmount.toLocaleString()}。
          </p>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-16 md:py-[120px] border-t border-ink/10" id="faq">
        <h2 className="text-style-headline-md text-ink mb-8 text-center" data-aos="fade-up">
          常見問題
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faq.map((item, index) => (
            <details
              key={item.q}
              className="group border border-tea-brown/20 bg-surface p-6 open:bg-surface-container transition-colors"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              <summary className="text-style-title-lg text-ink cursor-pointer list-none flex justify-between items-center gap-4">
                {item.q}
                <Icon className="group-open:rotate-180 transition-transform shrink-0">expand_more</Icon>
              </summary>
              <p className="text-style-body-md text-tea-brown mt-4 pt-4 border-t border-ink/10">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 9. Final CTA */}
      <section
        className="py-16 md:py-[120px] border-t border-ink/10 flex flex-col items-center justify-center text-center"
        id="contact"
        data-aos="zoom-in"
      >
        <h2 className="text-style-headline-md text-ink mb-6">準備好安排您的重要日程了嗎？</h2>
        <a
          className="inline-block bg-vermilion text-on-primary px-10 py-4 rounded-[2px] text-style-title-lg hover:bg-primary transition-colors"
          href={routeHref('/booking')}
          onClick={(event) => {
            event.preventDefault()
            navigateTo('/booking')
          }}
        >
          {brand.primaryCta}
        </a>
      </section>
      </div>
    </div>
  )
}

export default HomePage

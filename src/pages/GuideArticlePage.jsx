import { routeHref } from '../lib/routes'
import { navigateTo } from '../hooks/useRouter'
import { useDocumentHead } from '../hooks/useDocumentHead'
import { getGuideBySlug, guideDraftNotice } from '../data/guides'
import { getServiceById } from '../data/services'
import MaskedHeading from '../components/ui/MaskedHeading'
import DecorativePanel from '../components/ui/DecorativePanel'

function GuideNotFound() {
  return (
    <div className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-[80px] py-24 text-center">
      <p className="text-style-label-sm text-vermilion mb-4">404</p>
      <h1 className="text-style-headline-lg text-ink mb-6">找不到這篇內容</h1>
      <p className="text-style-body-md text-tea-brown mb-8">這個知識主題可能已調整，請回到知識列表重新選擇。</p>
      <a
        className="inline-block bg-vermilion text-on-primary px-8 py-3 rounded-[2px] text-style-title-lg"
        href={routeHref('/guides')}
        onClick={(event) => {
          event.preventDefault()
          navigateTo('/guides')
        }}
      >
        回到擇日與宅事知識
      </a>
    </div>
  )
}

function buildStructuredData(topic) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '擇日與宅事知識', item: '/guides' },
        { '@type': 'ListItem', position: 2, name: topic.title, item: topic.path },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: topic.title,
      description: topic.metaDescription,
      publisher: { '@type': 'Organization', name: '玄機堂擇日舘' },
    },
  ]
}

function GuideArticlePage({ slug }) {
  const topic = getGuideBySlug(slug)

  useDocumentHead({
    title: topic ? topic.title : '找不到這篇內容',
    description: topic ? topic.metaDescription : undefined,
    path: topic ? topic.path : undefined,
    structuredData: topic ? buildStructuredData(topic) : undefined,
  })

  if (!topic) {
    return <GuideNotFound />
  }

  const relatedService = getServiceById(topic.relatedServiceId)

  return (
    <div className="max-w-[820px] mx-auto px-6 md:px-10 lg:px-[80px] pb-16 md:pb-[120px]">
      <nav className="mb-8 pt-8 md:pt-16 text-style-body-md text-tea-brown" aria-label="麵包屑">
        <a
          className="hover:text-vermilion"
          href={routeHref('/guides')}
          onClick={(event) => {
            event.preventDefault()
            navigateTo('/guides')
          }}
        >
          擇日與宅事知識
        </a>{' '}
        <span className="mx-2">/</span> <span className="text-ink">{topic.title}</span>
      </nav>

      <section className="mb-8">
        <p className="text-style-label-sm text-tea-brown/70 mb-2">{topic.intent}</p>
        <MaskedHeading className="text-style-headline-lg text-ink mb-6">{topic.title}</MaskedHeading>
        <p className="inline-block text-style-label-sm text-vermilion border border-vermilion/40 bg-vermilion/5 px-3 py-1 rounded-[2px]">
          {guideDraftNotice}
        </p>
      </section>

      {topic.banner ? (
        <div className="h-[200px] md:h-[280px] mb-10 overflow-hidden border border-tea-brown/15 bg-paper">
          <img
            className="w-full h-full object-cover"
            src={topic.banner}
            alt={topic.title}
            loading="eager"
          />
        </div>
      ) : (
        <DecorativePanel className="h-[200px] md:h-[280px] mb-10" />
      )}

      <section className="mb-12" data-aos="fade-up">
        <p className="text-style-body-lg text-tea-brown">{topic.readIntro}</p>
      </section>

      <section className="mb-16 space-y-12">
        {topic.sections.map((item) => (
          <div key={item.number} data-aos="fade-up">
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-style-headline-md text-tea-brown/25" aria-hidden="true">
                {item.number}
              </span>
              <h2 className="text-style-title-lg text-ink">{item.heading}</h2>
            </div>
            <p className="text-style-body-md text-tea-brown mb-4">{item.body}</p>
            {item.note ? (
              <p className="text-style-label-sm text-tea-brown bg-surface border border-tea-brown/20 rounded-[2px] px-4 py-3">
                {item.note}
              </p>
            ) : null}
          </div>
        ))}
      </section>

      {topic.prepList ? (
        <section className="mb-16 bg-surface border border-tea-brown/20 rounded-[2px] p-8" data-aos="fade-up">
          <h2 className="text-style-title-lg text-ink mb-4">預約前可先整理</h2>
          <ul className="space-y-2 list-disc pl-5">
            {topic.prepList.map((prepItem) => (
              <li key={prepItem} className="text-style-body-md text-tea-brown">
                {prepItem}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {topic.faqs ? (
        <section className="mb-16" data-aos="fade-up">
          <h2 className="text-style-title-lg text-ink mb-6">常見問題</h2>
          <div className="space-y-4">
            {topic.faqs.map((item) => (
              <details
                key={item.q}
                className="group border border-tea-brown/20 bg-surface p-6 open:bg-surface-container transition-colors"
              >
                <summary className="text-style-body-lg text-ink cursor-pointer list-none flex justify-between items-center gap-4">
                  <h3 className="text-style-body-lg text-ink m-0">{item.q}</h3>
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform shrink-0">
                    expand_more
                  </span>
                </summary>
                <p className="text-style-body-md text-tea-brown mt-4 pt-4 border-t border-ink/10">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {relatedService ? (
        <section className="mb-16" data-aos="fade-up">
          <h2 className="text-style-title-lg text-ink mb-4">相關服務</h2>
          <div className="bg-surface border border-tea-brown/20 p-8 rounded-[2px] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-style-title-lg text-ink mb-2">{relatedService.title}</h3>
              <p className="text-style-body-md text-tea-brown">{relatedService.summary}</p>
            </div>
            <a
              className="shrink-0 inline-block text-style-body-md text-vermilion hover:underline w-fit"
              href={routeHref(`/services/${relatedService.id}`)}
              onClick={(event) => {
                event.preventDefault()
                navigateTo(`/services/${relatedService.id}`)
              }}
            >
              了解服務
            </a>
          </div>
        </section>
      ) : null}

      <section className="text-center pb-8">
        <a
          className="bg-vermilion text-on-primary px-10 py-3 rounded-[2px] text-style-body-lg hover:bg-primary transition-colors duration-300 flex items-center gap-2 mx-auto w-fit"
          href={routeHref('/booking')}
          onClick={(event) => {
            event.preventDefault()
            navigateTo('/booking')
          }}
        >
          開始預約
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </section>
    </div>
  )
}

export default GuideArticlePage

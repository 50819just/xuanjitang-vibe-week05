import { navigateTo } from '../hooks/useRouter'
import { useDocumentHead } from '../hooks/useDocumentHead'
import { guidesIntro, guidesMetaDescription, guideDraftNotice, guideTopics } from '../data/guides'
import MaskedHeading from '../components/ui/MaskedHeading'
import BotanicalCorners from '../components/ui/BotanicalCorners'

const STRUCTURED_DATA = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: '/' },
      { '@type': 'ListItem', position: 2, name: '擇日與宅事知識', item: '/guides' },
    ],
  },
]

function GuidesPage() {
  useDocumentHead({
    title: '擇日與宅事知識',
    description: guidesMetaDescription,
    path: '/guides',
    structuredData: STRUCTURED_DATA,
  })

  return (
    <div className="relative">
      <BotanicalCorners variant="plum" />
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 lg:px-[80px] pb-16 md:pb-[120px]">
      <section className="mb-16 md:mb-[80px] text-center">
        <MaskedHeading className="text-style-headline-lg text-ink mb-6">擇日與宅事知識</MaskedHeading>
        <p className="text-style-body-lg text-tea-brown max-w-2xl mx-auto">{guidesIntro}</p>
        <div className="mt-8 w-16 h-px bg-tea-brown/30 mx-auto" />
      </section>

      <section className="mb-16 md:mb-[120px]">
        <h2 className="sr-only">知識文章一覽</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guideTopics.map((topic) => (
            <div
              key={topic.slug}
              className="bg-surface border border-tea-brown/20 overflow-hidden rounded-[2px] flex flex-col justify-between h-full"
            >
              <div>
                <div className="h-48 overflow-hidden bg-paper">
                  <img className="h-full w-full object-cover" src={topic.banner} alt="" loading="lazy" />
                </div>
                <div className="p-8 pb-0">
                  <p className="text-style-label-sm text-tea-brown/70 mb-2">{topic.intent}</p>
                  <h3 className="text-style-title-lg text-ink mb-4">{topic.title}</h3>
                  <p className="text-style-label-sm text-tea-brown/70">{guideDraftNotice}</p>
                </div>
              </div>
              <a
                className="m-8 mt-6 inline-block text-style-body-md text-vermilion hover:underline w-fit"
                href={topic.path}
                onClick={(event) => {
                  event.preventDefault()
                  navigateTo(topic.path)
                }}
              >
                閱讀說明
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center pb-8">
        <a
          className="bg-vermilion text-on-primary px-10 py-3 rounded-[2px] text-style-body-lg hover:bg-primary transition-colors duration-300 flex items-center gap-2 mx-auto w-fit"
          href="/booking"
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
    </div>
  )
}

export default GuidesPage

import Icon from '../components/ui/Icon'
import { routeHref } from '../lib/routes'
import { assetUrl } from '../lib/assets'
import { navigateTo } from '../hooks/useRouter'
import { brand, trustPrinciples, contact } from '../data/siteContent'
import MaskedHeading from '../components/ui/MaskedHeading'
import BotanicalCorners from '../components/ui/BotanicalCorners'

const TEACHER_INTRO_BANNER = assetUrl('branding/banners/site/teacher-figure-v2.jpg')
const TEACHER_STORY_SECTIONS = [
  {
    title: '三代相承，各有春秋',
    description:
      '玄機堂承襲三代擇日家學，從上一代累積的經驗，到今日面對不同家庭與生活型態，每一代都有自己的方法與專長，也共同守著對傳統禮俗的慎重。',
    image: assetUrl('branding/banners/site/teacher-heritage-v2.jpg'),
    alt: '長輩將古籍交予下一代的風格示意圖，呈現傳承與延續的意象',
  },
  {
    title: '依不同需求，細看每一個細節',
    description:
      '陳俊宏老師延續家學所傳，依不同人生大事與實際需求仔細研判；除了擇定適合的日期與時辰，也重視把繁複的禮俗與注意事項說得清楚，讓每一次選擇都有所依循。',
    image: assetUrl('branding/banners/site/teacher-method-v2.jpg'),
    alt: '羅盤、古籍與書案靜物的風格示意圖，呈現整理資料與細看細節的工作方式',
  },
  {
    title: '讓傳統回到生活，也讓說明更清楚',
    description:
      '時代在變，做事的方法可以與時俱進；不變的，是對每一份託付的用心。從禮俗說明、資料整理到實際安排，重視的是讓重要時刻能被好好理解、安心面對。',
    image: assetUrl('branding/banners/site/teacher-culture-v2.jpg'),
    alt: '茶席、圖卷與筆墨場景的風格示意圖，呈現文化感與溫暖留白',
  },
]

const TEACHER_VALUE_POINTS = [
  '婚嫁、入宅、命名與人生重要時刻，會依不同情況仔細研判。',
  '不只看日期，也重視把禮俗與注意事項說清楚。',
  '面對不同家庭與生活節奏，盡量用讓人安心的方式慢慢說明。',
]

const SERVICE_APPROACH_STEPS = [
  {
    step: '01',
    title: '提出需求',
    description:
      '填寫初步需求表單，簡述所需服務類別與希望辦理的時間。不需要一次寫得很完整，先讓老師掌握方向即可，細節可以在後續確認時再補充。',
    image: assetUrl('branding/banners/site/process-illustration-intake-v2.jpg'),
    alt: '填寫初步需求表單的水墨插圖',
  },
  {
    step: '02',
    title: '老師確認內容',
    description:
      '由老師親自審閱需求內容，評估所需相關資訊與複雜度。若案件較特殊或需要進一步釐清，會主動透過您留下的聯絡方式確認細節，不會直接套用制式流程。',
    image: assetUrl('branding/banners/site/process-illustration-review-v2.jpg'),
    alt: '老師審閱資料與羅盤的水墨插圖',
  },
  {
    step: '03',
    title: '事前說明費用',
    description:
      '人工評估完成後，會依實際服務內容詳盡說明費用細節。正式安排前費用會先講清楚，不會等到事後才臨時告知。',
    image: assetUrl('branding/banners/site/process-illustration-fee-v2.jpg'),
    alt: '事前說明費用的水墨插圖',
  },
  {
    step: '04',
    title: '雙方確認安排',
    description:
      '確認理解並同意服務細節後，才會正式建立委託。過程中如果還有任何疑問，都可以在這個階段提出，確認清楚了再往下走。',
    image: assetUrl('branding/banners/site/process-illustration-confirm-v2.jpg'),
    alt: '雙方確認文件安排的水墨插圖',
  },
  {
    step: '05',
    title: '完成服務',
    description:
      '依約定內容與時間，嚴謹執行服務並依事前約定辦理。若有後續需要留意的事項，也會一併說明清楚，不會辦完就結束聯繫。',
    image: assetUrl('branding/banners/site/process-illustration-complete-v2.jpg'),
    alt: '完成服務後整理案頭的水墨插圖',
  },
]

function AboutServicePage() {
  return (
    <div className="relative">
      <BotanicalCorners variant="orchid" />
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 lg:px-[80px] pb-16 md:pb-[120px]">
      <section className="relative isolate mb-16 md:mb-[120px] pt-8 md:pt-16 text-center overflow-hidden">
        <MaskedHeading className="text-style-headline-lg text-ink mb-6">服務方式</MaskedHeading>
        <p className="text-style-body-lg text-tea-brown max-w-2xl mx-auto" data-aos="fade-up">
          {brand.description}
          <br />
          <br />
          <span className="text-vermilion font-medium">※ {brand.highlightNote}</span>
        </p>
        <div className="mt-8 w-16 h-px bg-tea-brown/30 mx-auto mb-10" />
        <div
          className="h-[200px] md:h-[280px] max-w-3xl mx-auto overflow-hidden border border-tea-brown/15 bg-paper"
          data-aos="zoom-in"
        >
          <img
            className="w-full h-full object-cover"
            src={assetUrl('branding/banners/site/about-hero.jpg')}
            alt="案頭整齊擺放通書、羅盤與茶盞的情境插畫"
            loading="eager"
          />
        </div>
      </section>

      <section className="relative mb-16 md:mb-[120px] overflow-hidden">
        <h2 className="text-style-headline-md text-ink mb-12 text-center" data-aos="fade-up">
          服務原則
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {trustPrinciples.map((item, index) => (
            <div
              key={item.title}
              className="relative z-10 flex flex-col items-center text-center gap-2"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              <Icon className="text-vermilion text-4xl">{item.icon}</Icon>
              <h3 className="text-style-title-lg text-ink">{item.title}</h3>
              <p className="text-style-label-sm text-tea-brown">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mb-16 md:mb-[120px] overflow-hidden">
        <div
          className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-stretch border border-tea-brown/15 bg-paper overflow-hidden"
          data-aos="fade-up"
        >
          <div className="h-[360px] md:h-auto overflow-hidden" data-aos="zoom-in" data-aos-duration="700">
            <img
              className="w-full h-full object-cover"
              src={TEACHER_INTRO_BANNER}
              alt="示意人物：伏案整理資料的工作情境，桌上有羅盤與古籍"
              loading="lazy"
            />
          </div>
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <h2 className="text-style-headline-md text-ink mb-4">認識老師</h2>
            <p className="text-style-body-md text-tea-brown mb-3">{contact.teacherName}</p>
            <p className="text-style-title-lg text-ink mb-4">三代相承，各有春秋。</p>
            <p className="text-style-body-md text-tea-brown mb-4">
              玄機堂承襲三代擇日家學，從上一代累積的經驗，到今日面對不同家庭與生活型態，每一代都有自己的方法與專長，也共同守著對傳統禮俗的慎重。
            </p>
            <p className="text-style-body-md text-tea-brown mb-4">
              陳俊宏老師延續家學所傳，依不同人生大事與實際需求仔細研判；除了擇定適合的日期與時辰，也重視把繁複的禮俗與注意事項說得清楚，讓每一次選擇都有所依循。
            </p>
            <p className="text-style-body-md text-tea-brown mb-5">
              時代在變，做事的方法可以與時俱進；不變的，是對每一份託付的用心。
            </p>
            <ul className="space-y-3 mb-5">
              {TEACHER_VALUE_POINTS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-style-body-md text-tea-brown">
                  <span className="mt-2 h-2 w-2 rounded-full bg-vermilion shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-16 md:mb-[120px]">
        <div className="text-center max-w-2xl mx-auto mb-12" data-aos="fade-up">
          <h2 className="text-style-headline-md text-ink mb-4">老師的工作方式與在意的事</h2>
          <p className="text-style-body-md text-tea-brown">
            這一頁把工作的節奏、文化感與做事方式一起放進來，讓「認識老師」不只是一張圖加一段文字，而是能更完整看見處理事情的脈絡。
          </p>
        </div>

        <div className="space-y-12 md:space-y-16">
          {TEACHER_STORY_SECTIONS.map((section, index) => (
            <article
              key={section.title}
              className={`grid grid-cols-1 md:grid-cols-2 items-stretch border border-tea-brown/15 bg-paper overflow-hidden ${index % 2 === 1 ? 'md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1' : ''}`}
              data-aos="fade-up"
            >
              <div
                className="h-[260px] md:h-auto overflow-hidden"
                data-aos="zoom-in"
                data-aos-duration="700"
                data-aos-delay={index * 100}
              >
                <img className="w-full h-full object-cover" src={section.image} alt={section.alt} loading="lazy" />
              </div>
              <div className="p-6 md:p-10 flex flex-col justify-center">
                <p className="text-style-label-sm tracking-[0.2em] text-vermilion mb-3">0{index + 1}</p>
                <h3 className="text-style-title-lg text-ink mb-4">{section.title}</h3>
                <p className="text-style-body-lg text-tea-brown">{section.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mb-16 md:mb-[120px] bg-surface-container-low px-5 md:px-8 py-12 md:py-16 rounded-[8px] overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12" data-aos="fade-up">
            <h2 className="text-style-headline-md text-ink mb-4">我們如何處理每一件託付</h2>
            <p className="text-style-body-md text-tea-brown">
              每一步都有獨立插圖與前端文字；圖片只負責情境，內容則能直接閱讀與後續調整。
            </p>
          </div>

          <div className="relative z-10 space-y-10 md:space-y-14">
            {SERVICE_APPROACH_STEPS.map((item, index) => (
              <article
                key={item.step}
                className={`grid grid-cols-1 md:grid-cols-2 items-stretch rounded-[14px] border border-tea-brown/12 bg-paper overflow-hidden shadow-[0_12px_30px_rgba(41,36,31,0.06)] ${index % 2 === 1 ? 'md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1' : ''}`}
                data-aos="fade-up"
              >
                <div
                  className="h-[240px] md:h-auto overflow-hidden"
                  data-aos="zoom-in"
                  data-aos-duration="700"
                  data-aos-delay={index * 100}
                >
                  <img className="w-full h-full object-cover" src={item.image} alt={item.alt} loading="lazy" />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex shrink-0 items-center justify-center h-9 w-9 rounded-full bg-vermilion text-on-primary text-style-label-sm">
                      {item.step}
                    </span>
                    <p className="text-style-label-sm tracking-[0.18em] text-vermilion">服務流程</p>
                  </div>
                  <h3 className="text-style-title-lg text-ink mb-3">{item.title}</h3>
                  <p className="text-style-body-lg text-tea-brown">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="text-center pb-8" data-aos="zoom-in">
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

export default AboutServicePage

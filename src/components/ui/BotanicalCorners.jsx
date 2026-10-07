const BOTANICAL_ASSETS = {
  bamboo: 'ink-bamboo-corner-v1.jpg',
  plum: 'plum-corner.png',
  orchid: 'orchid-corner.png',
  chrysanthemum: 'chrysanthemum-corner.png',
  peony: 'peony-corner.png',
}

function BotanicalCorners({ variant = 'bamboo' }) {
  const source = `${import.meta.env.BASE_URL}branding/banners/site/${BOTANICAL_ASSETS[variant] || BOTANICAL_ASSETS.bamboo}`

  const cornerClasses = 'pointer-events-none fixed top-1/2 z-0 hidden h-[420px] w-auto -translate-y-1/2 mix-blend-multiply xl:block'

  return (
    <>
      <img
        alt=""
        aria-hidden="true"
        className={`${cornerClasses} left-0 block h-[260px] opacity-20 sm:h-[320px] sm:opacity-25 xl:h-[420px] xl:opacity-30`}
        src={source}
      />
      <img alt="" aria-hidden="true" className={`${cornerClasses} right-0 -scale-x-100 opacity-30`} src={source} />
    </>
  )
}

export default BotanicalCorners

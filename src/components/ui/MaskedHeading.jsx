import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

function MaskedHeading({ as, className = '', children, delay = 0 }) {
  const Tag = as || 'h1'
  const containerRef = useRef(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '.masked-heading-inner',
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, delay, ease: 'power3.out' },
      )
    },
    { scope: containerRef, dependencies: [delay] },
  )

  return (
    <Tag ref={containerRef} className={`overflow-hidden ${className}`}>
      <span className="masked-heading-inner inline-block will-change-transform">{children}</span>
    </Tag>
  )
}

export default MaskedHeading

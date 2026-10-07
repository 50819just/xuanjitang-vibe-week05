import { ICON_PATHS } from './iconPaths'

// Decorative icons always render vector paths, never expose English ligature names.
function Icon({ children, className = '', ...props }) {
  const name = typeof children === 'string' ? children.trim() : ''
  const path = ICON_PATHS[name] || ICON_PATHS.info
  return (
    <svg {...props} className={`app-icon ${className}`} viewBox="0 0 960 960" fill="currentColor" aria-hidden="true" focusable="false">
      <path d={path} transform="translate(0 960) scale(1 -1)" />
    </svg>
  )
}

export default Icon

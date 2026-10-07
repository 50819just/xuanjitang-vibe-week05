function DecorativePanel({ className = '' }) {
  return (
    <div
      className={`relative border border-ink/10 rounded-[8px] overflow-hidden bg-surface paper-texture bg-paper-grain ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-6 border border-tea-brown/20 rounded-[4px]" />
      <div className="absolute inset-6 grid grid-cols-6 grid-rows-4 opacity-40">
        {Array.from({ length: 24 }).map((_, index) => (
          <div key={index} className="border border-tea-brown/10" />
        ))}
      </div>
      <div className="absolute bottom-8 right-8 w-16 h-16 rounded-full border-2 border-vermilion/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-paper/60 to-transparent" />
    </div>
  )
}

export default DecorativePanel

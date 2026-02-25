import { useState } from 'react'

interface Props {
  options?: string[]
  onSelect: (option: string) => void
}

export default function VoiceInputButton({ options = [], onSelect }: Props) {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center btn-glow-brand active:scale-90 transition-transform"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
          <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {showOptions && options.length > 0 && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white rounded-2xl shadow-xl border border-gray-100/60 overflow-hidden min-w-[200px] animate-slide-up card-glow">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => { onSelect(opt); setShowOptions(false) }}
              className="w-full px-5 py-3.5 text-sm text-gray-700 hover:bg-brand-light text-left transition-colors border-b border-gray-50 last:border-0 font-medium"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface Props {
  onCapture: () => void
  onBack: () => void
}

export default function CameraView({ onCapture, onBack }: Props) {
  return (
    <div className="h-full bg-gray-900 flex flex-col relative">
      {/* Back button */}
      <button onClick={onBack} className="absolute top-4 left-4 z-10 text-white p-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Viewfinder */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative w-full aspect-[3/4] border-2 border-dashed border-white/40 rounded-lg">
          {/* Corner markers */}
          <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-3 border-l-3 border-white rounded-tl" />
          <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-3 border-r-3 border-white rounded-tr" />
          <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-3 border-l-3 border-white rounded-bl" />
          <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-3 border-r-3 border-white rounded-br" />

          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/50 text-sm text-center">将试卷放在框内拍摄<br/>保持光线充足、画面清晰</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="py-8 flex items-center justify-center gap-8">
        <button className="w-10 h-10 rounded-full border-2 border-white/50 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
        <button
          onClick={onCapture}
          className="w-18 h-18 rounded-full bg-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <div className="w-14 h-14 rounded-full border-4 border-gray-300" />
        </button>
        <button className="w-10 h-10 rounded-full border-2 border-white/50 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
        </button>
      </div>
    </div>
  )
}

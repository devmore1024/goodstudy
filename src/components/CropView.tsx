interface Props {
  onConfirm: () => void
  onRetake: () => void
  onRotate: () => void
}

export default function CropView({ onConfirm, onRetake, onRotate }: Props) {
  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Image area with crop overlay */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Mock captured image */}
        <div className="relative w-full aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" className="mx-auto mb-2">
                <rect x="2" y="2" width="20" height="20" rx="2" />
                <line x1="2" y1="8" x2="22" y2="8" />
                <line x1="6" y1="2" x2="6" y2="22" />
                <text x="12" y="16" textAnchor="middle" fontSize="6" fill="#9CA3AF">试卷</text>
              </svg>
              <p className="text-xs text-gray-400">模拟试卷图片</p>
            </div>
          </div>
          {/* Crop handles */}
          <div className="absolute top-4 left-4 w-5 h-5 border-t-3 border-l-3 border-brand rounded-tl cursor-move" />
          <div className="absolute top-4 right-4 w-5 h-5 border-t-3 border-r-3 border-brand rounded-tr cursor-move" />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-b-3 border-l-3 border-brand rounded-bl cursor-move" />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-b-3 border-r-3 border-brand rounded-br cursor-move" />
          {/* Semi-transparent overlay outside crop area */}
          <div className="absolute inset-0 border-[16px] border-black/30 pointer-events-none" />
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-6 flex items-center justify-between bg-gray-800">
        <button onClick={onRetake} className="text-white text-sm px-4 py-2 rounded-lg bg-white/10 active:bg-white/20">
          重拍
        </button>
        <button onClick={onRotate} className="text-white p-2 rounded-full bg-white/10 active:bg-white/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
        </button>
        <button onClick={onConfirm} className="text-white text-sm px-4 py-2 rounded-lg bg-brand active:bg-brand-dark">
          确认裁剪
        </button>
      </div>
    </div>
  )
}

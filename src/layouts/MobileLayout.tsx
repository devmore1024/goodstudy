import { ReactNode } from 'react'

function StatusBar() {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  return (
    <div className="flex items-center justify-between px-6 py-1.5 text-xs font-semibold text-gray-900">
      <span>{time}</span>
      <div className="flex items-center gap-1">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <rect x="0" y="6" width="3" height="6" rx="0.5" opacity="0.3"/>
          <rect x="4.5" y="4" width="3" height="8" rx="0.5" opacity="0.5"/>
          <rect x="9" y="2" width="3" height="10" rx="0.5" opacity="0.7"/>
          <rect x="13" y="0" width="3" height="12" rx="0.5"/>
        </svg>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="currentColor">
          <rect x="0" y="1" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none"/>
          <rect x="2" y="3" width="14" height="6" rx="1" fill="currentColor"/>
          <rect x="21" y="4" width="2" height="4" rx="0.5"/>
        </svg>
      </div>
    </div>
  )
}

export default function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
      {/* Desktop: phone frame */}
      <div className="hidden min-[431px]:flex flex-col w-[375px] h-[812px] bg-white rounded-[40px] shadow-2xl overflow-hidden relative border border-gray-300">
        <StatusBar />
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
        <div className="h-1 flex justify-center pb-2">
          <div className="w-32 h-1 bg-gray-900 rounded-full mt-1" />
        </div>
      </div>
      {/* Mobile: fullscreen */}
      <div className="min-[431px]:hidden w-full h-full bg-white flex flex-col overflow-hidden">
        <StatusBar />
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  )
}

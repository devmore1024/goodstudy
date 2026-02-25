import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  title?: string
  showBack?: boolean
  onBack?: () => void
  rightAction?: { label: string; onClick: () => void }
  rightElement?: ReactNode
}

export default function NavigationBar({ title, showBack = true, onBack, rightAction, rightElement }: Props) {
  const navigate = useNavigate()
  const handleBack = onBack || (() => navigate(-1))

  return (
    <div className="flex items-center justify-between px-4 py-3 glass border-b border-gray-100/30 relative z-10">
      <div className="w-16">
        {showBack && (
          <button onClick={handleBack} className="text-gray-600 p-1.5 rounded-xl hover:bg-gray-100/50 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
      </div>
      {title && <span className="text-base font-semibold text-gray-800">{title}</span>}
      <div className="w-16 flex justify-end">
        {rightElement}
        {rightAction && (
          <button onClick={rightAction.onClick} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            {rightAction.label}
          </button>
        )}
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'

interface Props {
  title?: string
  showBack?: boolean
  rightAction?: { label: string; onClick: () => void }
}

export default function NavigationBar({ title, showBack = true, rightAction }: Props) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm">
      <div className="w-16">
        {showBack && (
          <button onClick={() => navigate(-1)} className="text-gray-600 p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
      </div>
      {title && <span className="text-base font-medium text-gray-800">{title}</span>}
      <div className="w-16 text-right">
        {rightAction && (
          <button onClick={rightAction.onClick} className="text-sm text-gray-500">
            {rightAction.label}
          </button>
        )}
      </div>
    </div>
  )
}

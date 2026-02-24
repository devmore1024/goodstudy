import type { TeacherMode } from '../types'

interface Props {
  mode: TeacherMode
  className?: string
}

function AvatarSvg({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-lg">
      <defs>
        <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2BBB6E" />
          <stop offset="100%" stopColor="#4A90D9" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#avatarGrad)" />
      <circle cx="50" cy="38" r="16" fill="white" />
      <ellipse cx="50" cy="75" rx="24" ry="18" fill="white" />
      <circle cx="44" cy="36" r="3" fill="#333" />
      <circle cx="56" cy="36" r="3" fill="#333" />
      <path d="M 44 44 Q 50 50 56 44" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export default function TeacherAvatar({ mode, className = '' }: Props) {
  if (mode === 'hidden') return null

  if (mode === 'avatar') {
    return (
      <div className={`w-12 h-12 rounded-full overflow-hidden animate-breathe ${className}`}>
        <AvatarSvg size={48} />
      </div>
    )
  }

  if (mode === 'upper') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="w-40 h-50 flex items-end justify-center">
          <AvatarSvg size={120} />
        </div>
      </div>
    )
  }

  // full mode
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-50 h-70 flex items-end justify-center">
        <AvatarSvg size={180} />
      </div>
    </div>
  )
}

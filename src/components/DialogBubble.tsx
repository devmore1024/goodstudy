import { useTypewriter } from '../hooks/useTypewriter'
import BouncingDots from './BouncingDots'

interface Props {
  content: string
  role: 'ai' | 'user'
  animate?: boolean
  onTypingComplete?: () => void
}

export default function DialogBubble({ content, role, animate = false, onTypingComplete }: Props) {
  const { displayText, isComplete } = useTypewriter(
    animate ? content : '',
    150
  )

  const text = animate ? displayText : content

  if (isComplete && animate && onTypingComplete) {
    setTimeout(onTypingComplete, 0)
  }

  if (role === 'ai') {
    return (
      <div className="flex items-start gap-2 animate-slide-left">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-brand to-blue flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <circle cx="12" cy="10" r="5" />
            <ellipse cx="12" cy="20" rx="8" ry="5" />
          </svg>
        </div>
        <div className="max-w-[75%] bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
            {text}
            {animate && !isComplete && <span className="inline-block w-0.5 h-4 bg-brand ml-0.5 animate-pulse align-middle" />}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2 justify-end animate-slide-right">
      <div className="max-w-[75%] bg-brand-light rounded-2xl rounded-tr-sm px-4 py-3">
        <p className="text-sm text-gray-800 leading-relaxed">{text}</p>
      </div>
    </div>
  )
}

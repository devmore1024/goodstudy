import { useTypewriter } from '../hooks/useTypewriter'

interface Props {
  content: string
  role: 'ai' | 'user'
  animate?: boolean
  onTypingComplete?: () => void
}

const TEACHER_IMG = '/images/teacher.png'

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
      <div className="flex items-start gap-2.5 animate-slide-left">
        {/* Teacher avatar */}
        <div className="flex-shrink-0 relative">
          <div className="absolute inset-0 rounded-full bg-brand/15 blur-sm scale-125" />
          <img
            src={TEACHER_IMG}
            alt="小花老师"
            className="relative w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
        </div>
        {/* Bubble */}
        <div className="max-w-[78%] relative">
          {/* Triangle pointer */}
          <div className="absolute left-0 top-3 -translate-x-1.5 w-3 h-3 bg-white rotate-45 rounded-sm shadow-sm" />
          <div className="relative bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100/60">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {text}
              {animate && !isComplete && <span className="inline-block w-0.5 h-4 bg-brand ml-0.5 animate-pulse align-middle" />}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2 justify-end animate-slide-right">
      <div className="max-w-[78%] relative">
        {/* Triangle pointer */}
        <div className="absolute right-0 top-3 translate-x-1.5 w-3 h-3 bg-gradient-to-br from-brand-light to-brand-light rotate-45 rounded-sm" />
        <div className="relative bg-gradient-to-br from-brand-light to-[#d4f5e2] rounded-2xl rounded-tr-md px-4 py-3 shadow-[0_2px_8px_rgba(43,187,110,0.1)]">
          <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  )
}

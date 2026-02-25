import type { QuestionResult } from '../types'

interface Props {
  question: QuestionResult
  onStatusChange?: (id: number, status: QuestionResult['status']) => void
}

export default function QuestionCard({ question, onStatusChange }: Props) {
  const statusStyles: Record<string, { bg: string; iconBg: string; text: string; icon: string; border: string }> = {
    correct: { bg: 'bg-[#F0FFF4]', iconBg: 'bg-success/10', text: 'text-success', icon: '✓', border: 'border-success/15' },
    wrong: { bg: 'bg-[#FFF5F5]', iconBg: 'bg-error/10', text: 'text-error', icon: '✗', border: 'border-error/15' },
    uncertain: { bg: 'bg-[#FFFBF0]', iconBg: 'bg-warning/10', text: 'text-warning', icon: '?', border: 'border-warning/15' },
  }

  const s = statusStyles[question.status]

  return (
    <div className={`${s.bg} rounded-2xl p-3.5 border ${s.border} shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s.text} ${s.iconBg}`}>
          {s.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-400 font-medium">第{question.id}题</span>
            <span className="text-xs font-semibold">
              <span className={s.text}>{question.score}</span>
              <span className="text-gray-300">/{question.fullScore}分</span>
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{question.content}</p>
          {question.status === 'uncertain' && onStatusChange && (
            <div className="flex gap-2 mt-2.5">
              <button
                onClick={() => onStatusChange(question.id, 'correct')}
                className="text-xs px-4 py-1.5 rounded-full bg-white text-success border border-success/30 font-medium active:scale-95 transition-all shadow-sm"
              >
                正确
              </button>
              <button
                onClick={() => onStatusChange(question.id, 'wrong')}
                className="text-xs px-4 py-1.5 rounded-full bg-white text-error border border-error/30 font-medium active:scale-95 transition-all shadow-sm"
              >
                错误
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

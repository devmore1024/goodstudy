import type { QuestionResult } from '../types'

interface Props {
  question: QuestionResult
  onStatusChange?: (id: number, status: QuestionResult['status']) => void
}

export default function QuestionCard({ question, onStatusChange }: Props) {
  const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
    correct: { bg: 'bg-green-50', text: 'text-success', icon: '✓' },
    wrong: { bg: 'bg-red-50', text: 'text-error', icon: '✗' },
    uncertain: { bg: 'bg-yellow-50', text: 'text-warning', icon: '?' },
  }

  const s = statusColors[question.status]

  return (
    <div className={`${s.bg} rounded-xl p-3 border border-gray-100`}>
      <div className="flex items-start gap-3">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${s.text} bg-white shadow-sm`}>
          {s.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">第{question.id}题</span>
            <span className="text-xs font-medium">
              <span className={s.text}>{question.score}</span>
              <span className="text-gray-300">/{question.fullScore}分</span>
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{question.content}</p>
          {question.status === 'uncertain' && onStatusChange && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onStatusChange(question.id, 'correct')}
                className="text-xs px-3 py-1 rounded-full bg-white text-success border border-green-200"
              >
                正确
              </button>
              <button
                onClick={() => onStatusChange(question.id, 'wrong')}
                className="text-xs px-3 py-1 rounded-full bg-white text-error border border-red-200"
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

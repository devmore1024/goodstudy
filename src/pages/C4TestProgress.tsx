import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionButton from '../components/ActionButton'
import { quizQuestions } from '../mock/planData'

const TEACHER_IMG = '/images/teacher.png'

export default function C4TestProgress() {
  const navigate = useNavigate()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [marked, setMarked] = useState<Set<number>>(new Set())
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 min in seconds
  const [showNav, setShowNav] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const question = quizQuestions[currentIdx]
  const answeredCount = Object.keys(answers).length
  const markedCount = marked.size

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  // Auto-submit on time out
  useEffect(() => {
    if (timeLeft === 0) {
      navigate('/test/result')
    }
  }, [timeLeft, navigate])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const selectAnswer = useCallback((opt: string) => {
    const letter = opt.split('.')[0]
    setAnswers(prev => ({ ...prev, [question.id]: letter }))
  }, [question.id])

  const toggleMark = () => {
    setMarked(prev => {
      const next = new Set(prev)
      if (next.has(question.id)) next.delete(question.id)
      else next.add(question.id)
      return next
    })
  }

  const goNext = () => { if (currentIdx < quizQuestions.length - 1) setCurrentIdx(currentIdx + 1) }
  const goPrev = () => { if (currentIdx > 0) setCurrentIdx(currentIdx - 1) }

  const isLowTime = timeLeft < 5 * 60

  return (
    <div className="h-full flex flex-col bg-white relative overflow-hidden">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button
          onClick={() => setShowExitDialog(true)}
          className="text-sm text-gray-500 font-medium flex items-center gap-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          退出
        </button>
        <div className={`flex items-center gap-1 ${isLowTime ? 'text-error' : 'text-gray-700'}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span className={`text-sm font-bold tabular-nums ${isLowTime ? 'animate-pulse' : ''}`}>{formatTime(timeLeft)}</span>
        </div>
        <div className="relative">
          <img src={TEACHER_IMG} alt="小花老师" className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm" />
        </div>
      </div>

      {/* Progress dots */}
      <button
        onClick={() => setShowNav(!showNav)}
        className="px-4 py-2 border-b border-gray-50"
      >
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {quizQuestions.map((q, i) => {
            const answered = q.id in answers
            const isMarked = marked.has(q.id)
            const isCurrent = i === currentIdx
            return (
              <div
                key={q.id}
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[8px] font-bold transition-all ${
                  isCurrent ? 'bg-blue text-white ring-2 ring-blue/30 scale-110' :
                  isMarked ? 'bg-warning/20 text-warning border border-warning' :
                  answered ? 'bg-blue/20 text-blue' :
                  'bg-gray-100 text-gray-400'
                }`}
              >
                {isMarked ? '🚩' : i + 1}
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[10px] text-gray-400">{currentIdx + 1}/{quizQuestions.length}题</span>
          <span className="text-[10px] text-gray-400">已答{answeredCount}题</span>
          {markedCount > 0 && <span className="text-[10px] text-warning">标记{markedCount}题</span>}
        </div>
      </button>

      {/* Navigation panel */}
      {showNav && (
        <div className="absolute inset-x-0 top-24 z-50 bg-white border-b border-gray-100 shadow-lg p-4 animate-slide-up">
          <p className="text-xs text-gray-500 mb-3">答题进度导航</p>
          <div className="grid grid-cols-8 gap-2">
            {quizQuestions.map((q, i) => {
              const answered = q.id in answers
              const isMarked = marked.has(q.id)
              const isCurrent = i === currentIdx
              return (
                <button
                  key={q.id}
                  onClick={() => { setCurrentIdx(i); setShowNav(false) }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                    isCurrent ? 'bg-blue text-white' :
                    isMarked ? 'bg-warning/15 text-warning border border-warning' :
                    answered ? 'bg-blue/10 text-blue' :
                    'bg-gray-50 text-gray-400'
                  }`}
                >
                  {isMarked ? '🚩' : i + 1}
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue/10" />已答</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue" />当前</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-50 border" />未答</span>
            <span>🚩已标记</span>
          </div>
          <button onClick={() => setShowNav(false)} className="w-full mt-3 py-2 rounded-xl bg-gray-50 text-sm text-gray-500 font-medium">
            收起导航
          </button>
        </div>
      )}

      {/* Question card */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-800">第 {question.id} 题</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue/10 text-blue font-medium">{question.subject}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{question.type}</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{question.content}</p>
        </div>

        {/* Options */}
        {question.options && (
          <div className="space-y-3">
            {question.options.map((opt, i) => {
              const letter = opt.split('.')[0]
              const selected = answers[question.id] === letter
              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(opt)}
                  className={`w-full text-left p-4 rounded-2xl text-sm transition-all active:scale-[0.98] ${
                    selected
                      ? 'bg-blue/10 border-2 border-blue text-blue font-medium'
                      : 'bg-gray-50 border-2 border-transparent text-gray-700'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span>{opt}</span>
                    {selected && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A90D9" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Mark button */}
        <button
          onClick={toggleMark}
          className={`mt-4 w-full py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.97] ${
            marked.has(question.id)
              ? 'bg-warning/10 text-warning border border-warning'
              : 'bg-gray-50 text-gray-400 border border-transparent'
          }`}
        >
          🚩 {marked.has(question.id) ? '取消标记' : '标记本题'}
        </button>
      </div>

      {/* Bottom navigation */}
      <div className="px-4 py-3 border-t border-gray-100 space-y-2">
        <div className="flex gap-3">
          {currentIdx > 0 && (
            <button onClick={goPrev} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-600 font-medium active:scale-[0.97] transition-all">
              ← 上一题
            </button>
          )}
          {currentIdx < quizQuestions.length - 1 ? (
            <button onClick={goNext} className="flex-1 py-2.5 rounded-xl bg-blue/10 text-sm text-blue font-semibold active:scale-[0.97] transition-all">
              下一题 →
            </button>
          ) : (
            <button onClick={() => setShowNav(true)} className="flex-1 py-2.5 rounded-xl bg-blue/10 text-sm text-blue font-semibold active:scale-[0.97] transition-all">
              查看全部
            </button>
          )}
        </div>
        <ActionButton variant="gradient" fullWidth onClick={() => setShowSubmitDialog(true)}>
          提交测评
        </ActionButton>
      </div>

      {/* Submit dialog */}
      {showSubmitDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-6 mx-6 w-full max-w-sm animate-scale-in">
            <h3 className="text-lg font-bold text-gray-800 text-center mb-4">确认提交测评？</h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>已答：<span className="font-semibold">{answeredCount}题</span></p>
              <p>未答：<span className="font-semibold text-error">{quizQuestions.length - answeredCount}题</span></p>
              {markedCount > 0 && <p>已标记：<span className="font-semibold text-warning">{markedCount}题</span></p>}
            </div>
            {quizQuestions.length - answeredCount > 0 && (
              <p className="text-xs text-error mb-4">⚠️ 还有{quizQuestions.length - answeredCount}题未作答，提交后不可修改</p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowSubmitDialog(false)} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-600 font-medium">
                继续答题
              </button>
              <button onClick={() => navigate('/test/result')} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange to-orange-dark text-white text-sm font-semibold">
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit dialog */}
      {showExitDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-6 mx-6 w-full max-w-sm animate-scale-in">
            <h3 className="text-lg font-bold text-gray-800 text-center mb-2">确定退出测评吗？</h3>
            <p className="text-sm text-gray-500 text-center mb-6">退出后本次测评将不会保存，需要重新开始</p>
            <div className="flex gap-3">
              <button onClick={() => setShowExitDialog(false)} className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold">
                继续测评
              </button>
              <button onClick={() => navigate(-1)} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-600 font-medium">
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

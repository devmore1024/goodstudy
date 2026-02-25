import { useState, useEffect, useRef } from 'react'

type Scenario = 'ai-thinking' | 'ocr-scanning' | 'quiz-generating' | 'generic'
type TimeoutPhase = 'normal' | 'long-wait' | 'timeout'

interface Props {
  visible: boolean
  scenario: Scenario
  progress?: number          // 0-100 for determinate progress
  progressText?: string      // e.g. "已生成 2/5 题"
  onRetry?: () => void
  onCancel?: () => void
}

const TEACHER_IMG = '/images/teacher.png'

const scenarioConfig: Record<Scenario, {
  title: string
  teacherExpression: string
  longWaitTitle: string
}> = {
  'ai-thinking': {
    title: '小花老师正在思考中...',
    teacherExpression: '思考中',
    longWaitTitle: '处理时间较长，请耐心等待',
  },
  'ocr-scanning': {
    title: '正在识别题目内容...',
    teacherExpression: '专注识别',
    longWaitTitle: '图片内容较多，请耐心等待',
  },
  'quiz-generating': {
    title: '正在为你出题，请稍等...',
    teacherExpression: '认真出题',
    longWaitTitle: '题目较多，请耐心等待',
  },
  generic: {
    title: '加载中...',
    teacherExpression: '',
    longWaitTitle: '加载时间较长，请耐心等待',
  },
}

const funFacts = [
  '你知道吗？圆周率的前6位是3.14159',
  '小贴士：每天坚持练习15分钟，效果比一次学2小时还好哦',
  '趣味数学：0.999...（无限循环）其实等于1',
  '学习小技巧：用费曼学习法，把知识讲给别人听',
  '你知道吗？地球到月球的距离大约是38万公里',
]

// Spinning loader
function Spinner({ size = 40, color = '#2BBB6E' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="animate-spin">
      <circle cx="20" cy="20" r="16" fill="none" stroke="#E5E7EB" strokeWidth="3" />
      <circle cx="20" cy="20" r="16" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
        strokeDasharray="80" strokeDashoffset="60" />
    </svg>
  )
}

// Brain gear animation for AI thinking
function BrainGearAnim() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-brand/10 animate-breathe" />
      <div className="text-4xl animate-spin" style={{ animationDuration: '3s' }}>🧠</div>
      <div className="absolute -top-1 -right-1 text-lg animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>⚙️</div>
    </div>
  )
}

// OCR scan animation
function ScanAnim() {
  return (
    <div className="relative w-full h-28 bg-gray-100 rounded-xl overflow-hidden">
      <div className="absolute inset-x-0 h-0.5 bg-blue/60"
        style={{
          animation: 'scan-line 2s ease-in-out infinite',
        }}
      />
      {/* Simulated text lines */}
      <div className="p-3 space-y-2">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="h-2.5 bg-gray-200 rounded-full" style={{ width: `${70 + i * 8}%` }} />
        ))}
      </div>
      <style>{`
        @keyframes scan-line {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  )
}

// Pencil writing animation
function PencilAnim() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-blue-light animate-breathe" />
      <div className="text-4xl" style={{ animation: 'pencil-write 1.5s ease-in-out infinite' }}>✏️</div>
      <style>{`
        @keyframes pencil-write {
          0%, 100% { transform: translate(0, 0) rotate(-15deg); }
          25% { transform: translate(4px, 2px) rotate(-10deg); }
          50% { transform: translate(8px, 0) rotate(-15deg); }
          75% { transform: translate(4px, -2px) rotate(-20deg); }
        }
      `}</style>
    </div>
  )
}

export default function G3LoadingState({ visible, scenario, progress, progressText, onRetry, onCancel }: Props) {
  const [timeoutPhase, setTimeoutPhase] = useState<TimeoutPhase>('normal')
  const [factIdx, setFactIdx] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const factTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const config = scenarioConfig[scenario]

  // Timeout progression
  useEffect(() => {
    if (!visible) {
      setTimeoutPhase('normal')
      setFactIdx(0)
      return
    }

    // 15s → long-wait
    timerRef.current = setTimeout(() => {
      setTimeoutPhase('long-wait')
    }, 15000)

    // 30s → timeout
    const t2 = setTimeout(() => {
      setTimeoutPhase('timeout')
    }, 30000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      clearTimeout(t2)
    }
  }, [visible])

  // Fun facts rotation
  useEffect(() => {
    if (!visible || scenario !== 'ai-thinking') return
    factTimerRef.current = setInterval(() => {
      setFactIdx(prev => (prev + 1) % funFacts.length)
    }, 5000)
    return () => { if (factTimerRef.current) clearInterval(factTimerRef.current) }
  }, [visible, scenario])

  if (!visible) return null

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8">
      {/* Teacher (not shown for generic) */}
      {scenario !== 'generic' && timeoutPhase !== 'timeout' && (
        <div className="relative mb-3">
          <div className="absolute inset-0 rounded-full bg-brand/10 blur-lg scale-150" />
          <img src={TEACHER_IMG} alt="小花老师" className="relative w-20 h-20 rounded-full object-cover ring-2 ring-white shadow-lg" />
        </div>
      )}

      {timeoutPhase !== 'timeout' && scenario !== 'generic' && (
        <p className="text-[10px] text-gray-400 mb-4">
          {timeoutPhase === 'long-wait' ? '加油中...' : config.teacherExpression}
        </p>
      )}

      {/* Animation area */}
      {timeoutPhase !== 'timeout' && (
        <div className="mb-4">
          {scenario === 'ai-thinking' && <BrainGearAnim />}
          {scenario === 'ocr-scanning' && <ScanAnim />}
          {scenario === 'quiz-generating' && <PencilAnim />}
          {scenario === 'generic' && <Spinner size={48} />}
        </div>
      )}

      {/* Title */}
      <p className={`text-sm font-medium mb-3 text-center ${timeoutPhase === 'long-wait' ? 'text-orange' : 'text-gray-600'}`}>
        {timeoutPhase === 'timeout' ? '' : (timeoutPhase === 'long-wait' ? config.longWaitTitle : config.title)}
      </p>

      {/* Progress bar */}
      {progress !== undefined && timeoutPhase !== 'timeout' && (
        <div className="w-full max-w-xs mb-2">
          {progressText && (
            <p className="text-xs text-gray-500 text-center mb-1.5">{progressText}</p>
          )}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-1">{progress}%</p>
        </div>
      )}

      {/* Fun facts card (AI thinking only) */}
      {scenario === 'ai-thinking' && timeoutPhase !== 'timeout' && (
        <div className="w-full max-w-xs bg-brand-light/50 rounded-xl p-3 mt-2">
          <p className="text-xs text-gray-500 leading-relaxed text-center">
            {funFacts[factIdx]}
          </p>
        </div>
      )}

      {/* Timeout state */}
      {timeoutPhase === 'timeout' && (
        <div className="flex flex-col items-center">
          {scenario !== 'generic' && (
            <>
              <img src={TEACHER_IMG} alt="小花老师" className="w-20 h-20 rounded-full object-cover ring-2 ring-white shadow-lg mb-2" />
              <p className="text-[10px] text-gray-400 mb-2">抱歉...</p>
            </>
          )}
          <p className="text-sm text-gray-600 font-medium mb-1">"不好意思，等太久了"</p>
          <div className="w-full max-w-xs bg-gray-50 rounded-xl p-4 mt-3">
            <p className="text-sm text-gray-600 text-center mb-4">处理时间过长，你可以：</p>
            <div className="flex gap-3">
              <button
                onClick={onRetry}
                className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold active:scale-95 transition-all"
              >
                重试
              </button>
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-600 font-medium active:scale-95 transition-all"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'

const TEACHER_IMG = '/images/teacher.png'

type Phase = 'wake' | 'listening' | 'processing' | 'responding'

interface Props {
  visible: boolean
  onClose: () => void
  onNavigate?: (route: string) => void
}

// Simulated waveform
function WaveformBars({ active }: { active: boolean }) {
  const [bars, setBars] = useState<number[]>(Array(16).fill(15))
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (active) {
      ref.current = setInterval(() => {
        setBars(Array.from({ length: 16 }, () => Math.random() * 85 + 15))
      }, 80)
    } else {
      if (ref.current) clearInterval(ref.current)
      setBars(Array(16).fill(15))
    }
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [active])

  return (
    <div className="flex items-center justify-center gap-0.5 h-10">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-75 ${active ? 'bg-error' : 'bg-blue/40'}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  )
}

// Waiting dots animation
function WaitingDots() {
  return (
    <div className="flex items-center justify-center gap-1.5 h-10">
      {[0, 1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-blue"
          style={{
            animation: `bounce-dot 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

// Thinking dots
function ThinkingDots() {
  return (
    <div className="flex items-center justify-center gap-1 py-3">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400"
          style={{
            animation: `bounce-dot 0.8s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default function G1VoiceOverlay({ visible, onClose, onNavigate }: Props) {
  const [phase, setPhase] = useState<Phase>('wake')
  const [recognizedText, setRecognizedText] = useState('')
  const [responseText, setResponseText] = useState('')
  const [displayedResponse, setDisplayedResponse] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Reset on open
  useEffect(() => {
    if (visible) {
      setPhase('wake')
      setRecognizedText('')
      setResponseText('')
      setDisplayedResponse('')
      setIsRecording(false)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (typewriterRef.current) clearInterval(typewriterRef.current)
    }
  }, [visible])

  // Typewriter effect for response
  useEffect(() => {
    if (phase === 'responding' && responseText) {
      let idx = 0
      setDisplayedResponse('')
      typewriterRef.current = setInterval(() => {
        idx++
        setDisplayedResponse(responseText.slice(0, idx))
        if (idx >= responseText.length) {
          if (typewriterRef.current) clearInterval(typewriterRef.current)
        }
      }, 30)
    }
    return () => { if (typewriterRef.current) clearInterval(typewriterRef.current) }
  }, [phase, responseText])

  const handleStartListening = () => {
    setPhase('listening')
    setIsRecording(true)
    setRecognizedText('')
    // Simulate real-time recognition
    const texts = ['这道', '这道数学', '这道数学题', '这道数学题怎么', '这道数学题怎么解？']
    let idx = 0
    timerRef.current = setInterval(() => {
      if (idx < texts.length) {
        setRecognizedText(texts[idx])
        idx++
      } else {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }, 400) as unknown as ReturnType<typeof setTimeout>
  }

  const handleStopListening = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRecording(false)
    setRecognizedText('这道数学题怎么解？')
    setPhase('processing')

    // Simulate AI thinking
    timerRef.current = setTimeout(() => {
      setResponseText('这道题我们可以用分步法来解。首先，我们把等式两边同时减去3，然后再除以系数2，就能得到x的值了。要不要我带你一步步算一下？')
      setPhase('responding')
    }, 2000)
  }

  const handleContinue = () => {
    setPhase('wake')
    setRecognizedText('')
    setResponseText('')
    setDisplayedResponse('')
  }

  const teacherExpression = {
    wake: '微笑等待中',
    listening: '认真倾听中',
    processing: '思考中...',
    responding: '讲解中',
  }

  if (!visible) return null

  return (
    <div className="absolute inset-0 z-[70] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={phase === 'responding' ? undefined : onClose} />

      {/* Card */}
      <div className="relative w-[85%] max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up z-10">
        <div className="p-6 flex flex-col items-center">
          {/* Teacher avatar */}
          <div className="relative mb-3">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand/20 to-blue/15 blur-lg scale-150" />
            <img
              src={TEACHER_IMG}
              alt="小花老师"
              className="relative w-24 h-24 rounded-full object-cover ring-3 ring-white shadow-xl"
            />
          </div>
          <p className="text-[10px] text-gray-400 mb-4">{teacherExpression[phase]}</p>

          {/* Wake phase */}
          {phase === 'wake' && (
            <>
              <p className="text-sm text-gray-600 font-medium mb-4">"我在呢，请说~"</p>
              <WaitingDots />
              <button
                onMouseDown={handleStartListening}
                onTouchStart={handleStartListening}
                className="mt-4 w-16 h-16 rounded-full bg-brand flex items-center justify-center shadow-lg btn-glow-brand active:scale-90 transition-all"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>
              <p className="text-xs text-gray-400 mt-2">点击说话</p>
            </>
          )}

          {/* Listening phase */}
          {phase === 'listening' && (
            <>
              <div className="w-full bg-gray-50 rounded-xl p-3 mb-4 min-h-[48px]">
                <p className="text-sm text-gray-700">
                  {recognizedText || <span className="text-gray-300">正在聆听...</span>}
                  <span className="inline-block w-0.5 h-4 bg-brand ml-0.5 animate-pulse" />
                </p>
              </div>
              <WaveformBars active={isRecording} />
              <button
                onMouseUp={handleStopListening}
                onTouchEnd={handleStopListening}
                className="mt-4 w-16 h-16 rounded-full bg-error flex items-center justify-center shadow-lg animate-pulse active:scale-90 transition-all"
              >
                <div className="w-5 h-5 rounded-sm bg-white" />
              </button>
              <p className="text-xs text-gray-400 mt-2">松开结束</p>
            </>
          )}

          {/* Processing phase */}
          {phase === 'processing' && (
            <>
              <div className="w-full bg-gray-50 rounded-xl p-3 mb-4">
                <p className="text-sm text-gray-700">"{recognizedText}"</p>
              </div>
              <ThinkingDots />
              <p className="text-sm text-gray-400 mt-1">思考中...</p>
            </>
          )}

          {/* Responding phase */}
          {phase === 'responding' && (
            <>
              <div className="w-full bg-gray-50 rounded-xl p-3 mb-3 max-h-48 overflow-y-auto scrollbar-hide">
                <p className="text-sm text-gray-700 leading-relaxed">{displayedResponse}</p>
              </div>

              {/* Audio progress */}
              <div className="w-full flex items-center gap-2 mb-4 px-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#4A90D9" className="flex-shrink-0">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue rounded-full" style={{ width: displayedResponse.length < responseText.length ? `${(displayedResponse.length / responseText.length) * 100}%` : '100%' }} />
                </div>
                <span className="text-[10px] text-gray-400 tabular-nums">0:12</span>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={handleContinue}
                  className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold active:scale-[0.97] transition-all"
                >
                  继续提问
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-600 font-medium active:scale-[0.97] transition-all"
                >
                  结束
                </button>
              </div>
            </>
          )}
        </div>

        {/* Close hint */}
        {phase !== 'responding' && (
          <p className="text-center text-[10px] text-gray-300 pb-3">点击空白区域关闭</p>
        )}
      </div>
    </div>
  )
}

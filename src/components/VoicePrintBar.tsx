import { useState, useEffect, useRef } from 'react'

interface Props {
  onComplete: () => void
  autoStart?: boolean
}

export default function VoicePrintBar({ onComplete, autoStart = true }: Props) {
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(false)
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (autoStart && !active) {
      setActive(true)
    }
  }, [autoStart, active])

  useEffect(() => {
    if (!active) return
    let completionTimer: ReturnType<typeof setTimeout> | null = null
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          if (!completedRef.current) {
            completedRef.current = true
            completionTimer = setTimeout(() => onCompleteRef.current(), 500)
          }
          return 100
        }
        return prev + 2
      })
    }, 80)
    return () => {
      clearInterval(timer)
      if (completionTimer) clearTimeout(completionTimer)
    }
  }, [active])

  return (
    <div className="w-full animate-slide-up">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-1">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-brand transition-all duration-200"
              style={{
                height: `${8 + Math.sin((progress / 10 + i) * 0.8) * 12}px`,
                opacity: progress > (i / 12) * 100 ? 1 : 0.3,
              }}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">{progress}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand to-blue rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1.5 text-center">
        {progress < 100 ? '正在采集声纹...' : '声纹采集完成！'}
      </p>
    </div>
  )
}

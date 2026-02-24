import { useState, useRef, useCallback } from 'react'

export function useCountdown(seconds: number = 60) {
  const [count, setCount] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  const start = useCallback(() => {
    setCount(seconds)
    setIsActive(true)
    timerRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          setIsActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [seconds])

  const reset = useCallback(() => {
    clearInterval(timerRef.current)
    setCount(0)
    setIsActive(false)
  }, [])

  return { count, isActive, start, reset }
}

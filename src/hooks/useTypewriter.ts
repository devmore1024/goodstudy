import { useState, useEffect, useRef, useCallback } from 'react'

export function useTypewriter(text: string, speed: number = 150) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const indexRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    setDisplayText('')
    setIsComplete(false)
    indexRef.current = 0

    if (!text) {
      setIsComplete(true)
      return
    }

    timerRef.current = setInterval(() => {
      indexRef.current++
      setDisplayText(text.slice(0, indexRef.current))
      if (indexRef.current >= text.length) {
        clearInterval(timerRef.current)
        setIsComplete(true)
      }
    }, speed)

    return () => clearInterval(timerRef.current)
  }, [text, speed])

  const reset = useCallback(() => {
    clearInterval(timerRef.current)
    setDisplayText('')
    setIsComplete(false)
    indexRef.current = 0
  }, [])

  const complete = useCallback(() => {
    clearInterval(timerRef.current)
    setDisplayText(text)
    setIsComplete(true)
  }, [text])

  return { displayText, isComplete, reset, complete }
}

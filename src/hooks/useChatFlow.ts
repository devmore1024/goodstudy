import { useState, useCallback, useRef } from 'react'
import type { ChatMessage, ChatFlowConfig, ChatFlowStep } from '../types'

let msgId = 0
function createMessage(role: ChatMessage['role'], content: string, step?: ChatFlowStep): ChatMessage {
  return {
    id: String(++msgId),
    role,
    content,
    timestamp: Date.now(),
    inputType: step?.inputType,
    inputConfig: step?.inputConfig,
  }
}

export function useChatFlow(config: ChatFlowConfig) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentStepId, setCurrentStepId] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const profileRef = useRef<Record<string, string>>({})
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const processingRef = useRef(false)

  const getStep = (id: string) => config.steps.find(s => s.id === id)

  const replaceVars = (text: string) => {
    let result = text
    Object.entries(profileRef.current).forEach(([key, val]) => {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), val)
    })
    return result
  }

  const advanceToStep = useCallback((stepId: string) => {
    const step = config.steps.find(s => s.id === stepId)
    if (!step) {
      setIsComplete(true)
      return
    }
    setCurrentStepId(stepId)
    setIsTyping(true)

    // Clear any pending timer to prevent duplicate messages (React StrictMode)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      processingRef.current = false
      const content = replaceVars(step.aiMessage)
      setMessages(prev => [...prev, createMessage('ai', content, step)])
      setIsTyping(false)
    }, 800)
  }, [config.steps])

  const start = useCallback(() => {
    // Clear any pending timer from a previous start call (React StrictMode double-mount)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setMessages([])
    setIsComplete(false)
    profileRef.current = {}
    advanceToStep(config.initialStep)
  }, [config.initialStep, advanceToStep])

  const submitAnswer = useCallback((answer: string) => {
    if (!currentStepId) return
    // Prevent duplicate submissions (e.g. VoicePrintBar effect firing twice)
    if (processingRef.current) return
    processingRef.current = true

    const step = getStep(currentStepId)
    if (!step) {
      processingRef.current = false
      return
    }

    if (step.fieldKey) {
      profileRef.current[step.fieldKey] = answer
    }

    setMessages(prev => [...prev, createMessage('user', answer)])

    const nextId = typeof step.nextStep === 'function' ? step.nextStep(answer) : step.nextStep
    if (nextId) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        processingRef.current = false
        advanceToStep(nextId)
      }, 500)
    } else {
      processingRef.current = false
      setIsComplete(true)
    }
  }, [currentStepId, advanceToStep])

  return {
    messages,
    currentStepId,
    isTyping,
    isComplete,
    profile: profileRef.current,
    start,
    submitAnswer,
    advanceToStep,
  }
}

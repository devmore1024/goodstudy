import { useRef, useEffect, ReactNode } from 'react'
import type { ChatMessage } from '../types'
import DialogBubble from './DialogBubble'
import BouncingDots from './BouncingDots'

interface Props {
  messages: ChatMessage[]
  isTyping: boolean
  renderInput?: (msg: ChatMessage) => ReactNode
  lastMessageAnimate?: boolean
}

export default function ChatMessageList({ messages, isTyping, renderInput, lastMessageAnimate }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isTyping])

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-4">
      {messages.map((msg, i) => {
        const isLast = i === messages.length - 1
        return (
          <div key={msg.id}>
            <DialogBubble
              content={msg.content}
              role={msg.role === 'ai' ? 'ai' : 'user'}
              animate={lastMessageAnimate && isLast && msg.role === 'ai'}
            />
            {isLast && msg.role === 'ai' && msg.inputType && renderInput?.(msg)}
          </div>
        )
      })}
      {isTyping && (
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-blue flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="10" r="5" />
              <ellipse cx="12" cy="20" rx="8" ry="5" />
            </svg>
          </div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <BouncingDots />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}

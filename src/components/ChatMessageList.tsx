import { useRef, useEffect, ReactNode } from 'react'
import type { ChatMessage } from '../types'
import DialogBubble from './DialogBubble'
import BouncingDots from './BouncingDots'

const TEACHER_IMG = '/images/teacher.png'

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
        <div className="flex items-start gap-2.5">
          <div className="flex-shrink-0 relative">
            <div className="absolute inset-0 rounded-full bg-brand/15 blur-sm scale-125" />
            <img
              src={TEACHER_IMG}
              alt="小花老师"
              className="relative w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
          </div>
          <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100/60">
            <BouncingDots />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}

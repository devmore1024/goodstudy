import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import TeacherAvatar from '../components/TeacherAvatar'
import DialogBubble from '../components/DialogBubble'
import ChatInputBar from '../components/ChatInputBar'
import { mockD3TeacherReplies } from '../mock/d3Data'

function toast(msg: string) {
  const el = document.createElement('div')
  el.textContent = msg
  Object.assign(el.style, {
    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
    background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '10px 20px',
    borderRadius: '8px', fontSize: '14px', zIndex: '9999', pointerEvents: 'none',
  })
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 1800)
}

interface ChatMessage {
  id: number
  role: 'ai' | 'user'
  content: string
}

function getReply(input: string): string {
  const text = input.trim()
  for (const [keyword, reply] of Object.entries(mockD3TeacherReplies)) {
    if (keyword !== 'default' && text.includes(keyword)) {
      return reply
    }
  }
  return mockD3TeacherReplies['default']
}

const suggestedQuestions = [
  '这道应用题不会做',
  '通分怎么做？',
  '四则运算的优先级是什么？',
]

export default function D3QA() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'ai', content: '你好呀！有什么不明白的题目吗？可以拍照或者打字告诉我~' },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const msgIdRef = useRef(2)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const sendMessage = (text: string) => {
    if (!text.trim() || thinking) return
    const userMsg: ChatMessage = { id: msgIdRef.current++, role: 'user', content: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setThinking(true)

    setTimeout(() => {
      const reply = getReply(text)
      const aiMsg: ChatMessage = { id: msgIdRef.current++, role: 'ai', content: reply }
      setMessages(prev => [...prev, aiMsg])
      setThinking(false)
    }, 800)
  }

  const handleSend = () => sendMessage(input)

  const showOnlyWelcome = messages.length === 1

  return (
    <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
      <NavigationBar
        title="实时答疑 · 数学"
        onBack={() => navigate(-1)}
        rightElement={
          <button
            onClick={() => navigate('/qa/history')}
            className="p-1.5 rounded-xl hover:bg-gray-100/50 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>
        }
      />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-4">
        {messages.map(msg => (
          <DialogBubble key={msg.id} content={msg.content} role={msg.role} />
        ))}

        {/* Thinking indicator */}
        {thinking && (
          <div className="flex items-start gap-2.5 animate-slide-left">
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 rounded-full bg-brand/15 blur-sm scale-125" />
              <TeacherAvatar mode="avatar" className="relative w-9 h-9" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100/60">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-gray-300 rounded-full"
                    style={{
                      animation: 'thinkingDot 0.8s infinite',
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
              <style>{`
                @keyframes thinkingDot {
                  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                  40% { transform: translateY(-6px); opacity: 1; }
                }
              `}</style>
            </div>
          </div>
        )}

        {/* Suggested questions (only when welcome message) */}
        {showOnlyWelcome && (
          <div className="animate-slide-up">
            <p className="text-xs text-gray-400 mb-2">试试问我这些问题：</p>
            <div className="space-y-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="block w-full text-left bg-white rounded-xl px-4 py-3 text-sm text-gray-700 shadow-sm border border-gray-100/60 hover:border-brand/30 transition-colors"
                >
                  💡 {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <ChatInputBar
        value={input}
        onChange={setInput}
        onSend={handleSend}
        onVoiceResult={(text) => sendMessage(text)}
        disabled={thinking}
        placeholder="输入你的问题..."
      />
    </div>
  )
}

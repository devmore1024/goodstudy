import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import TeacherAvatar from '../components/TeacherAvatar'
import DialogBubble from '../components/DialogBubble'
import ChatInputBar from '../components/ChatInputBar'
import { mockD2Questions, mockTeacherReplies } from '../mock/d2Data'
import type { D2Question } from '../mock/d2Data'

interface ChatMessage {
  id: number
  role: 'ai' | 'user'
  content: string
}

function getTeacherReply(input: string): string {
  const text = input.trim()
  for (const [keyword, reply] of Object.entries(mockTeacherReplies)) {
    if (keyword !== 'default' && text.includes(keyword)) {
      return reply
    }
  }
  return mockTeacherReplies['default']
}

type Step = 'camera' | 'crop' | 'loading' | 'result'

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

/* ─── Step 1: Camera ─── */
function CameraStep({ onCapture, onBack, onHistory }: { onCapture: () => void; onBack: () => void; onHistory: () => void }) {
  const [flash, setFlash] = useState(false)

  const handleCapture = () => {
    setFlash(true)
    setTimeout(() => { setFlash(false); onCapture() }, 200)
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white relative overflow-hidden">
      {/* Shutter flash */}
      {flash && <div className="absolute inset-0 bg-white z-50 animate-fade-out" />}

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 relative z-10">
        <button onClick={onBack} className="p-1.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="text-base font-semibold">拍照判题</span>
        <div className="flex items-center gap-3">
          <button onClick={() => toast('闪光灯切换')} className="p-1.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </button>
          <button onClick={onHistory} className="p-1.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>
          <button onClick={() => toast('拍照帮助：将试卷平放，确保光线充足')} className="p-1.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      {/* Viewfinder area */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="relative w-full aspect-[3/4] border-2 border-dashed border-white/40 rounded-lg">
          {/* Corner markers */}
          {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2',
            'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2',
          ].map((cls, i) => (
            <div key={i} className={`absolute ${cls} border-white w-6 h-6 rounded-sm`} />
          ))}

          {/* Center hint */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-sm text-white/70">请将试卷/作业对准此区域</p>
          </div>

          {/* Recognition label */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <span className="bg-white/15 text-white/80 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
              自动识别题目中
            </span>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-around px-8 pb-8 pt-4">
        <button onClick={() => toast('相册功能暂未开放')} className="flex flex-col items-center gap-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="text-xs text-white/70">相册</span>
        </button>

        {/* Shutter button */}
        <button
          onClick={handleCapture}
          className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-white" />
        </button>

        <button onClick={() => toast('多页模式暂未开放')} className="flex flex-col items-center gap-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="6" width="15" height="15" rx="2" />
            <path d="M7 3h12a2 2 0 0 1 2 2v12" />
          </svg>
          <span className="text-xs text-white/70">多页</span>
        </button>
      </div>
    </div>
  )
}

/* ─── Step 2: Crop ─── */
function CropStep({ onRetake, onJudge, onBack }: { onRetake: () => void; onJudge: () => void; onBack: () => void }) {
  return (
    <div className="h-full flex flex-col bg-gray-900 text-white relative overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center px-4 py-3 relative z-10">
        <button onClick={onBack} className="p-1.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="text-base font-semibold ml-3">裁剪确认</span>
      </div>

      {/* Crop area */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="relative w-full">
          {/* Dim overlay */}
          <div className="absolute -inset-4 bg-black/50 rounded-lg" />

          {/* Simulated paper */}
          <div className="relative bg-white rounded-lg p-5 text-gray-800 text-sm leading-relaxed">
            <p className="mb-2 font-medium">1. 3/4 + 1/2 = <span className="text-blue">5/4</span></p>
            <p className="mb-2 font-medium">2. 5 × 3 - 7 = <span className="text-blue">8</span></p>
            <p className="mb-2 font-medium">3. 12 ÷ 4 + 2 = <span className="text-blue">4</span></p>
            <p className="font-medium">4. 8 - 3/5 = <span className="text-blue">37/5</span></p>

            {/* Crop handles */}
            {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} w-5 h-5 border-2 border-brand rounded-sm -translate-x-1/2 -translate-y-1/2`}
                style={{ transform: `translate(${pos.includes('right') ? '50%' : '-50%'}, ${pos.includes('bottom') ? '50%' : '-50%'})` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recognition hint */}
      <p className="text-center text-sm text-white/70 mb-4">识别到 4 道题目</p>

      {/* Bottom actions */}
      <div className="flex items-center justify-center gap-4 px-6 pb-8">
        <button
          onClick={() => toast('旋转功能演示')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          旋转
        </button>
        <button
          onClick={onRetake}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          重拍
        </button>
        <button
          onClick={onJudge}
          className="flex-1 py-2.5 bg-brand text-white rounded-xl font-semibold text-sm btn-glow-brand"
        >
          开始判题
        </button>
      </div>
    </div>
  )
}

/* ─── Step 3a: Loading ─── */
function LoadingStep() {
  return (
    <div className="h-full flex flex-col bg-gray-900 text-white items-center justify-center relative overflow-hidden">
      {/* Simulated paper with scan line */}
      <div className="relative w-64 bg-white rounded-lg p-5 text-gray-800 text-sm leading-relaxed overflow-hidden">
        <p className="mb-2">1. 3/4 + 1/2 = 5/4</p>
        <p className="mb-2">2. 5 × 3 - 7 = 8</p>
        <p className="mb-2">3. 12 ÷ 4 + 2 = 4</p>
        <p>4. 8 - 3/5 = 37/5</p>

        {/* Scan line */}
        <div
          className="absolute left-0 right-0 h-0.5 bg-brand shadow-[0_0_12px_2px_rgba(43,187,110,0.5)]"
          style={{
            animation: 'scanLine 2s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes scanLine {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
          }
        `}</style>
      </div>

      <p className="mt-6 text-sm text-white/70">正在识别中，请稍候…</p>
    </div>
  )
}

/* ─── Step 3b: Result ─── */
function ResultStep({ onBack }: { onBack: () => void }) {
  const questions = mockD2Questions
  const correctCount = questions.filter(q => q.isCorrect).length
  const total = questions.length
  const accuracy = Math.round((correctCount / total) * 100)

  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [errorBookIds, setErrorBookIds] = useState<Set<number>>(new Set())

  // Chat panel state
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'ai', content: '这几道题有什么不明白的吗？告诉我，我来帮你讲解～' },
  ])
  const [chatInput, setChatInput] = useState('')
  const msgIdRef = useRef(2)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleSendChat = () => {
    const text = chatInput.trim()
    if (!text) return
    const userMsg: ChatMessage = { id: msgIdRef.current++, role: 'user', content: text }
    setChatMessages(prev => [...prev, userMsg])
    setChatInput('')

    // Simulate AI reply with delay
    setTimeout(() => {
      const reply = getTeacherReply(text)
      const aiMsg: ChatMessage = { id: msgIdRef.current++, role: 'ai', content: reply }
      setChatMessages(prev => [...prev, aiMsg])
    }, 600)
  }

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleErrorBook = (id: number) => {
    setErrorBookIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
      <NavigationBar
        title="判题结果"
        onBack={onBack}
        rightAction={{ label: '分享', onClick: () => toast('分享功能暂未开放') }}
        rightElement={
          <div className="mr-2" onClick={() => toast('小花老师语音讲解')}>
            <TeacherAvatar mode="avatar" className="w-8 h-8 cursor-pointer" />
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-24">
        {/* Summary card */}
        <div className="bg-white rounded-2xl p-4 card-glow mt-3 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-2xl font-black text-gray-800">{correctCount}</span>
              <span className="text-sm text-gray-400">/{total} 正确</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-brand">{accuracy}%</span>
              <p className="text-xs text-gray-400">正确率</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand to-blue rounded-full transition-all duration-700"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>

        {/* Question list */}
        <div className="mt-4 space-y-3">
          {questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              expanded={expandedIds.has(q.id)}
              inErrorBook={errorBookIds.has(q.id)}
              onToggleExpand={() => toggleExpand(q.id)}
              onToggleErrorBook={() => toggleErrorBook(q.id)}
            />
          ))}
        </div>
      </div>

      {/* Fixed bottom button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 glass border-t border-gray-100/30">
        <button
          onClick={() => setChatOpen(true)}
          className="w-full py-3 bg-brand text-white rounded-xl font-semibold text-sm btn-glow-brand active:scale-[0.98] transition-transform"
        >
          📝 问小花老师这道题
        </button>
      </div>

      {/* Chat panel overlay */}
      {chatOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 transition-opacity"
            onClick={() => setChatOpen(false)}
          />

          {/* Panel */}
          <div
            className="relative bg-white rounded-t-2xl flex flex-col animate-slide-up"
            style={{ height: '60%' }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <TeacherAvatar mode="avatar" className="w-8 h-8" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">小花老师</p>
                  <p className="text-xs text-gray-400">在线答疑中</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-4">
              {chatMessages.map(msg => (
                <DialogBubble key={msg.id} content={msg.content} role={msg.role} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <ChatInputBar
              value={chatInput}
              onChange={setChatInput}
              onSend={handleSendChat}
              onVoiceResult={(text) => {
                setChatInput(text)
              }}
              placeholder="输入你的问题..."
            />
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Question Card ─── */
function QuestionCard({
  question: q,
  index,
  expanded,
  inErrorBook,
  onToggleExpand,
  onToggleErrorBook,
}: {
  question: D2Question
  index: number
  expanded: boolean
  inErrorBook: boolean
  onToggleExpand: () => void
  onToggleErrorBook: () => void
}) {
  const bgClass = q.isCorrect ? 'bg-success/5 border-success/20' : 'bg-error/5 border-error/20'

  return (
    <div
      className={`rounded-2xl border p-4 ${bgClass} animate-slide-up`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header */}
      <div className="flex items-start gap-2">
        <span className="text-lg">{q.isCorrect ? '✅' : '❌'}</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">
            {q.id}. {q.content} {q.correctAnswer}
          </p>
          <p className="text-xs mt-1">
            <span className="text-gray-500">你的答案：{q.userAnswer}</span>
            {q.isCorrect ? (
              <span className="text-brand ml-2 font-medium">✓ 正确</span>
            ) : (
              <span className="text-error ml-2 font-medium">✗ 错误</span>
            )}
          </p>
        </div>
      </div>

      {/* Wrong question extras */}
      {!q.isCorrect && q.explanation && (
        <div className="mt-3">
          {/* Expand toggle */}
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            📖 {expanded ? '收起详细解析' : '展开详细解析'}
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Expandable analysis */}
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: expanded ? '400px' : '0', opacity: expanded ? 1 : 0 }}
          >
            <div className="mt-3 bg-white rounded-xl p-3 space-y-2">
              <p className="text-xs font-semibold text-gray-600">解题步骤：</p>
              {q.explanation.steps.map((step, i) => (
                <p key={i} className="text-xs text-gray-600 pl-2">
                  {'①②③④⑤'[i]} {step}
                </p>
              ))}

              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  知识点：<span className="font-medium text-gray-700">{q.explanation.knowledgePoint}</span>
                </p>
                <button
                  onClick={() => toast('即将跳转到知识点精讲')}
                  className="text-xs text-brand font-medium mt-1"
                >
                  查看知识点精讲 →
                </button>
              </div>
            </div>
          </div>

          {/* Error book toggle */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">
              {inErrorBook ? '☑ 已加入错题本' : '☐ 加入错题本'}
            </span>
            <button
              onClick={onToggleErrorBook}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${inErrorBook ? 'bg-brand' : 'bg-gray-300'}`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${inErrorBook ? 'translate-x-5' : 'translate-x-0.5'}`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Main Page ─── */
export default function D2PhotoJudge() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('camera')

  // Auto-advance from loading to result
  useEffect(() => {
    if (step !== 'loading') return
    const timer = setTimeout(() => setStep('result'), 2000)
    return () => clearTimeout(timer)
  }, [step])

  switch (step) {
    case 'camera':
      return <CameraStep onCapture={() => setStep('crop')} onBack={() => navigate(-1)} onHistory={() => navigate('/photo-judge/history')} />
    case 'crop':
      return (
        <CropStep
          onRetake={() => setStep('camera')}
          onJudge={() => setStep('loading')}
          onBack={() => setStep('camera')}
        />
      )
    case 'loading':
      return <LoadingStep />
    case 'result':
      return <ResultStep onBack={() => setStep('camera')} />
  }
}

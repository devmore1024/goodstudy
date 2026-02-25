import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomTabBar from '../components/BottomTabBar'
import ChatInputBar from '../components/ChatInputBar'
import { mockChildrenData, aiWeeklyReport } from '../mock/homeData'
import type { ChildData, SubjectScore } from '../mock/homeData'

const TEACHER_IMG = '/images/teacher.png'

const parentTabs = [
  { key: 'home', label: '首页', icon: 'home', route: '/home/parent' },
  { key: 'plan', label: '学习计划', icon: 'plan', route: '/plan' },
  { key: 'report', label: '学习报告', icon: 'report', route: '/report', badge: true },
  { key: 'profile', label: '我的', icon: 'profile', route: '/me' },
]

const subjectColors: Record<string, string> = {
  '语文': '#FF7A45',
  '数学': '#4A90D9',
  '英语': '#2BBB6E',
}

function formatDate(): string {
  const d = new Date()
  const days = ['日', '一', '二', '三', '四', '五', '六']
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 周${days[d.getDay()]}`
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return '早上好'
  if (h < 18) return '下午好'
  return '晚上好'
}

// ─── Mini Trend Chart ───────────────────────────────────────

function MiniTrendChart({ data, subjects }: { data: ChildData['weeklyScores']; subjects: SubjectScore[] }) {
  const allSubjects = subjects.map(s => s.name)
  const maxY = 100
  const minY = 50
  const chartH = 120
  const chartW = 280
  const stepX = chartW / (data.length - 1)

  const toY = (score: number) => chartH - ((score - minY) / (maxY - minY)) * chartH

  return (
    <div className="overflow-hidden">
      <svg viewBox={`-30 -10 ${chartW + 40} ${chartH + 40}`} className="w-full h-36">
        {/* Y axis labels */}
        {[50, 60, 70, 80, 90, 100].map(v => (
          <g key={v}>
            <line x1="0" y1={toY(v)} x2={chartW} y2={toY(v)} stroke="#F3F4F6" strokeWidth="1" />
            <text x="-8" y={toY(v) + 3} textAnchor="end" className="text-[8px] fill-gray-400">{v}</text>
          </g>
        ))}
        {/* Lines per subject */}
        {allSubjects.map(subject => {
          const color = subjectColors[subject] || '#9CA3AF'
          const points = data.map((d, i) => `${i * stepX},${toY(d.scores[subject] || 0)}`).join(' ')
          return (
            <g key={subject}>
              <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
              {data.map((d, i) => (
                <circle
                  key={i}
                  cx={i * stepX}
                  cy={toY(d.scores[subject] || 0)}
                  r="3"
                  fill="white"
                  stroke={color}
                  strokeWidth="2"
                />
              ))}
            </g>
          )
        })}
        {/* X axis labels */}
        {data.map((d, i) => (
          <text key={i} x={i * stepX} y={chartH + 16} textAnchor="middle" className="text-[9px] fill-gray-400">
            {d.day}
          </text>
        ))}
      </svg>
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 -mt-2">
        {allSubjects.map(s => (
          <div key={s} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: subjectColors[s] }} />
            <span className="text-[11px] text-gray-500">{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Subject Card ───────────────────────────────────────────

function SubjectCard({ subject }: { subject: SubjectScore }) {
  const trendUp = subject.trend > 0
  const trendColor = trendUp ? 'text-brand' : 'text-error'
  const trendIcon = trendUp ? '↑' : '↓'

  return (
    <div className="bg-white rounded-2xl p-3.5 shadow-sm active:scale-[0.98] transition-all">
      <p className="text-xs text-gray-400 mb-1">{subject.name}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-bold text-gray-800">{subject.score}</span>
        <span className="text-xs text-gray-400">分</span>
        <span className={`text-xs font-semibold ${trendColor}`}>
          {trendIcon}{Math.abs(subject.trend)}
        </span>
      </div>
      {subject.weakPoint ? (
        <p className="text-[10px] text-warning mt-1.5">{subject.weakPoint}需加强</p>
      ) : (
        <p className="text-[10px] text-brand mt-1.5">表现优秀</p>
      )}
    </div>
  )
}

// ─── Chat Message ───────────────────────────────────────────

interface ChatMessage {
  id: number
  role: 'ai' | 'user'
  text: string
  actionBtn?: { label: string; route: string }
}

function ChatBubble({ msg }: { msg: ChatMessage }) {
  const navigate = useNavigate()
  const isAi = msg.role === 'ai'

  return (
    <div className={`flex gap-2.5 ${isAi ? '' : 'flex-row-reverse'} animate-slide-up`}>
      {isAi && (
        <img src={TEACHER_IMG} alt="小花老师" className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0 mt-0.5" />
      )}
      <div className={`max-w-[80%] ${isAi ? '' : 'text-right'}`}>
        <div className={`inline-block px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isAi
            ? 'bg-white text-gray-700 rounded-tl-md shadow-sm'
            : 'bg-brand text-white rounded-tr-md'
        }`}>
          {msg.text}
        </div>
        {msg.actionBtn && (
          <button
            onClick={() => navigate(msg.actionBtn!.route)}
            className="mt-1.5 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand/10 text-xs text-brand font-medium active:scale-95 transition-all"
          >
            {msg.actionBtn.label}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

// ─── AI Chat Panel ──────────────────────────────────────────

function AIChatPanel({
  childName,
  onClose,
  onExitParentMode,
}: {
  childName: string
  onClose: () => void
  onExitParentMode: () => void
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const msgIdRef = useRef(0)

  // Initial AI greeting
  useEffect(() => {
    const id = ++msgIdRef.current
    setMessages([{
      id,
      role: 'ai',
      text: `${childName}妈妈您好！我是小花老师，有什么关于${childName}学习情况想了解的吗？`,
    }])
  }, [childName])

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const mockAIReply = (userText: string): ChatMessage => {
    const id = ++msgIdRef.current
    if (userText.includes('数学')) {
      return {
        id,
        role: 'ai',
        text: `${childName}这周数学有明显进步，分数运算正确率提升了15%，但应用题还需要加强。建议增加一些应用题专项练习。`,
        actionBtn: { label: '调整学习计划', route: '/plan/create' },
      }
    }
    if (userText.includes('英语')) {
      return {
        id,
        role: 'ai',
        text: `${childName}英语整体表现不错，听力和口语进步明显。单词拼写方面还可以再加强一下，建议每天花10分钟做词汇练习。`,
      }
    }
    if (userText.includes('计划') || userText.includes('调整')) {
      return {
        id,
        role: 'ai',
        text: `好的，根据${childName}目前的学习情况，我建议每周增加2小时的薄弱科目练习。要现在去调整学习计划吗？`,
        actionBtn: { label: '去调整计划', route: '/plan/create' },
      }
    }
    return {
      id,
      role: 'ai',
      text: `${childName}今天完成了3项学习任务，学习了45分钟，整体表现不错。语文古诗词背诵正确率95%，数学分数加减法正确率88%。还有什么想了解的吗？`,
    }
  }

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg: ChatMessage = { id: ++msgIdRef.current, role: 'user', text: input.trim() }
    const userText = input.trim()
    setInput('')
    setMessages(prev => [...prev, userMsg])

    // Simulate AI reply
    setTimeout(() => {
      setMessages(prev => [...prev, mockAIReply(userText)])
    }, 600)
  }

  const handleVoice = (text: string) => {
    const userMsg: ChatMessage = { id: ++msgIdRef.current, role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setTimeout(() => {
      setMessages(prev => [...prev, mockAIReply(text)])
    }, 600)
  }

  return (
    <>
      {/* Backdrop */}
      <div className="absolute inset-0 z-40 bg-black/40 animate-fade-in" onClick={onClose} />

      {/* Panel */}
      <div className="absolute inset-x-0 bottom-0 z-50 flex flex-col bg-white rounded-t-3xl shadow-2xl animate-slide-up" style={{ height: '60%' }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <img src={TEACHER_IMG} alt="小花老师" className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm" />
            <div>
              <p className="text-sm font-semibold text-gray-800">小花老师</p>
              <p className="text-[10px] text-gray-400">正在查看：{childName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:scale-90 transition-transform">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Chat area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-4 bg-gray-50/50">
          {messages.map(msg => (
            <ChatBubble key={msg.id} msg={msg} />
          ))}
        </div>

        {/* Input bar */}
        <ChatInputBar
          value={input}
          onChange={setInput}
          onSend={handleSend}
          onVoiceResult={handleVoice}
          placeholder={`问问${childName}的学习情况...`}
        />

        {/* Exit parent mode */}
        <div className="px-4 pb-[env(safe-area-inset-bottom)] pb-3 pt-1">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="w-full text-center text-xs text-gray-400 py-1.5 active:text-gray-600 transition-colors"
          >
            退出家长模式
          </button>
        </div>
      </div>

      {/* Exit confirm dialog */}
      {showExitConfirm && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-6 mx-6 w-full max-w-sm animate-scale-in">
            <h3 className="text-lg font-bold text-gray-800 text-center mb-2">退出家长模式</h3>
            <p className="text-sm text-gray-500 text-center mb-6">退出后将返回欢迎页面，确定退出吗？</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-600 font-medium active:scale-[0.97] transition-all"
              >
                取消
              </button>
              <button
                onClick={onExitParentMode}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange to-orange-dark text-white text-sm font-semibold active:scale-[0.97] transition-all"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Main Page ──────────────────────────────────────────────

export default function B2ParentHome() {
  const navigate = useNavigate()
  const [selectedChildId, setSelectedChildId] = useState(mockChildrenData[0].id)
  const [showChatPanel, setShowChatPanel] = useState(false)
  const [showBubble, setShowBubble] = useState(false)
  const child = mockChildrenData.find(c => c.id === selectedChildId) || mockChildrenData[0]

  const completionRate = Math.round((child.completedTasks / child.totalTasks) * 100)
  const timeRate = Math.round((child.todayMinutes / child.todayTarget) * 100)
  const greeting = getGreeting()

  // Teacher auto-broadcast bubble on load
  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  // Switch child → reset bubble
  useEffect(() => {
    setShowBubble(false)
    const timer = setTimeout(() => setShowBubble(true), 800)
    return () => clearTimeout(timer)
  }, [selectedChildId])

  const broadcastText = child.completedTasks === child.totalTasks
    ? `${child.name}今天完成了全部任务，表现很棒！`
    : `${child.name}今天完成了${child.completedTasks}项学习任务，学习了${child.todayMinutes}分钟。`

  return (
    <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
      {/* Decorative circles */}
      <div className="deco-circle w-52 h-52 bg-orange/4 -top-20 -right-16" />
      <div className="deco-circle w-36 h-36 bg-brand/4 bottom-40 -left-12" />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10">
        {/* Top header */}
        <div className="px-5 pt-3 pb-2 flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">{greeting}，{child.name}妈妈</h1>
            <p className="text-sm text-gray-400 mt-0.5">{formatDate()}</p>
          </div>
          {/* Floating teacher avatar */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => { setShowChatPanel(true); setShowBubble(false) }}
              className="relative active:scale-90 transition-transform"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand/20 to-orange/15 blur-md scale-125 animate-breathe" />
              <img
                src={TEACHER_IMG}
                alt="小花老师"
                className="relative w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-lg"
              />
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-error flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">1</span>
              </div>
            </button>
            {/* Speech bubble */}
            {showBubble && !showChatPanel && (
              <div className="absolute top-14 right-0 w-52 animate-slide-up">
                <div className="bg-white rounded-2xl rounded-tr-md p-3 shadow-lg border border-gray-100">
                  <p className="text-xs text-gray-600 leading-relaxed">{broadcastText}</p>
                  <button
                    onClick={() => { setShowChatPanel(true); setShowBubble(false) }}
                    className="mt-1.5 text-[10px] text-brand font-medium"
                  >
                    点击对话了解更多 →
                  </button>
                </div>
                {/* Triangle */}
                <div className="absolute -top-1.5 right-4 w-3 h-3 bg-white border-l border-t border-gray-100 transform rotate-45" />
              </div>
            )}
          </div>
        </div>

        {/* Child switcher */}
        <div className="px-5 mt-2">
          <p className="text-xs text-gray-400 mb-2">孩子切换</p>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {mockChildrenData.map(c => {
              const active = c.id === selectedChildId
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedChildId(c.id)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1.5 w-24 py-3 rounded-2xl transition-all active:scale-95 ${
                    active
                      ? 'bg-brand/10 border-2 border-brand shadow-sm'
                      : 'bg-white border-2 border-transparent shadow-sm'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold ${
                    active ? 'bg-brand text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {c.name.charAt(0)}
                  </div>
                  <span className={`text-sm font-medium ${active ? 'text-brand' : 'text-gray-600'}`}>{c.name}</span>
                  <span className="text-[10px] text-gray-400">{c.grade}</span>
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-brand" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Today's overview card */}
        <div className="px-5 mt-4">
          <div className="bg-white rounded-2xl p-4 card-glow">
            <h2 className="text-base font-bold text-gray-800 mb-3">今日学习概况</h2>
            <div className="flex gap-4">
              {/* Study time */}
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">学习时长</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-800">{child.todayMinutes}</span>
                  <span className="text-xs text-gray-400">分钟</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue to-brand rounded-full transition-all"
                    style={{ width: `${Math.min(timeRate, 100)}%` }}
                  />
                </div>
              </div>
              {/* Divider */}
              <div className="w-px bg-gray-100 self-stretch" />
              {/* Completion rate */}
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">完成率</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-800">{completionRate}</span>
                  <span className="text-xs text-gray-400">%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand to-blue rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                今日已完成 <span className="font-semibold text-brand">{child.completedTasks}/{child.totalTasks}</span> 项任务
              </span>
              <button className="text-xs text-brand font-medium flex items-center gap-0.5">
                查看详情
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Score trend chart */}
        <div className="px-5 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800">成绩趋势</h2>
            <button className="text-xs text-brand font-medium flex items-center gap-0.5">
              本周
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
          <div className="bg-white rounded-2xl p-4 card-glow">
            <MiniTrendChart data={child.weeklyScores} subjects={child.subjects} />
          </div>
        </div>

        {/* Subject performance cards */}
        <div className="px-5 mt-5">
          <h2 className="text-base font-bold text-gray-800 mb-3">学科表现</h2>
          <div className="grid grid-cols-2 gap-3">
            {child.subjects.map(subject => (
              <SubjectCard key={subject.name} subject={subject} />
            ))}
            {/* View all card */}
            <button
              onClick={() => navigate('/report')}
              className="bg-white/80 rounded-2xl p-3.5 shadow-sm flex flex-col items-center justify-center gap-1 active:scale-[0.98] transition-all border border-dashed border-gray-200"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
              <span className="text-xs text-gray-400 font-medium">查看全部</span>
            </button>
          </div>
        </div>

        {/* AI weekly report card */}
        <div className="px-5 mt-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800">AI 老师周报提醒</h2>
            <button className="text-xs text-brand font-medium">详情</button>
          </div>
          <div className="bg-gradient-to-br from-blue-light to-brand-light rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                <span className="text-base">💡</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                  {aiWeeklyReport}
                </p>
                <button className="mt-2 text-xs text-brand font-medium flex items-center gap-0.5">
                  查看完整报告
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom safe area spacer */}
        <div className="h-4" />
      </div>

      {/* Bottom tab bar */}
      <BottomTabBar tabs={parentTabs} />

      {/* AI Chat Panel overlay */}
      {showChatPanel && (
        <AIChatPanel
          childName={child.name}
          onClose={() => setShowChatPanel(false)}
          onExitParentMode={() => navigate('/welcome')}
        />
      )}
    </div>
  )
}

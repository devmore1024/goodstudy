import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import TeacherAvatar from '../components/TeacherAvatar'
import ChatInputBar from '../components/ChatInputBar'
import BottomTabBar from '../components/BottomTabBar'
import { mockTasks, quickEntries } from '../mock/homeData'
import type { LearningTask } from '../mock/homeData'

const TEACHER_IMG = '/images/teacher.png'

const studentTabs = [
  { key: 'home', label: '首页', icon: 'home', route: '/home/student' },
  { key: 'daily', label: '每日学习', icon: 'study', route: '/daily' },
  { key: 'report', label: '学习报告', icon: 'report', route: '/report', badge: true },
  { key: 'profile', label: '我的', icon: 'profile', route: '/me' },
]

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return '早上好'
  if (h < 18) return '下午好'
  return '晚上好'
}

function getDayOfWeek(): string {
  const days = ['日', '一', '二', '三', '四', '五', '六']
  return `周${days[new Date().getDay()]}`
}

const quickIcons: Record<string, JSX.Element> = {
  camera: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  chat: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  book: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  test: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  trophy: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/>
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  ),
}

const subjectColors: Record<string, string> = {
  '语文': '#FF7A45',
  '数学': '#4A90D9',
  '英语': '#2BBB6E',
  '物理': '#9B59B6',
  '化学': '#E74C3C',
}

function TaskItem({ task, onTap }: { task: LearningTask; onTap: () => void }) {
  return (
    <button onClick={onTap} className="w-full flex items-center gap-3 py-3 px-1 text-left transition-colors active:bg-gray-50 rounded-xl">
      {task.completed ? (
        <div className="w-6 h-6 rounded-full bg-brand/15 flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2BBB6E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full border-2 border-gray-200 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] px-1.5 py-0.5 rounded font-medium text-white"
            style={{ backgroundColor: subjectColors[task.subject] || '#9CA3AF' }}
          >
            {task.subject}
          </span>
          <span className={`text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
            {task.title}
          </span>
        </div>
      </div>
      <span className={`text-xs flex-shrink-0 ${task.completed ? 'text-brand' : 'text-gray-400'}`}>
        {task.completed ? '已完成' : '待学习'}
      </span>
    </button>
  )
}

export default function B1StudentHome() {
  const navigate = useNavigate()
  const [voiceInput, setVoiceInput] = useState('')
  const [tasks] = useState(mockTasks)

  const completedCount = useMemo(() => tasks.filter(t => t.completed).length, [tasks])

  const greeting = getGreeting()
  const dayOfWeek = getDayOfWeek()
  const studentName = '小明'

  return (
    <div className="h-full flex flex-col page-bg-chat relative overflow-hidden">
      {/* Decorative circles */}
      <div className="deco-circle w-56 h-56 bg-brand/4 -top-20 -right-20" />
      <div className="deco-circle w-40 h-40 bg-orange/4 bottom-32 -left-16" />
      <div className="deco-circle w-24 h-24 bg-blue/5 top-40 -left-8" />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10">
        {/* Top greeting bar */}
        <div className="px-5 pt-3 pb-2 flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              {greeting}，{studentName}同学！
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              今天是{dayOfWeek}，加油哦~
            </p>
          </div>
          {/* Notification bell */}
          <button className="relative w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-sm mt-0.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <div className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-error" />
          </button>
        </div>

        {/* Teacher avatar + voice area */}
        <div className="flex flex-col items-center py-4">
          <TeacherAvatar mode="full" />
          <p className="text-xs text-gray-400 mt-3">"小花老师，你好"</p>
        </div>

        {/* Today's tasks */}
        <div className="px-5 mt-2">
          <div className="bg-white rounded-2xl p-4 card-glow">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-800">今日学习任务</h2>
              <span className="text-sm font-semibold text-brand">{completedCount}/{tasks.length}完成</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand to-blue rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / tasks.length) * 100}%` }}
              />
            </div>
            <div className="divide-y divide-gray-50">
              {tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onTap={() => {
                    if (!task.completed) {
                      // Navigate to learning page (placeholder)
                      navigate('/daily')
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick entries */}
        <div className="px-5 mt-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800">快捷入口</h2>
            <span className="text-xs text-gray-400">长按可编辑排序</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {quickEntries.map(entry => (
              <button
                key={entry.id}
                onClick={() => navigate(entry.route)}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-white shadow-sm active:scale-95 transition-all"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${entry.color}15`, color: entry.color }}
                >
                  {quickIcons[entry.icon]}
                </div>
                <span className="text-xs text-gray-600 font-medium">{entry.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom safe area spacer */}
        <div className="h-4" />
      </div>

      {/* Voice input bar */}
      <ChatInputBar
        value={voiceInput}
        onChange={setVoiceInput}
        onSend={() => { setVoiceInput('') }}
        placeholder="问小花老师..."
      />

      {/* Bottom tab bar */}
      <BottomTabBar tabs={studentTabs} />
    </div>
  )
}

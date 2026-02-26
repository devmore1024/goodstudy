import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TeacherAvatar from '../components/TeacherAvatar'
import ChatInputBar from '../components/ChatInputBar'
import { quickEntries, mockTasks, subjectColors } from '../mock/homeData'

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

const bubbleEmojis: Record<string, string> = {
  book: '📖',
  chat: '💬',
  camera: '📷',
  test: '📝',
  plan: '📋',
  report: '📊',
}

export default function B1StudentHome() {
  const navigate = useNavigate()
  const [voiceInput, setVoiceInput] = useState('')

  const greeting = getGreeting()
  const dayOfWeek = getDayOfWeek()
  const studentName = '小明'
  const completedCount = mockTasks.filter(t => t.completed).length

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
          {/* Settings icon */}
          <button
            onClick={() => navigate('/me')}
            className="relative w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-sm mt-0.5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>

        {/* Teacher avatar area */}
        <div className="flex flex-col items-center pt-8 pb-4">
          <TeacherAvatar mode="full" />
          <p className="text-xs text-gray-400 mt-3">"小花老师，你好"</p>
        </div>

        {/* 今日学习计划 */}
        <div className="mx-4 mb-3 bg-white rounded-2xl card-glow overflow-hidden">
          <div className="px-4 pt-3 pb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">
              📖 今日学习计划 ({completedCount}/{mockTasks.length})
            </h3>
          </div>
          <div className="px-4 pb-3 space-y-0">
            {mockTasks.map(task => (
              <button
                key={task.id}
                onClick={() => navigate(task.route)}
                className="w-full text-left py-2.5 border-b border-gray-50 last:border-0 active:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-2">
                  {/* Checkbox */}
                  <span className="mt-0.5 text-base leading-none">
                    {task.completed ? (
                      <span className="text-brand">☑</span>
                    ) : (
                      <span className="text-gray-300">☐</span>
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Subject tag */}
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-medium text-white flex-shrink-0"
                        style={{ backgroundColor: subjectColors[task.subject] || '#9CA3AF' }}
                      >
                        {task.subject}
                      </span>
                      <span className={`text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                        {task.title}
                      </span>
                      <span className="text-xs text-gray-400">· {task.taskType}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {task.completed
                        ? `已完成${task.mastery ? ` · 掌握度 ${task.mastery}%` : ''}${task.accuracy ? ` · 正确率 ${task.accuracy}%` : ''}`
                        : '未开始'
                      }
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Function bubbles — horizontally scrollable */}
      <div className="px-2 pb-2 relative z-10">
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide py-1 px-2">
          {quickEntries.map(entry => (
            <button
              key={entry.id}
              onClick={() => navigate(entry.route)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium shadow-sm active:scale-95 transition-all border border-gray-100/60"
              style={{ backgroundColor: `${entry.color}12`, color: entry.color }}
            >
              <span>{bubbleEmojis[entry.icon] || '📌'}</span>
              <span>{entry.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Voice / text input bar */}
      <ChatInputBar
        value={voiceInput}
        onChange={setVoiceInput}
        onSend={() => { setVoiceInput('') }}
        placeholder="问小花老师..."
      />
    </div>
  )
}

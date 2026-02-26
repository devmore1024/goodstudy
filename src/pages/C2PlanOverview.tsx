import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import { weekPlanBlocks } from '../mock/planData'

const TEACHER_IMG = '/images/teacher.png'

const subjectColors: Record<string, string> = {
  '数学': '#4A90D9', '语文': '#FF7A45', '英语': '#2BBB6E', '物理': '#9B59B6',
}

const days = ['一', '二', '三', '四', '五', '六', '日']
const hours = Array.from({ length: 13 }, (_, i) => i + 8) // 8-20

export default function C2PlanOverview() {
  const navigate = useNavigate()
  const [weekOffset] = useState(0)
  const blocks = weekPlanBlocks

  const completedCount = blocks.filter(b => b.completed).length
  const totalCount = blocks.length
  const completionPct = Math.round((completedCount / totalCount) * 100)
  const today = new Date().getDay() // 0=Sun
  const todayCol = today === 0 ? 6 : today - 1 // 0=Mon

  // Time summary by subject
  const subjectTime: Record<string, number> = {}
  blocks.forEach(b => {
    subjectTime[b.subject] = (subjectTime[b.subject] || 0) + b.duration
  })

  return (
    <div className="h-full flex flex-col page-bg-chat relative overflow-hidden">
      <div className="deco-circle w-48 h-48 bg-blue/4 -top-16 -right-16" />

      <NavigationBar
        title="学习计划"
        onBack={() => navigate(-1)}
        rightElement={
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
            <div className="relative">
              <img src={TEACHER_IMG} alt="小花老师" className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm" />
            </div>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10 px-4 pb-4">
        {/* Week switcher */}
        <div className="flex items-center justify-center gap-4 py-3">
          <button className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-800">2026年2月第4周</p>
            <p className="text-xs text-gray-400">2.23 - 3.1</p>
          </div>
          <button className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* Weekly summary card */}
        <div className="bg-white rounded-2xl p-4 card-glow mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-800">本周概览</h3>
            <span className="text-xs text-gray-400">已完成 {completedCount}/{totalCount} 任务</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand to-blue rounded-full transition-all" style={{ width: `${completionPct}%` }} />
            </div>
            <span className="text-xs font-semibold text-brand">{completionPct}%</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(subjectTime).map(([s, h]) => (
              <span key={s} className="text-xs px-2 py-1 rounded-lg text-white font-medium" style={{ backgroundColor: subjectColors[s] || '#9CA3AF' }}>
                {s} {h}h
              </span>
            ))}
          </div>
        </div>

        {/* Week timetable grid */}
        <div className="bg-white rounded-2xl p-3 shadow-sm overflow-x-auto">
          <div className="min-w-[340px]">
            {/* Header */}
            <div className="grid grid-cols-8 gap-px mb-1">
              <div />
              {days.map((d, i) => (
                <div key={d} className={`text-center text-[10px] py-1 rounded ${i === todayCol ? 'bg-brand/10 text-brand font-bold' : 'text-gray-500'}`}>
                  {d}
                </div>
              ))}
            </div>

            {/* Time rows */}
            <div className="relative">
              {hours.map(hour => (
                <div key={hour} className="grid grid-cols-8 gap-px" style={{ height: 28 }}>
                  <div className="text-[9px] text-gray-400 text-right pr-1 leading-7">{hour}</div>
                  {days.map((_, dayIdx) => {
                    const block = blocks.find(b => b.day === dayIdx && b.startHour === hour)
                    if (block) {
                      const h = Math.round(block.duration * 28)
                      const color = subjectColors[block.subject] || '#9CA3AF'
                      return (
                        <button
                          key={dayIdx}
                          onClick={() => navigate('/plan/daily')}
                          className="relative rounded-md text-[8px] text-white font-medium overflow-hidden active:opacity-80"
                          style={{ backgroundColor: color, height: h, zIndex: 2 }}
                        >
                          <span className="p-0.5 block truncate">{block.subject}</span>
                          {block.completed && (
                            <span className="absolute top-0.5 right-0.5 text-[8px]">✓</span>
                          )}
                          {block.isTest && (
                            <span className="absolute bottom-0 left-0 right-0 bg-black/20 text-[7px] text-center">测</span>
                          )}
                        </button>
                      )
                    }
                    return <div key={dayIdx} className={`${dayIdx === todayCol ? 'bg-brand/5' : ''}`} />
                  })}
                </div>
              ))}
              {/* Today highlight line */}
              <div
                className="absolute top-0 bottom-0 border-l-2 border-brand/30 pointer-events-none"
                style={{ left: `${(todayCol + 1) * (100 / 8)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-3 px-1">
          {Object.entries(subjectColors).map(([s, c]) => (
            <div key={s} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
              <span className="text-[10px] text-gray-500">{s}</span>
            </div>
          ))}
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-error/60" />
            <span className="text-[10px] text-gray-500">测评</span>
          </div>
        </div>

        {/* Add slot button */}
        <button className="w-full mt-3 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 font-medium active:bg-gray-50 transition-colors">
          + 添加学习时段
        </button>
      </div>

    </div>
  )
}

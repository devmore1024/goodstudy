import { useNavigate } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import { todayTasks } from '../mock/planData'
import type { DailyTask } from '../mock/planData'

const TEACHER_IMG = '/images/teacher.png'

const subjectColors: Record<string, string> = {
  '数学': '#4A90D9', '语文': '#FF7A45', '英语': '#2BBB6E', '物理': '#9B59B6',
}

function statusIcon(status: DailyTask['status']) {
  switch (status) {
    case 'completed':
      return (
        <div className="w-7 h-7 rounded-full bg-brand/15 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2BBB6E" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      )
    case 'current':
      return (
        <div className="w-7 h-7 rounded-full bg-blue/15 flex items-center justify-center animate-breathe">
          <div className="w-3 h-3 rounded-full bg-blue" />
        </div>
      )
    case 'skipped':
      return (
        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-xs text-gray-400">—</span>
        </div>
      )
    default:
      return <div className="w-7 h-7 rounded-full border-2 border-gray-200" />
  }
}

function statusLabel(status: DailyTask['status']) {
  switch (status) {
    case 'completed': return <span className="text-[10px] text-brand font-medium">完成</span>
    case 'current': return <span className="text-[10px] text-blue font-bold">当前</span>
    case 'skipped': return <span className="text-[10px] text-gray-400">跳过</span>
    default: return <span className="text-[10px] text-gray-400">待学</span>
  }
}

export default function C2aDailyPlan() {
  const navigate = useNavigate()
  const tasks = todayTasks
  const completedCount = tasks.filter(t => t.status === 'completed').length
  const totalMinutes = tasks.reduce((sum, t) => {
    const [sh, sm] = t.startTime.split(':').map(Number)
    const [eh, em] = t.endTime.split(':').map(Number)
    return sum + (eh * 60 + em) - (sh * 60 + sm)
  }, 0)
  const doneMinutes = tasks.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.actualMinutes || 0), 0)

  const today = new Date()
  const dayNames = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="h-full flex flex-col page-bg-chat relative overflow-hidden">
      <div className="deco-circle w-40 h-40 bg-brand/4 -top-12 -right-12" />

      <NavigationBar
        title={`今日计划  ${today.getMonth() + 1}月${today.getDate()}日 周${dayNames[today.getDay()]}`}
        onBack={() => navigate(-1)}
        rightElement={
          <div className="relative">
            <img src={TEACHER_IMG} alt="小花老师" className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm" />
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10">
        {/* Today progress card */}
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 card-glow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-800">今日进度</span>
            <span className="text-sm text-brand font-semibold">{completedCount}/{tasks.length} 已完成</span>
          </div>
          <div className="flex gap-1.5 mb-2">
            {tasks.map((t, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  t.status === 'completed' ? 'bg-brand' : 'border-2 border-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400">
            已学习 {Math.floor(doneMinutes / 60)}h{doneMinutes % 60}min / 计划 {Math.floor(totalMinutes / 60)}h
          </p>
        </div>

        {/* Timeline */}
        <div className="px-4 mt-4 pb-6">
          <div className="relative pl-10">
            {/* Vertical timeline line */}
            <div className="absolute left-[14px] top-0 bottom-0 w-0.5 bg-gray-100" />

            {tasks.map((task, idx) => {
              const isCurrent = task.status === 'current'
              const isCompleted = task.status === 'completed'
              const color = subjectColors[task.subject] || '#9CA3AF'

              return (
                <div key={task.id} className="relative mb-4 last:mb-0">
                  {/* Time label */}
                  <div className="absolute -left-10 top-0 w-10 flex flex-col items-end pr-3">
                    <span className="text-[10px] text-gray-400 leading-none">{task.startTime}</span>
                  </div>

                  {/* Status dot on timeline */}
                  <div className="absolute -left-[22px] top-0 z-10 bg-white">
                    {statusIcon(task.status)}
                  </div>
                  <div className="absolute -left-10 top-8 w-10 flex flex-col items-end pr-3">
                    {statusLabel(task.status)}
                  </div>

                  {/* Task card */}
                  <div className={`ml-4 rounded-2xl p-4 transition-all ${
                    isCurrent
                      ? 'bg-white border-2 border-blue shadow-md ring-2 ring-blue/10'
                      : isCompleted
                        ? 'bg-white/70 shadow-sm opacity-75'
                        : 'bg-white shadow-sm'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded text-white font-medium" style={{ backgroundColor: color }}>
                          {task.subject}
                        </span>
                        <span className={`text-sm font-medium ${isCompleted ? 'text-gray-400' : 'text-gray-800'}`}>
                          {task.topic}
                        </span>
                      </div>
                      {isCurrent && <span className="text-[10px] bg-blue/10 text-blue px-2 py-0.5 rounded-full font-medium">▶ NOW</span>}
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{task.startTime} - {task.endTime}</p>

                    {/* Contents */}
                    {task.contents && (
                      <div className="space-y-1 mb-2">
                        {task.contents.map((c, i) => (
                          <p key={i} className="text-xs text-gray-500 flex items-start gap-1">
                            <span className="text-gray-300 mt-0.5">·</span> {c}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* AI tip */}
                    {task.aiTip && (
                      <div className="bg-brand-light/50 rounded-xl p-2.5 mb-2">
                        <p className="text-xs text-gray-600">
                          <span className="text-brand font-medium">AI老师说：</span>{task.aiTip}
                        </p>
                      </div>
                    )}

                    {/* Completed info */}
                    {isCompleted && task.actualMinutes && (
                      <p className="text-xs text-brand">已完成 ✓ {task.actualMinutes}min</p>
                    )}

                    {/* Start button for current/pending */}
                    {(isCurrent || task.status === 'pending') && (
                      <button
                        onClick={() => navigate('/knowledge')}
                        className={`w-full mt-2 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.97] ${
                          isCurrent
                            ? 'bg-blue text-white shadow-md'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {isCurrent ? '开始学习 ▶' : '提前开始'}
                      </button>
                    )}
                  </div>

                  {/* End time for last item */}
                  {idx === tasks.length - 1 && (
                    <div className="absolute -left-10 bottom-0 w-10 flex flex-col items-end pr-3">
                      <span className="text-[10px] text-gray-400">{task.endTime}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

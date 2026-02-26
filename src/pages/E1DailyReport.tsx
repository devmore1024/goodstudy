import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMode } from '../contexts/ModeContext'
import NavigationBar from '../components/NavigationBar'
import { mockDailyReport } from '../mock/reportData'

const TEACHER_IMG = '/images/teacher.png'

const subjectColors: Record<string, string> = {
  '数学': '#4A90D9',
  '语文': '#FF7A45',
  '英语': '#2BBB6E',
  '物理': '#9B59B6',
  '化学': '#E74C3C',
}

function SubTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 text-sm font-medium transition-all relative ${
        active ? 'text-brand' : 'text-gray-400'
      }`}
    >
      {label}
      {active && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand rounded-full" />}
    </button>
  )
}

// Simple pie chart
function PieChart({ data }: { data: { name: string; percent: number; color: string }[] }) {
  const size = 120
  const cx = size / 2
  const cy = size / 2
  const r = 45
  let cumPercent = 0

  return (
    <div className="flex items-center gap-6">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-28 h-28 flex-shrink-0">
        {data.map((d, i) => {
          const startAngle = cumPercent * 3.6 * (Math.PI / 180)
          cumPercent += d.percent
          const endAngle = cumPercent * 3.6 * (Math.PI / 180)
          const largeArc = d.percent > 50 ? 1 : 0
          const x1 = cx + r * Math.sin(startAngle)
          const y1 = cy - r * Math.cos(startAngle)
          const x2 = cx + r * Math.sin(endAngle)
          const y2 = cy - r * Math.cos(endAngle)
          return (
            <path
              key={i}
              d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`}
              fill={d.color}
              opacity={0.85}
            />
          )
        })}
        <circle cx={cx} cy={cy} r="22" fill="white" />
      </svg>
      <div className="space-y-2">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-gray-600">{d.name}</span>
            <span className="text-xs text-gray-400">{d.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function E1DailyReport() {
  const navigate = useNavigate()
  const { homePath } = useMode()
  const report = mockDailyReport
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [commentExpanded, setCommentExpanded] = useState(false)

  const accuracyColor = report.accuracy >= 80 ? 'text-brand' : report.accuracy >= 60 ? 'text-warning' : 'text-error'

  return (
    <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
      <NavigationBar title="学习报告" onBack={() => navigate(homePath)} />

      {/* Sub tabs */}
      <div className="flex border-b border-gray-100 px-4 glass">
        <SubTab active label="每日" onClick={() => {}} />
        <SubTab active={false} label="周报" onClick={() => navigate('/report/weekly')} />
        <SubTab active={false} label="月报" onClick={() => navigate('/report/monthly')} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10 px-4 pb-4">
        {/* Date selector */}
        <div className="flex items-center justify-center gap-4 py-3">
          <button className="p-1 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-800">{report.date} {report.weekDay}</p>
            <span className="text-[10px] text-brand font-medium">（今天）</span>
          </div>
          <button className="p-1 text-gray-200" disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* Overview card */}
        <div className="bg-white rounded-2xl p-4 card-glow">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-2xl font-bold text-gray-800">{report.totalMinutes}<span className="text-xs text-gray-400 font-normal">min</span></p>
              <p className="text-[10px] text-gray-400 mt-0.5">学习时长</p>
            </div>
            <div className="w-px bg-gray-100" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{report.totalQuestions}<span className="text-xs text-gray-400 font-normal">题</span></p>
              <p className="text-[10px] text-gray-400 mt-0.5">答题数</p>
            </div>
            <div className="w-px bg-gray-100" />
            <div>
              <p className={`text-2xl font-bold ${accuracyColor}`}>{report.accuracy}<span className="text-xs font-normal">%</span></p>
              <p className="text-[10px] text-gray-400 mt-0.5">正确率</p>
            </div>
          </div>
        </div>

        {/* Subject distribution */}
        <div className="bg-white rounded-2xl p-4 card-glow mt-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3">学科分布</h3>
          <PieChart data={report.subjectDistribution} />
        </div>

        {/* Timeline */}
        <div className="mt-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3">今日学习时间线</h3>
          <div className="space-y-0">
            {report.timeline.map((item, idx) => {
              const isGood = item.accuracy >= 80
              const expanded = expandedId === item.id
              return (
                <div key={item.id} className="flex gap-3">
                  {/* Timeline left */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 w-10 text-right">{item.time}</span>
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 ${isGood ? 'bg-brand' : 'bg-gray-300'} ring-2 ${isGood ? 'ring-brand/20' : 'ring-gray-200'}`} />
                    {idx < report.timeline.length - 1 && <div className="w-px flex-1 bg-gray-200 my-0.5" />}
                  </div>
                  {/* Content */}
                  <button
                    onClick={() => setExpandedId(expanded ? null : item.id)}
                    className="flex-1 bg-white rounded-xl p-3 mb-2 card-glow text-left active:scale-[0.99] transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium text-white" style={{ backgroundColor: subjectColors[item.subject] || '#9CA3AF' }}>
                        {item.subject}
                      </span>
                      <span className="text-sm text-gray-700 font-medium">{item.activity}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      完成{item.questions}题 · 正确率{item.accuracy}%
                    </p>
                    {item.weakPoint && (
                      <p className="text-xs text-warning mt-1">⚠ 薄弱知识点：{item.weakPoint}</p>
                    )}
                    {expanded && (
                      <div className="mt-2 pt-2 border-t border-gray-50 animate-slide-up">
                        <p className="text-xs text-gray-500">正确 {Math.round(item.questions * item.accuracy / 100)} 题，错误 {item.questions - Math.round(item.questions * item.accuracy / 100)} 题</p>
                        {item.weakPoint && (
                          <button onClick={(e) => { e.stopPropagation(); navigate('/knowledge') }} className="mt-1 text-xs text-brand font-medium">去练习: {item.weakPoint} →</button>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* AI comment */}
        <div className="bg-gradient-to-br from-blue-light to-brand-light rounded-2xl p-4 mt-4">
          <div className="flex items-start gap-3">
            <img src={TEACHER_IMG} alt="小花老师" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium mb-1">小花老师今日点评</p>
              <p className={`text-sm text-gray-700 leading-relaxed ${commentExpanded ? '' : 'line-clamp-3'}`}>
                {report.aiComment}
              </p>
              <button onClick={() => setCommentExpanded(!commentExpanded)} className="mt-1 text-xs text-brand font-medium">
                {commentExpanded ? '收起 ▲' : '展开全部 ▼'}
              </button>
            </div>
          </div>
        </div>

        <div className="h-4" />
      </div>

    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomTabBar from '../components/BottomTabBar'
import { mockWeeklyReport } from '../mock/reportData'

const TEACHER_IMG = '/images/teacher.png'

const reportTabs = [
  { key: 'home', label: '首页', icon: 'home', route: '/home/student' },
  { key: 'daily', label: '每日学习', icon: 'study', route: '/daily' },
  { key: 'report', label: '学习报告', icon: 'report', route: '/report' },
  { key: 'profile', label: '我的', icon: 'profile', route: '/me' },
]

function SubTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex-1 py-2 text-sm font-medium transition-all relative ${active ? 'text-brand' : 'text-gray-400'}`}>
      {label}
      {active && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand rounded-full" />}
    </button>
  )
}

function BarChart({ data }: { data: { day: string; minutes: number }[] }) {
  const maxMin = Math.max(...data.map(d => d.minutes), 60)
  const chartH = 120
  const barW = 28
  const gap = 12

  return (
    <svg viewBox={`0 0 ${data.length * (barW + gap)} ${chartH + 30}`} className="w-full h-40">
      {/* Y axis guides */}
      {[0, 20, 40, 60].map(v => (
        <g key={v}>
          <line x1="0" y1={chartH - (v / maxMin) * chartH} x2={data.length * (barW + gap)} y2={chartH - (v / maxMin) * chartH} stroke="#F3F4F6" strokeWidth="1" />
        </g>
      ))}
      {data.map((d, i) => {
        const h = (d.minutes / maxMin) * chartH
        const x = i * (barW + gap) + gap / 2
        return (
          <g key={d.day}>
            <rect x={x} y={chartH - h} width={barW} height={h} rx="4" fill="#4A90D9" opacity={0.8} />
            <text x={x + barW / 2} y={chartH - h - 4} textAnchor="middle" className="text-[9px] fill-blue font-medium">{d.minutes}</text>
            <text x={x + barW / 2} y={chartH + 16} textAnchor="middle" className="text-[9px] fill-gray-400">{d.day}</text>
          </g>
        )
      })}
    </svg>
  )
}

function AccuracyTrendChart({ data }: { data: { day: string; thisWeek: number; lastWeek: number }[] }) {
  const chartH = 100
  const chartW = 280
  const stepX = chartW / (data.length - 1)
  const minY = 50
  const maxY = 100

  const toY = (v: number) => chartH - ((v - minY) / (maxY - minY)) * chartH

  const thisWeekPoints = data.map((d, i) => `${i * stepX},${toY(d.thisWeek)}`).join(' ')
  const lastWeekPoints = data.map((d, i) => `${i * stepX},${toY(d.lastWeek)}`).join(' ')

  // Area fill for this week
  const areaPath = `M0,${toY(data[0].thisWeek)} ${data.map((d, i) => `L${i * stepX},${toY(d.thisWeek)}`).join(' ')} L${(data.length - 1) * stepX},${chartH} L0,${chartH} Z`

  return (
    <svg viewBox={`-20 -10 ${chartW + 30} ${chartH + 30}`} className="w-full h-32">
      {[50, 60, 70, 80, 90, 100].map(v => (
        <line key={v} x1="0" y1={toY(v)} x2={chartW} y2={toY(v)} stroke="#F3F4F6" strokeWidth="1" />
      ))}
      <path d={areaPath} fill="rgba(74,144,217,0.08)" />
      <polyline fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeDasharray="4 3" points={lastWeekPoints} />
      <polyline fill="none" stroke="#4A90D9" strokeWidth="2" strokeLinecap="round" points={thisWeekPoints} />
      {data.map((d, i) => (
        <g key={d.day}>
          <circle cx={i * stepX} cy={toY(d.thisWeek)} r="3" fill="white" stroke="#4A90D9" strokeWidth="2" />
          <circle cx={i * stepX} cy={toY(d.lastWeek)} r="2.5" fill="white" stroke="#D1D5DB" strokeWidth="1.5" />
          <text x={i * stepX} y={chartH + 14} textAnchor="middle" className="text-[9px] fill-gray-400">{d.day}</text>
        </g>
      ))}
    </svg>
  )
}

export default function E2WeeklyReport() {
  const navigate = useNavigate()
  const report = mockWeeklyReport
  const [summaryExpanded, setSummaryExpanded] = useState(false)

  const accuracyDiff = report.avgAccuracy - report.lastWeekAccuracy
  const isUp = accuracyDiff > 0

  return (
    <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
      {/* Top nav */}
      <div className="flex items-center justify-between px-4 py-3 glass border-b border-gray-100/30 relative z-10">
        <span className="text-base font-semibold text-gray-800">学习报告</span>
        <button onClick={() => navigate('/me')} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </div>

      {/* Sub tabs */}
      <div className="flex border-b border-gray-100 px-4 glass">
        <SubTab active={false} label="每日" onClick={() => navigate('/report')} />
        <SubTab active label="周报" onClick={() => {}} />
        <SubTab active={false} label="月报" onClick={() => navigate('/report/monthly')} />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10 px-4 pb-4">
        {/* Week selector */}
        <div className="flex items-center justify-center gap-4 py-3">
          <button className="p-1 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <p className="text-sm font-semibold text-gray-800">{report.weekLabel} ({report.dateRange})</p>
          <button className="p-1 text-gray-200" disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* Overview card */}
        <div className="bg-white rounded-2xl p-4 card-glow">
          <h3 className="text-sm font-bold text-gray-800 mb-3">本周概览</h3>
          <div className="flex justify-around text-center">
            <div>
              <p className="text-lg font-bold text-gray-800">{report.totalHours}</p>
              <p className="text-[10px] text-gray-400">总时长</p>
            </div>
            <div className="w-px bg-gray-100" />
            <div>
              <p className="text-lg font-bold text-gray-800">{report.totalQuestions}题</p>
              <p className="text-[10px] text-gray-400">总题数</p>
            </div>
            <div className="w-px bg-gray-100" />
            <div>
              <p className={`text-lg font-bold ${isUp ? 'text-brand' : 'text-error'}`}>{report.avgAccuracy}%</p>
              <p className="text-[10px] text-gray-400">正确率</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
            上周: {report.lastWeekHours} · <span className={isUp ? 'text-brand' : 'text-error'}>▲ +{accuracyDiff}%</span>
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-2xl p-4 card-glow mt-4">
          <h3 className="text-sm font-bold text-gray-800 mb-2">每日学习时长</h3>
          <BarChart data={report.dailyMinutes} />
        </div>

        {/* Accuracy trend */}
        <div className="bg-white rounded-2xl p-4 card-glow mt-4">
          <h3 className="text-sm font-bold text-gray-800 mb-2">正确率趋势</h3>
          <AccuracyTrendChart data={report.accuracyTrend} />
          <div className="flex items-center justify-center gap-4 mt-1">
            <span className="flex items-center gap-1 text-[10px] text-gray-400">
              <span className="w-4 h-0.5 bg-blue rounded" /> 本周
            </span>
            <span className="flex items-center gap-1 text-[10px] text-gray-400">
              <span className="w-4 h-0.5 bg-gray-300 rounded border-dashed" style={{ borderTop: '1.5px dashed #D1D5DB', height: 0 }} /> 上周
            </span>
          </div>
        </div>

        {/* Weak points */}
        <div className="bg-white rounded-2xl card-glow mt-4 overflow-hidden">
          <div className="p-4 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-800">薄弱知识点 Top {report.weakPoints.length}</h3>
          </div>
          {report.weakPoints.map(wp => (
            <div key={wp.rank} className="px-4 py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-4">{wp.rank}.</span>
                  <span className="text-sm text-gray-700">{wp.name}</span>
                </div>
                <button className="text-xs text-brand font-medium">▶ 练习</button>
              </div>
              <div className="flex items-center gap-3 mt-1.5 ml-6">
                <span className="text-[10px] text-gray-400">正确率 {wp.accuracy}%</span>
                <span className="text-[10px] text-error">错{wp.wrongCount}题</span>
                <div className="flex-1 flex items-center gap-1.5">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${wp.mastery >= 80 ? 'bg-brand' : wp.mastery >= 60 ? 'bg-warning' : 'bg-error'}`}
                      style={{ width: `${wp.mastery}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400">{wp.mastery}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <div className="bg-white rounded-2xl p-4 card-glow mt-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3">与上周对比</h3>
          <div className="space-y-2.5">
            {report.comparison.map(c => (
              <div key={c.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{c.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">{c.value}</span>
                  <span className={`text-xs font-medium ${c.up ? 'text-brand' : 'text-error'}`}>
                    {c.up ? '▲' : '▼'} {c.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI summary */}
        <div className="bg-gradient-to-br from-blue-light to-brand-light rounded-2xl p-4 mt-4">
          <div className="flex items-start gap-3">
            <img src={TEACHER_IMG} alt="小花老师" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium mb-1">小花老师本周总结</p>
              <p className={`text-sm text-gray-700 leading-relaxed whitespace-pre-line ${summaryExpanded ? '' : 'line-clamp-5'}`}>
                {report.aiSummary}
              </p>
              <button onClick={() => setSummaryExpanded(!summaryExpanded)} className="mt-1 text-xs text-brand font-medium">
                {summaryExpanded ? '收起 ▲' : '展开全部 ▼'}
              </button>
            </div>
          </div>
        </div>

        <div className="h-4" />
      </div>

      <BottomTabBar tabs={reportTabs} />
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMode } from '../contexts/ModeContext'
import NavigationBar from '../components/NavigationBar'
import ActionButton from '../components/ActionButton'
import { mockMonthlyReport } from '../mock/reportData'

const TEACHER_IMG = '/images/teacher.png'

function SubTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex-1 py-2 text-sm font-medium transition-all relative ${active ? 'text-brand' : 'text-gray-400'}`}>
      {label}
      {active && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand rounded-full" />}
    </button>
  )
}

function RankTrendChart({ data }: { data: { month: string; percentile: number }[] }) {
  const chartH = 120
  const chartW = 280
  const stepX = chartW / (data.length - 1)

  const toY = (v: number) => chartH - (v / 100) * chartH

  const linePoints = data.map((d, i) => `${i * stepX},${toY(d.percentile)}`).join(' ')
  const areaPath = `M0,${toY(data[0].percentile)} ${data.map((d, i) => `L${i * stepX},${toY(d.percentile)}`).join(' ')} L${(data.length - 1) * stepX},${chartH} L0,${chartH} Z`

  return (
    <svg viewBox={`-25 -10 ${chartW + 35} ${chartH + 30}`} className="w-full h-36">
      {[0, 25, 50, 75, 100].map(v => (
        <g key={v}>
          <line x1="0" y1={toY(v)} x2={chartW} y2={toY(v)} stroke="#F3F4F6" strokeWidth="1" />
          <text x="-8" y={toY(v) + 3} textAnchor="end" className="text-[8px] fill-gray-400">{v}%</text>
        </g>
      ))}
      <defs>
        <linearGradient id="rankGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A90D9" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#4A90D9" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#rankGrad)" />
      <polyline fill="none" stroke="#4A90D9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={linePoints} />
      {data.map((d, i) => {
        const isLast = i === data.length - 1
        return (
          <g key={d.month}>
            <circle cx={i * stepX} cy={toY(d.percentile)} r={isLast ? 5 : 3.5} fill="white" stroke="#4A90D9" strokeWidth="2.5" />
            {isLast && <circle cx={i * stepX} cy={toY(d.percentile)} r="8" fill="none" stroke="#4A90D9" strokeWidth="1" opacity="0.3" className="animate-pulse" />}
            <text x={i * stepX} y={chartH + 16} textAnchor="middle" className="text-[9px] fill-gray-400">{d.month}</text>
          </g>
        )
      })}
    </svg>
  )
}

export default function E3MonthlyReport() {
  const { homePath } = useMode()
  const navigate = useNavigate()
  const report = mockMonthlyReport
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null)
  const [evalExpanded, setEvalExpanded] = useState(false)

  const hoursDiff = '+12%'
  const accuracyDiff = report.avgAccuracy - report.lastMonthAccuracy
  const questionsDiff = report.totalQuestions - report.lastMonthQuestions

  return (
    <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
      <NavigationBar title="学习报告" onBack={() => navigate(homePath)} />

      {/* Sub tabs */}
      <div className="flex border-b border-gray-100 px-4 glass">
        <SubTab active={false} label="每日" onClick={() => navigate('/report')} />
        <SubTab active={false} label="周报" onClick={() => navigate('/report/weekly')} />
        <SubTab active label="月报" onClick={() => {}} />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10 px-4 pb-4">
        {/* Month selector */}
        <div className="flex items-center justify-center gap-4 py-3">
          <button className="p-1 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <p className="text-sm font-semibold text-gray-800">{report.month}</p>
          <button className="p-1 text-gray-200" disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* Rank trend */}
        <div className="bg-white rounded-2xl p-4 card-glow">
          <h3 className="text-sm font-bold text-gray-800 mb-2">排名百分位趋势</h3>
          <RankTrendChart data={report.rankTrend} />
        </div>

        {/* Monthly data cards */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white rounded-2xl p-3 card-glow text-center">
            <p className="text-lg font-bold text-gray-800">{report.totalHours}</p>
            <p className="text-[10px] text-gray-400">学习时长</p>
            <p className="text-[10px] text-gray-400 mt-1">上月 {report.lastMonthHours}</p>
            <p className="text-[10px] text-brand font-medium">▲ {hoursDiff}</p>
          </div>
          <div className="bg-white rounded-2xl p-3 card-glow text-center">
            <p className="text-lg font-bold text-gray-800">{report.avgAccuracy}%</p>
            <p className="text-[10px] text-gray-400">平均正确率</p>
            <p className="text-[10px] text-gray-400 mt-1">上月 {report.lastMonthAccuracy}%</p>
            <p className="text-[10px] text-brand font-medium">▲ +{accuracyDiff}%</p>
          </div>
          <div className="bg-white rounded-2xl p-3 card-glow text-center">
            <p className="text-lg font-bold text-gray-800">{report.totalQuestions}</p>
            <p className="text-[10px] text-gray-400">答题量</p>
            <p className="text-[10px] text-gray-400 mt-1">上月 {report.lastMonthQuestions}</p>
            <p className="text-[10px] text-brand font-medium">▲ +{questionsDiff}题</p>
          </div>
        </div>

        {/* Subject mastery */}
        <div className="bg-white rounded-2xl card-glow mt-4 overflow-hidden">
          <div className="p-4 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-800">知识掌握全景</h3>
          </div>
          {report.subjectMastery.map(subject => {
            const expanded = expandedSubject === subject.name
            const barColor = subject.mastery >= 80 ? 'bg-brand' : subject.mastery >= 60 ? 'bg-warning' : 'bg-error'
            return (
              <div key={subject.name} className="border-b border-gray-50 last:border-0">
                <button
                  onClick={() => setExpandedSubject(expanded ? null : subject.name)}
                  className="w-full px-4 py-3 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-700">{subject.name}</span>
                      <span className="text-sm font-semibold text-gray-800">{subject.mastery}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${barColor}`} style={{ width: `${subject.mastery}%` }} />
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className={`ml-3 transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {expanded && (
                  <div className="px-4 pb-3 space-y-2 animate-slide-up">
                    {subject.points.map(pt => {
                      const icon = pt.mastery >= 80 ? '✅' : pt.mastery >= 60 ? '⚡' : '⚠'
                      return (
                        <div key={pt.name} className="flex items-center justify-between pl-2">
                          <span className="text-xs text-gray-600">{icon} {pt.name}</span>
                          <span className={`text-xs font-medium ${pt.mastery >= 80 ? 'text-brand' : pt.mastery >= 60 ? 'text-warning' : 'text-error'}`}>
                            {pt.mastery}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* AI evaluation */}
        <div className="bg-gradient-to-br from-[#F3E8FF] to-[#EBF3FC] rounded-2xl p-4 mt-4 border border-[#E9D5FF]">
          <div className="flex items-start gap-3">
            <img src={TEACHER_IMG} alt="小花老师" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium mb-1">小花老师月度评估</p>
              <p className={`text-sm text-gray-700 leading-relaxed whitespace-pre-line ${evalExpanded ? '' : 'line-clamp-6'}`}>
                {report.aiEvaluation}
              </p>
              <button onClick={() => setEvalExpanded(!evalExpanded)} className="mt-1 text-xs text-brand font-medium">
                {evalExpanded ? '收起 ▲' : '展开全部 ▼'}
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4">
          <ActionButton variant="primary" fullWidth onClick={() => navigate('/plan/create')}>
            📋 调整学习计划
          </ActionButton>
        </div>

        <div className="h-4" />
      </div>

    </div>
  )
}

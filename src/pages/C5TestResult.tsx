import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import TeacherAvatar from '../components/TeacherAvatar'
import ActionButton from '../components/ActionButton'
import { mockTestResult } from '../mock/planData'

const TEACHER_IMG = '/images/teacher.png'

function RadarChart({ data }: { data: { label: string; value: number }[] }) {
  const size = 200
  const cx = size / 2
  const cy = size / 2
  const r = 70
  const n = data.length

  const getPoint = (idx: number, val: number) => {
    const angle = (Math.PI * 2 * idx) / n - Math.PI / 2
    const dist = (val / 100) * r
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) }
  }

  const gridLevels = [25, 50, 75, 100]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-48">
      {/* Grid */}
      {gridLevels.map(level => {
        const points = Array.from({ length: n }, (_, i) => {
          const p = getPoint(i, level)
          return `${p.x},${p.y}`
        }).join(' ')
        return <polygon key={level} points={points} fill="none" stroke="#E5E7EB" strokeWidth="0.5" />
      })}
      {/* Axis lines */}
      {data.map((_, i) => {
        const p = getPoint(i, 100)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#E5E7EB" strokeWidth="0.5" />
      })}
      {/* Data polygon */}
      <polygon
        points={data.map((d, i) => { const p = getPoint(i, d.value); return `${p.x},${p.y}` }).join(' ')}
        fill="rgba(74,144,217,0.15)"
        stroke="#4A90D9"
        strokeWidth="2"
      />
      {/* Data points */}
      {data.map((d, i) => {
        const p = getPoint(i, d.value)
        return <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="white" stroke="#4A90D9" strokeWidth="2" />
      })}
      {/* Labels */}
      {data.map((d, i) => {
        const p = getPoint(i, 115)
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="text-[10px] fill-gray-500 font-medium">
            {d.label}
          </text>
        )
      })}
    </svg>
  )
}

export default function C5TestResult() {
  const navigate = useNavigate()
  const result = mockTestResult
  const [phase, setPhase] = useState<'reveal' | 'detail'>('reveal')
  const [expandedWrong, setExpandedWrong] = useState<number | null>(result.wrongQuestions[0]?.id ?? null)

  const scoreDiff = result.lastScore !== null ? result.totalScore - result.lastScore : null
  const isUp = scoreDiff !== null && scoreDiff > 0

  const aiComment = result.totalScore >= 90
    ? '太厉害了！几乎全对！你就是学霸本霸！'
    : result.totalScore >= 80
      ? '很棒哦！继续保持就能更上一层楼！'
      : result.totalScore >= 70
        ? '还不错，有几个知识点需要巩固一下'
        : result.totalScore >= 60
          ? '及格了，但还有提升空间哦，我们一起加油！'
          : '没关系，我们来看看哪些地方需要加强，下次一定更好！'

  if (phase === 'reveal') {
    return (
      <div className="h-full flex flex-col items-center justify-center page-bg-warm relative overflow-hidden px-6">
        <div className="deco-circle w-64 h-64 bg-blue/5 -top-20 -right-20" />
        <div className="deco-circle w-48 h-48 bg-brand/5 bottom-20 -left-16" />

        <div className="text-center relative z-10 animate-scale-in">
          <TeacherAvatar mode="full" />

          {/* Score circle */}
          <div className="relative w-36 h-36 mx-auto mt-6">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#E5E7EB" strokeWidth="6" />
              <circle
                cx="60" cy="60" r="54" fill="none" stroke="url(#scoreGrad)" strokeWidth="6"
                strokeDasharray={`${(result.totalScore / result.maxScore) * 339} 339`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4A90D9" />
                  <stop offset="100%" stopColor="#2BBB6E" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-gray-800">{result.totalScore}</span>
              <span className="text-sm text-gray-400">/{result.maxScore}</span>
            </div>
          </div>

          {/* Percentile */}
          <div className="mt-4 inline-block bg-blue/10 px-4 py-1.5 rounded-full">
            <span className="text-sm text-blue font-semibold">超越了 {result.percentile}% 的同学</span>
          </div>

          {/* Summary card */}
          <div className="bg-white rounded-2xl p-4 card-glow mt-4 text-left">
            <p className="text-sm font-bold text-gray-800 mb-2">{result.subject}测评 · {result.difficulty}难度</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p>用时: {result.timeUsed}分钟 / {result.timeLimit}分钟</p>
              <p>正确: {result.correctCount}/{result.totalQuestions}题</p>
              {scoreDiff !== null && (
                <p className={isUp ? 'text-brand' : 'text-error'}>
                  较上次: {isUp ? '↑' : '↓'} {Math.abs(scoreDiff)}分 ({isUp ? '+' : ''}{((scoreDiff / (result.lastScore || 1)) * 100).toFixed(1)}%)
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setPhase('detail')}
            className="mt-6 text-sm text-gray-400 animate-float"
          >
            ↓ 下滑查看详情
          </button>
        </div>
      </div>
    )
  }

  // Detail phase
  return (
    <div className="h-full flex flex-col page-bg-chat relative overflow-hidden">
      <NavigationBar
        title={`测评结果  ${result.subject}·${result.difficulty}`}
        onBack={() => setPhase('reveal')}
        rightElement={
          <img src={TEACHER_IMG} alt="小花老师" className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm" />
        }
      />

      <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10 px-4 pb-6">
        {/* Score overview */}
        <div className="bg-white rounded-2xl p-4 card-glow mt-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-800">成绩概览</h3>
            <span className="text-xl font-black text-gray-800">{result.totalScore}/{result.maxScore}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center py-2 bg-brand/5 rounded-xl">
              <p className="text-lg font-bold text-brand">{result.correctCount}题</p>
              <p className="text-[10px] text-gray-400">正确</p>
            </div>
            <div className="text-center py-2 bg-error/5 rounded-xl">
              <p className="text-lg font-bold text-error">{result.wrongCount}题</p>
              <p className="text-[10px] text-gray-400">错误</p>
            </div>
            <div className="text-center py-2 bg-blue/5 rounded-xl">
              <p className="text-lg font-bold text-blue">{result.timeUsed}min</p>
              <p className="text-[10px] text-gray-400">用时</p>
            </div>
          </div>
        </div>

        {/* Radar chart */}
        <div className="bg-white rounded-2xl p-4 card-glow mt-4">
          <h3 className="text-sm font-bold text-gray-800 mb-2">能力雷达图</h3>
          <RadarChart data={result.radarData} />
        </div>

        {/* AI comment */}
        <div className="bg-gradient-to-br from-blue-light to-brand-light rounded-2xl p-4 mt-4">
          <div className="flex items-start gap-3">
            <img src={TEACHER_IMG} alt="小花老师" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0" />
            <p className="text-sm text-gray-700 leading-relaxed">{aiComment}</p>
          </div>
        </div>

        {/* Wrong questions */}
        <div className="bg-white rounded-2xl mt-4 card-glow overflow-hidden">
          <div className="p-4 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-800">错题详解 ({result.wrongCount}题)</h3>
          </div>
          {result.wrongQuestions.map(wq => {
            const expanded = expandedWrong === wq.id
            return (
              <div key={wq.id} className="border-b border-gray-50 last:border-0">
                <button
                  onClick={() => setExpandedWrong(expanded ? null : wq.id)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <span className="text-sm text-gray-700">
                    <span className="text-error font-semibold">第{wq.id}题 ✗</span>
                    <span className="text-gray-400 ml-2">{wq.knowledgePoint}</span>
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"
                    className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {expanded && (
                  <div className="px-4 pb-4 animate-slide-up">
                    <div className="bg-gray-50 rounded-xl p-3 mb-3">
                      <p className="text-sm text-gray-700 mb-2">{wq.content}</p>
                      <p className="text-xs"><span className="text-error">你的答案: {wq.yourAnswer}</span></p>
                      <p className="text-xs"><span className="text-brand">正确答案: {wq.correctAnswer}</span></p>
                    </div>
                    <div className="bg-blue-light/50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1 font-medium">🔊 AI老师讲解</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{wq.explanation}</p>
                    </div>
                    <button className="mt-2 text-xs text-brand font-medium">
                      查看知识点: {wq.knowledgePoint}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Action button */}
        <div className="mt-6">
          <ActionButton variant="primary" fullWidth onClick={() => navigate('/plan/create')}>
            生成学习计划 →
          </ActionButton>
        </div>
      </div>
    </div>
  )
}

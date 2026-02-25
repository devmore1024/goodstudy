import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import TeacherAvatar from '../components/TeacherAvatar'
import DialogBubble from '../components/DialogBubble'
import ActionButton from '../components/ActionButton'
import { assessmentSubjects, difficultyOptions, questionCountOptions, scoreHistory } from '../mock/planData'

export default function C3TestSetup() {
  const navigate = useNavigate()
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState('advanced')
  const [questionCount, setQuestionCount] = useState(15)
  const [timeLimit, setTimeLimit] = useState(30)
  const [avatarShrunk, setAvatarShrunk] = useState(false)

  const toggleSubject = (name: string) => {
    setSelectedSubjects(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    )
    if (!avatarShrunk) setAvatarShrunk(true)
  }

  const primarySubject = selectedSubjects[0]
  const primaryData = assessmentSubjects.find(s => s.name === primarySubject)

  // Mini chart for selected subject
  const chartH = 80
  const chartW = 220
  const maxY = 100
  const minY = 50

  return (
    <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
      <div className="deco-circle w-48 h-48 bg-blue/4 -top-16 -right-16" />
      <div className="deco-circle w-32 h-32 bg-brand/4 bottom-40 -left-10" />

      <NavigationBar title="测评设置" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10">
        {/* Teacher */}
        <div className={`flex justify-center transition-all duration-500 ${avatarShrunk ? 'py-2' : 'py-4'}`}>
          <TeacherAvatar mode={avatarShrunk ? 'avatar' : 'upper'} />
        </div>

        {!avatarShrunk && (
          <div className="px-4 mb-2">
            <DialogBubble role="ai" content="来测一测最近学得怎么样吧！选择你想测评的科目，我来帮你出题！" />
          </div>
        )}

        <div className="px-4 space-y-4 pb-6">
          {/* Subject selection */}
          <div className="bg-white rounded-2xl p-4 card-glow">
            <h3 className="text-sm font-bold text-gray-800 mb-3">选择测评科目</h3>
            <div className="grid grid-cols-3 gap-3">
              {assessmentSubjects.map(sub => {
                const selected = selectedSubjects.includes(sub.name)
                return (
                  <button
                    key={sub.name}
                    onClick={() => toggleSubject(sub.name)}
                    className={`relative flex flex-col items-center gap-1.5 py-4 rounded-2xl transition-all active:scale-95 ${
                      selected
                        ? 'bg-blue/8 border-2 border-blue shadow-sm'
                        : 'bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    {selected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    )}
                    <span className="text-2xl">{sub.icon}</span>
                    <span className={`text-sm font-medium ${selected ? 'text-blue' : 'text-gray-700'}`}>{sub.name}</span>
                    <span className="text-[10px] text-gray-400">
                      {sub.lastScore !== null ? `★${sub.lastScore}分` : '新科目'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Test parameters */}
          {selectedSubjects.length > 0 && (
            <div className="bg-white rounded-2xl p-4 card-glow animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-800">测评参数</h3>
                <span className="text-[10px] text-brand bg-brand/10 px-2 py-0.5 rounded-full">AI推荐</span>
              </div>

              {/* Difficulty */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">难度等级</p>
                <div className="flex gap-2">
                  {difficultyOptions.map(opt => {
                    const selected = difficulty === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setDifficulty(opt.value)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 relative ${
                          selected
                            ? 'bg-blue/10 text-blue border border-blue'
                            : 'bg-gray-50 text-gray-500 border border-transparent'
                        }`}
                      >
                        {opt.label}
                        {opt.recommended && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-blue text-white px-1.5 py-0.5 rounded-full">推荐</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Question count */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">题目数量</p>
                <div className="flex gap-2">
                  {questionCountOptions.map(n => {
                    const selected = questionCount === n
                    const recommended = n === 15
                    return (
                      <button
                        key={n}
                        onClick={() => setQuestionCount(n)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 relative ${
                          selected
                            ? 'bg-blue/10 text-blue border border-blue'
                            : 'bg-gray-50 text-gray-500 border border-transparent'
                        }`}
                      >
                        {n}题
                        {recommended && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-blue text-white px-1.5 py-0.5 rounded-full">推荐</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time limit slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">时间限制</p>
                  <span className="text-sm font-bold text-blue">{timeLimit}分钟</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={60}
                  step={5}
                  value={timeLimit}
                  onChange={e => setTimeLimit(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-gray-200 accent-blue"
                />
                <p className="text-[10px] text-gray-400 mt-1">AI推荐: 30分钟</p>
              </div>
            </div>
          )}

          {/* History chart */}
          {primarySubject && primaryData?.lastScore !== null && (
            <div className="bg-white rounded-2xl p-4 card-glow animate-slide-up">
              <h3 className="text-sm font-bold text-gray-800 mb-3">历史成绩对比</h3>
              <p className="text-xs text-gray-500 mb-2">{primarySubject}成绩趋势</p>
              <svg viewBox={`-25 -5 ${chartW + 30} ${chartH + 30}`} className="w-full h-24">
                {[50, 70, 90].map(v => (
                  <g key={v}>
                    <line x1="0" y1={chartH - ((v - minY) / (maxY - minY)) * chartH} x2={chartW} y2={chartH - ((v - minY) / (maxY - minY)) * chartH} stroke="#F3F4F6" strokeWidth="1" />
                    <text x="-5" y={chartH - ((v - minY) / (maxY - minY)) * chartH + 3} textAnchor="end" className="text-[8px] fill-gray-400">{v}</text>
                  </g>
                ))}
                <polyline
                  fill="none"
                  stroke="#4A90D9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={scoreHistory.map((d, i) => {
                    const x = (i / (scoreHistory.length - 1)) * chartW
                    const y = chartH - ((d.score - minY) / (maxY - minY)) * chartH
                    return `${x},${y}`
                  }).join(' ')}
                />
                {scoreHistory.map((d, i) => {
                  const x = (i / (scoreHistory.length - 1)) * chartW
                  const y = chartH - ((d.score - minY) / (maxY - minY)) * chartH
                  const isLast = i === scoreHistory.length - 1
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r={isLast ? 5 : 3} fill="white" stroke="#4A90D9" strokeWidth="2" />
                      {isLast && <text x={x} y={y - 8} textAnchor="middle" className="text-[9px] fill-blue font-bold">★</text>}
                      <text x={x} y={chartH + 14} textAnchor="middle" className="text-[8px] fill-gray-400">{d.date}</text>
                    </g>
                  )
                })}
              </svg>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-500">★ 最近一次: <span className="font-semibold text-gray-800">{primaryData?.lastScore}分</span></span>
                <span className="text-xs text-brand">↑ 较上次提升 5分</span>
              </div>
            </div>
          )}

          {/* Start button */}
          <ActionButton
            variant="primary"
            fullWidth
            disabled={selectedSubjects.length === 0}
            onClick={() => navigate('/test/progress')}
          >
            开始测评 →
          </ActionButton>
        </div>
      </div>
    </div>
  )
}

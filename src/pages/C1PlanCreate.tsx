import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMode } from '../contexts/ModeContext'
import NavigationBar from '../components/NavigationBar'
import TeacherAvatar from '../components/TeacherAvatar'
import DialogBubble from '../components/DialogBubble'
import ActionButton from '../components/ActionButton'
import { diagnosisResults, subjectDirections, testFrequencyOptions } from '../mock/planData'

const subjectColorMap: Record<string, string> = {
  '数学': '#4A90D9', '语文': '#FF7A45', '英语': '#2BBB6E',
}

export default function C1PlanCreate() {
  const { homePath } = useMode()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedDirections, setSelectedDirections] = useState<Record<string, string[]>>({})
  const [subjectHours, setSubjectHours] = useState<Record<string, number>>({ '语文': 4, '数学': 6, '英语': 5 })
  const [testFreq, setTestFreq] = useState('biweekly')
  const [avatarShrunk, setAvatarShrunk] = useState(false)

  const totalHours = Object.values(subjectHours).reduce((a, b) => a + b, 0)

  const toggleDirection = (subject: string, dir: string) => {
    setSelectedDirections(prev => {
      const current = prev[subject] || []
      if (dir === '我不确定') {
        return { ...prev, [subject]: ['我不确定'] }
      }
      const without = current.filter(d => d !== '我不确定')
      if (without.includes(dir)) {
        return { ...prev, [subject]: without.filter(d => d !== dir) }
      }
      return { ...prev, [subject]: [...without, dir] }
    })
  }

  const canProceedStep1 = diagnosisResults
    .filter(d => !d.hasExam)
    .every(d => (selectedDirections[d.subject] || []).length > 0)

  const handleSlider = (subject: string, value: number) => {
    setSubjectHours(prev => ({ ...prev, [subject]: value }))
  }

  return (
    <div className="h-full flex flex-col page-bg-chat relative overflow-hidden">
      <div className="deco-circle w-48 h-48 bg-brand/4 -top-16 -right-16" />
      <div className="deco-circle w-32 h-32 bg-orange/4 bottom-40 -left-10" />

      <NavigationBar
        title="创建学习计划"
        onBack={() => navigate(-1)}
        rightElement={<span className="text-xs text-gray-400">步骤{step}/5</span>}
      />

      <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10">
        {/* Teacher avatar */}
        <div className={`flex justify-center transition-all duration-500 ${avatarShrunk ? 'py-2' : 'py-4'}`}>
          <TeacherAvatar mode={avatarShrunk ? 'avatar' : 'upper'} />
        </div>

        <div className="px-4 space-y-4 pb-6">
          {/* ===== Step 1: Diagnosis + Directions ===== */}
          {step >= 1 && (
            <div className="animate-slide-up space-y-3">
              {/* Diagnosis cards for subjects with exam data */}
              {diagnosisResults.filter(d => d.hasExam).map(diag => (
                <div key={diag.subject}>
                  <DialogBubble
                    role="ai"
                    content={`我看了你上传的${diag.subject}试卷，了解到你在${diag.weakPoints?.join('、')}方面比较薄弱，我会重点帮你在这方面提升！`}
                  />
                  <div className="ml-12 mt-2 bg-white rounded-2xl p-4 shadow-sm border-l-4" style={{ borderColor: subjectColorMap[diag.subject] }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">📊</span>
                      <span className="text-sm font-bold text-gray-800">{diag.subject}诊断摘要</span>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <p className="text-gray-600">得分：<span className="font-semibold text-gray-800">{diag.score}/{diag.fullScore}</span></p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-600">薄弱点：</span>
                        {diag.weakPoints?.map(p => (
                          <span key={p} className="px-2 py-0.5 rounded-full bg-error/10 text-error text-xs">{p}</span>
                        ))}
                      </div>
                      <p className="text-gray-500 text-xs mt-1">AI建议：{diag.aiSuggestion}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Direction selectors for subjects without exam data */}
              {diagnosisResults.filter(d => !d.hasExam).map(diag => (
                <div key={diag.subject}>
                  <DialogBubble
                    role="ai"
                    content={`${diag.subject}还没有试卷数据，你觉得自己${diag.subject}哪方面需要加强呢？`}
                  />
                  <div className="ml-12 mt-2 bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm">📝</span>
                      <span className="text-sm font-bold text-gray-800">{diag.subject}学习方向</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(subjectDirections[diag.subject] || []).map(dir => {
                        const selected = (selectedDirections[diag.subject] || []).includes(dir)
                        return (
                          <button
                            key={dir}
                            onClick={() => toggleDirection(diag.subject, dir)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all active:scale-95 ${
                              selected
                                ? 'bg-brand/10 text-brand border border-brand font-medium'
                                : 'bg-white text-gray-600 border border-gray-200'
                            }`}
                          >
                            {dir}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {step === 1 && (
                <ActionButton
                  variant="primary"
                  fullWidth
                  disabled={!canProceedStep1}
                  onClick={() => { setStep(2); setAvatarShrunk(true) }}
                >
                  下一步 →
                </ActionButton>
              )}
            </div>
          )}

          {/* ===== Step 2: Weekly Time ===== */}
          {step >= 2 && (
            <div className="animate-slide-up space-y-3">
              <DialogBubble role="ai" content="根据你的情况，我建议每周安排以下学习时间，你可以拖拽调整哦~" />
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span>📅</span>
                  <span className="text-sm font-bold text-gray-800">每周时间安排</span>
                </div>
                {/* Simplified grid representation */}
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-8 gap-px text-center text-[10px] min-w-[300px]">
                    <div className="text-gray-400 py-1"></div>
                    {['一', '二', '三', '四', '五', '六', '日'].map(d => (
                      <div key={d} className="font-medium text-gray-600 py-1">周{d}</div>
                    ))}
                    {[8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20].map(hour => (
                      <div key={hour} className="contents">
                        <div className="text-gray-400 py-1.5 text-right pr-1">{hour}:00</div>
                        {[0, 1, 2, 3, 4, 5, 6].map(day => {
                          const idx = hour - 8
                          const filled = idx >= 0 && idx < 14 && (
                            (day === 0 && (hour === 10 || hour === 11 || hour === 18)) ||
                            (day === 1 && (hour === 16 || hour === 17)) ||
                            (day === 2 && (hour === 10 || hour === 11 || hour === 16 || hour === 17 || hour === 18)) ||
                            (day === 3 && (hour === 16 || hour === 17)) ||
                            (day === 5 && (hour >= 8 && hour <= 11)) ||
                            (day === 6 && (hour === 9 || hour === 10))
                          )
                          return (
                            <div
                              key={`${day}-${hour}`}
                              className={`py-1.5 rounded-sm transition-colors ${
                                filled ? 'bg-blue/20' : 'bg-gray-50'
                              }`}
                            />
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue/20" /> AI推荐时段</span>
                  <span>长按拖拽可调整</span>
                </div>
              </div>
              {step === 2 && (
                <ActionButton variant="primary" fullWidth onClick={() => setStep(3)}>
                  下一步 →
                </ActionButton>
              )}
            </div>
          )}

          {/* ===== Step 3: Subject Time Allocation ===== */}
          {step >= 3 && (
            <div className="animate-slide-up space-y-3">
              <DialogBubble role="ai" content="接下来调整每个科目的学习时间分配吧，总时长根据你选择的时段自动计算~" />
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-4">科目时间分配</h3>
                {['语文', '数学', '英语'].map(subject => (
                  <div key={subject} className="mb-4 last:mb-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-700 font-medium">{subject}</span>
                      <span className="text-sm font-bold" style={{ color: subjectColorMap[subject] }}>{subjectHours[subject]}h</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={subjectHours[subject]}
                      onChange={e => handleSlider(subject, Number(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none bg-gray-200 accent-brand"
                    />
                  </div>
                ))}
                <div className="mt-3 pt-3 border-t border-gray-100 text-right">
                  <span className="text-sm text-gray-500">总计：<span className="font-bold text-gray-800">{totalHours}h/周</span></span>
                </div>
              </div>
              {step === 3 && (
                <ActionButton variant="primary" fullWidth onClick={() => setStep(4)}>
                  下一步 →
                </ActionButton>
              )}
            </div>
          )}

          {/* ===== Step 4: Test Frequency ===== */}
          {step >= 4 && (
            <div className="animate-slide-up space-y-3">
              <DialogBubble role="ai" content="定期测评可以帮你检验学习效果，选一个你觉得合适的频率吧~" />
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3">测评频率</h3>
                <div className="flex gap-3">
                  {testFrequencyOptions.map(opt => {
                    const selected = testFreq === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setTestFreq(opt.value)}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all active:scale-95 relative ${
                          selected
                            ? 'bg-brand/10 text-brand border-2 border-brand'
                            : 'bg-gray-50 text-gray-600 border-2 border-transparent'
                        }`}
                      >
                        {opt.label}
                        {opt.recommended && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] bg-brand text-white px-1.5 py-0.5 rounded-full">推荐</span>
                        )}
                        {selected && (
                          <span className="absolute top-1 right-1 text-brand text-xs">✓</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
              {step === 4 && (
                <ActionButton variant="primary" fullWidth onClick={() => setStep(5)}>
                  下一步 →
                </ActionButton>
              )}
            </div>
          )}

          {/* ===== Step 5: Confirm ===== */}
          {step >= 5 && (
            <div className="animate-slide-up space-y-3">
              <DialogBubble role="ai" content="学习计划已经准备好了！如果你还有什么想调整的，可以告诉我，或者直接确认生成计划吧~" />
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3">计划预览</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>科目：语文、数学、英语</p>
                  <p>每周总时长：{totalHours}小时</p>
                  <p>测评频率：{testFrequencyOptions.find(o => o.value === testFreq)?.label}</p>
                  <div className="flex gap-2 mt-2">
                    {['语文', '数学', '英语'].map(s => (
                      <span key={s} className="px-2 py-1 rounded-lg text-xs text-white font-medium" style={{ backgroundColor: subjectColorMap[s] }}>
                        {s} {subjectHours[s]}h
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <ActionButton
                  variant="outline"
                  fullWidth
                  onClick={() => setStep(4)}
                >
                  变更计划
                </ActionButton>
                <ActionButton
                  variant="gradient"
                  fullWidth
                  onClick={() => navigate(homePath)}
                >
                  确认生成 →
                </ActionButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

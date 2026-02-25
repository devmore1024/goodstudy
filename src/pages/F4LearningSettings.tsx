import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import { mockLearningSettings, voiceStyles, mockFamilyMembers } from '../mock/profileData'

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  return (
    <div className="absolute top-16 inset-x-0 z-50 flex justify-center animate-slide-up" onAnimationEnd={() => setTimeout(onDone, 1200)}>
      <div className="bg-gray-800/90 text-white text-sm px-4 py-2 rounded-xl flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        {message}
      </div>
    </div>
  )
}

function Slider({
  min, max, step, value, onChange, labels, unit, disabled,
}: {
  min: number; max: number; step: number; value: number
  onChange: (v: number) => void; labels?: string[]; unit?: string; disabled?: boolean
}) {
  const percent = ((value - min) / (max - min)) * 100
  const trackColor = disabled ? '#D1D5DB' : '#2BBB6E'

  return (
    <div className={disabled ? 'opacity-60' : ''}>
      <div className="relative mt-2 mb-1">
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={e => !disabled && onChange(Number(e.target.value))}
          disabled={disabled}
          className={`w-full h-1.5 bg-gray-200 rounded-full appearance-none ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} accent-brand`}
          style={{
            background: `linear-gradient(to right, ${trackColor} ${percent}%, #E5E7EB ${percent}%)`,
          }}
        />
      </div>
      {labels && (
        <div className="flex justify-between text-[10px] text-gray-400">
          {labels.map(l => <span key={l}>{l}</span>)}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1">当前设置：{value}{unit || ''}</p>
    </div>
  )
}

export default function F4LearningSettings() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || 'student'
  const isReadOnly = mode === 'parent'

  const students = mockFamilyMembers.filter(m => m.role === 'student')
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.name || '')
  const [settings, setSettings] = useState(mockLearningSettings)
  const [toast, setToast] = useState<string | null>(null)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [editingReminder, setEditingReminder] = useState<string | null>(null)
  const [pickerHour, setPickerHour] = useState(16)
  const [pickerMinute, setPickerMinute] = useState(0)

  const showToast = (msg: string) => setToast(msg)

  const handleReadOnlyTap = () => {
    showToast('学习设置由学生自己调整')
  }

  const updateSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    if (isReadOnly) { handleReadOnlyTap(); return }
    setSettings(prev => ({ ...prev, [key]: value }))
    showToast('设置已保存')
  }

  const handleSaveReminder = () => {
    const time = `${String(pickerHour).padStart(2, '0')}:${String(pickerMinute).padStart(2, '0')}`
    if (editingReminder) {
      setSettings(prev => ({
        ...prev,
        reminders: prev.reminders.map(r => r.id === editingReminder ? { ...r, time } : r),
      }))
    } else {
      setSettings(prev => ({
        ...prev,
        reminders: [...prev.reminders, { id: Date.now().toString(), time, days: [1, 2, 3, 4, 5] }],
      }))
    }
    setShowTimePicker(false)
    setEditingReminder(null)
    showToast('设置已保存')
  }

  return (
    <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
      <NavigationBar title="学习设置" onBack={() => navigate(-1)} />

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10 px-5 pb-6">
        {/* Read-only banner (parent mode) */}
        {isReadOnly && (
          <div className="mt-3 mb-1 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-2">
            <span className="text-base leading-none mt-0.5">👁</span>
            <p className="text-xs text-amber-700">当前为查看模式，学习设置由学生自己调整</p>
          </div>
        )}

        {/* Student selector (parent: view-only switch; student: hidden) */}
        {isReadOnly ? (
          <div className="py-3">
            <p className="text-xs text-gray-400 mb-2">查看对象：</p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {students.map(s => {
                const active = selectedStudent === s.name
                return (
                  <button
                    key={s.name}
                    onClick={() => setSelectedStudent(s.name)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      active ? 'bg-brand text-white' : 'bg-white text-gray-500 border border-gray-200'
                    }`}
                  >
                    {s.name} {active && '✓'}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="h-3" />
        )}

        {/* Learning Time section */}
        <div className="flex items-center gap-2 mb-3 mt-2">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400 px-2">学习时间</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Reminders */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <p className="text-sm font-medium text-gray-700 mb-3">每日学习提醒时间</p>
          {settings.reminders.map(r => (
            <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className={`text-sm font-medium tabular-nums ${isReadOnly ? 'text-gray-500' : 'text-gray-800'}`}>{r.time}</span>
              {!isReadOnly && (
                <button
                  onClick={() => {
                    setEditingReminder(r.id)
                    const [h, m] = r.time.split(':').map(Number)
                    setPickerHour(h)
                    setPickerMinute(m)
                    setShowTimePicker(true)
                  }}
                  className="text-xs text-blue font-medium"
                >
                  编辑
                </button>
              )}
            </div>
          ))}
          {!isReadOnly && settings.reminders.length < 5 && (
            <button
              onClick={() => {
                setEditingReminder(null)
                setPickerHour(17)
                setPickerMinute(0)
                setShowTimePicker(true)
              }}
              className="mt-2 text-sm text-blue font-medium"
            >
              ＋ 添加提醒
            </button>
          )}
        </div>

        {/* Session duration */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1">单次学习时长上限</p>
          <Slider
            min={15} max={90} step={5} value={settings.maxSessionMinutes}
            onChange={v => updateSetting('maxSessionMinutes', v)}
            labels={['15分钟', '45分钟', '90分钟']} unit=" 分钟"
            disabled={isReadOnly}
          />
        </div>

        {/* Break interval */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1">休息提醒间隔</p>
          <Slider
            min={10} max={45} step={5} value={settings.breakIntervalMinutes}
            onChange={v => updateSetting('breakIntervalMinutes', v)}
            labels={['10分钟', '25分钟', '45分钟']} unit=" 分钟"
            disabled={isReadOnly}
          />
          <p className="text-[10px] text-gray-400 mt-1">每学习{settings.breakIntervalMinutes}分钟提醒休息5分钟</p>
        </div>

        {/* Voice section */}
        <div className="flex items-center gap-2 mb-3 mt-5">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400 px-2">语音与互动</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Speech rate */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1">语音播放语速</p>
          <Slider
            min={0.75} max={1.5} step={0.25} value={settings.speechRate}
            onChange={v => updateSetting('speechRate', v)}
            labels={['0.75x', '1.0x', '1.25x', '1.5x']} unit="x"
            disabled={isReadOnly}
          />
        </div>

        {/* Voice style */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <p className="text-sm font-medium text-gray-700 mb-3">AI老师音色选择</p>
          <div className={`space-y-2.5 ${isReadOnly ? 'opacity-60' : ''}`}>
            {voiceStyles.map(vs => {
              const selected = settings.voiceStyle === vs.id
              return (
                <div
                  key={vs.id}
                  onClick={() => !isReadOnly && updateSetting('voiceStyle', vs.id)}
                  className={`w-full flex items-center justify-between py-2 ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selected ? (isReadOnly ? 'border-gray-400' : 'border-brand') : 'border-gray-300'
                    }`}>
                      {selected && <div className={`w-2.5 h-2.5 rounded-full ${isReadOnly ? 'bg-gray-400' : 'bg-brand'}`} />}
                    </div>
                    <span className={`text-sm ${selected ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>{vs.label}</span>
                  </div>
                  <button className="text-xs text-blue font-medium flex items-center gap-0.5">
                    ▶ 试听
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Eye care section */}
        <div className="flex items-center gap-2 mb-3 mt-5">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400 px-2">护眼与健康</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50">
            <div>
              <p className="text-sm text-gray-700">护眼模式</p>
              <p className="text-[10px] text-gray-400 mt-0.5">开启后屏幕色温偏暖，降低蓝光刺激</p>
            </div>
            <button
              onClick={() => isReadOnly ? handleReadOnlyTap() : updateSetting('eyeCareEnabled', !settings.eyeCareEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.eyeCareEnabled
                  ? (isReadOnly ? 'bg-gray-400' : 'bg-brand')
                  : 'bg-gray-300'
              } ${isReadOnly ? 'cursor-not-allowed' : ''}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.eyeCareEnabled ? 'translate-x-5.5 left-auto right-0.5' : 'left-0.5'}`}
                style={{ transform: settings.eyeCareEnabled ? 'translateX(0)' : 'translateX(0)', left: settings.eyeCareEnabled ? 'auto' : '2px', right: settings.eyeCareEnabled ? '2px' : 'auto' }}
              />
            </button>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm text-gray-700">定时护眼提醒</p>
              <p className="text-[10px] text-gray-400 mt-0.5">每20分钟提醒远眺休息</p>
            </div>
            <button
              onClick={() => isReadOnly ? handleReadOnlyTap() : updateSetting('eyeCareReminderEnabled', !settings.eyeCareReminderEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.eyeCareReminderEnabled
                  ? (isReadOnly ? 'bg-gray-400' : 'bg-brand')
                  : 'bg-gray-300'
              } ${isReadOnly ? 'cursor-not-allowed' : ''}`}
            >
              <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                style={{ left: settings.eyeCareReminderEnabled ? 'auto' : '2px', right: settings.eyeCareReminderEnabled ? '2px' : 'auto' }}
              />
            </button>
          </div>
        </div>

        <div className="h-8" />
      </div>

      {/* Time picker dialog */}
      {showTimePicker && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="bg-white rounded-t-3xl w-full p-5 pb-[env(safe-area-inset-bottom)] animate-slide-up">
            <h3 className="text-base font-bold text-gray-800 mb-4">设置提醒时间</h3>
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="flex flex-col items-center">
                <button onClick={() => setPickerHour(h => Math.min(23, h + 1))} className="text-gray-400 p-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
                </button>
                <span className="text-3xl font-bold text-gray-800 tabular-nums w-12 text-center">{String(pickerHour).padStart(2, '0')}</span>
                <button onClick={() => setPickerHour(h => Math.max(0, h - 1))} className="text-gray-400 p-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
              </div>
              <span className="text-2xl font-bold text-gray-400">:</span>
              <div className="flex flex-col items-center">
                <button onClick={() => setPickerMinute(m => m >= 55 ? 0 : m + 5)} className="text-gray-400 p-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
                </button>
                <span className="text-3xl font-bold text-gray-800 tabular-nums w-12 text-center">{String(pickerMinute).padStart(2, '0')}</span>
                <button onClick={() => setPickerMinute(m => m <= 0 ? 55 : m - 5)} className="text-gray-400 p-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setShowTimePicker(false); setEditingReminder(null) }} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-600 font-medium">
                取消
              </button>
              <button onClick={handleSaveReminder} className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold">
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

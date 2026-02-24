import { useState } from 'react'
import type { ExamInfo } from '../types'
import { examTypes, subjects } from '../mock/studentData'

interface Props {
  onSubmit: (info: ExamInfo) => void
}

export default function ExamInfoForm({ onSubmit }: Props) {
  const [form, setForm] = useState<ExamInfo>({
    examType: '',
    subject: '',
    date: '',
    totalScore: '',
    myScore: '',
  })

  const update = (key: keyof ExamInfo, val: string) => setForm(prev => ({ ...prev, [key]: val }))
  const isValid = form.examType && form.subject && form.totalScore && form.myScore

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">试卷信息</h2>
        <p className="text-xs text-gray-400 mt-0.5">请填写试卷的基本信息</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-5">
        {/* Exam Type */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">考试类型</label>
          <div className="flex flex-wrap gap-2">
            {examTypes.map(t => (
              <button
                key={t}
                onClick={() => update('examType', t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  form.examType === t ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">科目</label>
          <div className="flex flex-wrap gap-2">
            {subjects.slice(0, 3).map(s => (
              <button
                key={s}
                onClick={() => update('subject', s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  form.subject === s ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">考试日期</label>
          <input
            type="date"
            value={form.date}
            onChange={e => update('date', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand"
          />
        </div>

        {/* Scores */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">满分</label>
            <input
              type="number"
              value={form.totalScore}
              onChange={e => update('totalScore', e.target.value)}
              placeholder="如 150"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">得分</label>
            <input
              type="number"
              value={form.myScore}
              onChange={e => update('myScore', e.target.value)}
              placeholder="如 120"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-brand"
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-t border-gray-100">
        <button
          onClick={() => isValid && onSubmit(form)}
          disabled={!isValid}
          className="w-full py-3 rounded-xl bg-brand text-white text-sm font-medium disabled:bg-gray-200 disabled:text-gray-400 active:scale-95 transition-all"
        >
          开始识别
        </button>
      </div>
    </div>
  )
}

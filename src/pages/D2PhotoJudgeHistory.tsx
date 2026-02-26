import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import { mockJudgeHistory } from '../mock/d2Data'
import type { JudgeRecord, D2Question } from '../mock/d2Data'

function toast(msg: string) {
  const el = document.createElement('div')
  el.textContent = msg
  Object.assign(el.style, {
    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
    background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '10px 20px',
    borderRadius: '8px', fontSize: '14px', zIndex: '9999', pointerEvents: 'none',
  })
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 1800)
}

/* ─── 详情查看弹窗 ─── */
function DetailModal({ record, onClose }: { record: JudgeRecord; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl flex flex-col animate-slide-up" style={{ height: '75%' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-800">{record.subject} · {record.date}</p>
            <p className="text-xs text-gray-400">{record.totalQuestions} 题 · 正确率 {record.accuracy}%</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Questions */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-3">
          {record.questions.map((q, idx) => (
            <QuestionItem key={q.id} question={q} index={idx} />
          ))}
        </div>
      </div>
    </div>
  )
}

function QuestionItem({ question: q, index }: { question: D2Question; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const bgClass = q.isCorrect ? 'bg-success/5 border-success/20' : 'bg-error/5 border-error/20'

  return (
    <div className={`rounded-2xl border p-3 ${bgClass} animate-slide-up`} style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex items-start gap-2">
        <span className="text-base">{q.isCorrect ? '✅' : '❌'}</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">{q.id}. {q.content} {q.correctAnswer}</p>
          <p className="text-xs mt-0.5">
            <span className="text-gray-500">你的答案：{q.userAnswer}</span>
            {q.isCorrect
              ? <span className="text-brand ml-2 font-medium">✓ 正确</span>
              : <span className="text-error ml-2 font-medium">✗ 错误</span>
            }
          </p>
        </div>
      </div>

      {!q.isCorrect && q.explanation && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-gray-500 mt-2"
          >
            📖 {expanded ? '收起解析' : '查看解析'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: expanded ? '300px' : '0', opacity: expanded ? 1 : 0 }}>
            <div className="mt-2 bg-white rounded-xl p-2.5 space-y-1">
              {q.explanation.steps.map((step, i) => (
                <p key={i} className="text-xs text-gray-600">{'①②③④⑤'[i]} {step}</p>
              ))}
              <p className="text-xs text-gray-500 pt-1 border-t border-gray-100">
                知识点：<span className="font-medium text-gray-700">{q.explanation.knowledgePoint}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ─── 删除确认弹窗 ─── */
function DeleteConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-5 mx-8 w-full max-w-xs animate-slide-up">
        <p className="text-base font-semibold text-gray-800 text-center">确认删除</p>
        <p className="text-sm text-gray-500 text-center mt-2">删除后无法恢复，确定要删除这条判题记录吗？</p>
        <div className="flex gap-3 mt-5">
          <button onClick={onCancel} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium">取消</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-error text-white rounded-xl text-sm font-medium">删除</button>
        </div>
      </div>
    </div>
  )
}

/* ─── 主页面 ─── */
export default function D2PhotoJudgeHistory() {
  const navigate = useNavigate()
  const [records, setRecords] = useState<JudgeRecord[]>(mockJudgeHistory)
  const [viewRecord, setViewRecord] = useState<JudgeRecord | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [swipedId, setSwipedId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id))
    setDeleteId(null)
    setSwipedId(null)
    toast('已删除')
  }

  const accuracyColor = (acc: number) => {
    if (acc >= 80) return 'text-brand'
    if (acc >= 60) return 'text-yellow-500'
    return 'text-error'
  }

  return (
    <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
      <NavigationBar title="判题记录" onBack={() => navigate(-1)} />

      {records.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">暂无判题记录</p>
          <button
            onClick={() => navigate('/photo-judge')}
            className="mt-4 px-6 py-2.5 bg-brand text-white rounded-xl text-sm font-medium"
          >
            去拍照判题
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-3">
          {records.map((record, idx) => (
            <div
              key={record.id}
              className="relative overflow-hidden rounded-2xl animate-slide-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* Delete layer (revealed on swipe) */}
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-error flex items-center justify-center rounded-r-2xl">
                <button
                  onClick={() => setDeleteId(record.id)}
                  className="text-white text-sm font-medium"
                >
                  删除
                </button>
              </div>

              {/* Card */}
              <div
                className={`relative bg-white rounded-2xl p-4 card-glow transition-transform duration-200 ${
                  swipedId === record.id ? '-translate-x-20' : 'translate-x-0'
                }`}
                onClick={() => {
                  if (swipedId === record.id) {
                    setSwipedId(null)
                  } else {
                    setViewRecord(record)
                  }
                }}
                onTouchStart={(e) => {
                  const touch = e.touches[0]
                  ;(e.currentTarget as any)._startX = touch.clientX
                }}
                onTouchEnd={(e) => {
                  const startX = (e.currentTarget as any)._startX
                  const endX = e.changedTouches[0].clientX
                  const diff = startX - endX
                  if (diff > 60) {
                    setSwipedId(record.id)
                  } else if (diff < -30) {
                    setSwipedId(null)
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Accuracy ring */}
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="#f0f0f0" strokeWidth="3" />
                        <circle
                          cx="18" cy="18" r="15" fill="none"
                          stroke={record.accuracy >= 80 ? '#2BBB6E' : record.accuracy >= 60 ? '#F5A623' : '#FF4D4F'}
                          strokeWidth="3" strokeLinecap="round"
                          strokeDasharray={`${record.accuracy * 0.942} 94.2`}
                        />
                      </svg>
                      <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${accuracyColor(record.accuracy)}`}>
                        {record.accuracy}%
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">{record.subject}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{record.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-700">
                      <span className="font-bold text-brand">{record.correctCount}</span>
                      <span className="text-gray-400">/{record.totalQuestions} 正确</span>
                    </p>
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <span className="text-xs text-gray-400">查看详情</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Wrong question preview */}
                {record.questions.some(q => !q.isCorrect) && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-1.5">错题：</p>
                    <div className="flex flex-wrap gap-1.5">
                      {record.questions.filter(q => !q.isCorrect).map(q => (
                        <span key={q.id} className="text-xs bg-error/10 text-error px-2 py-0.5 rounded-lg">
                          第{q.id}题
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {viewRecord && <DetailModal record={viewRecord} onClose={() => setViewRecord(null)} />}

      {/* Delete confirm */}
      {deleteId && (
        <DeleteConfirm
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => { setDeleteId(null); setSwipedId(null) }}
        />
      )}
    </div>
  )
}

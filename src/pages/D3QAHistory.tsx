import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import DialogBubble from '../components/DialogBubble'
import { mockQASessions } from '../mock/d3Data'
import type { QASession } from '../mock/d3Data'

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

const subjectColors: Record<string, string> = {
  '数学': '#2BBB6E',
  '语文': '#4A90D9',
  '英语': '#FF7A45',
}

/* ─── 会话详情弹窗 ─── */
function SessionDetail({ session, onClose }: { session: QASession; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl flex flex-col animate-slide-up" style={{ height: '80%' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-800">{session.topic}</p>
            <p className="text-xs text-gray-400">{session.subject} · {session.date}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-4">
          {session.messages.map(msg => (
            <DialogBubble key={msg.id} content={msg.content} role={msg.role} />
          ))}
        </div>
      </div>
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
        <p className="text-sm text-gray-500 text-center mt-2">删除后无法恢复，确定要删除这条答疑记录吗？</p>
        <div className="flex gap-3 mt-5">
          <button onClick={onCancel} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium">取消</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-error text-white rounded-xl text-sm font-medium">删除</button>
        </div>
      </div>
    </div>
  )
}

/* ─── 主页面 ─── */
export default function D3QAHistory() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<QASession[]>(mockQASessions)
  const [viewSession, setViewSession] = useState<QASession | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [swipedId, setSwipedId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id))
    setDeleteId(null)
    setSwipedId(null)
    toast('已删除')
  }

  return (
    <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
      <NavigationBar title="答疑记录" onBack={() => navigate(-1)} />

      {sessions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">暂无答疑记录</p>
          <button
            onClick={() => navigate('/qa')}
            className="mt-4 px-6 py-2.5 bg-brand text-white rounded-xl text-sm font-medium"
          >
            去问小花老师
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-3">
          {sessions.map((session, idx) => (
            <div
              key={session.id}
              className="relative overflow-hidden rounded-2xl animate-slide-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* Delete layer */}
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-error flex items-center justify-center rounded-r-2xl">
                <button
                  onClick={() => setDeleteId(session.id)}
                  className="text-white text-sm font-medium"
                >
                  删除
                </button>
              </div>

              {/* Card */}
              <div
                className={`relative bg-white rounded-2xl p-4 card-glow transition-transform duration-200 ${
                  swipedId === session.id ? '-translate-x-20' : 'translate-x-0'
                }`}
                onClick={() => {
                  if (swipedId === session.id) {
                    setSwipedId(null)
                  } else {
                    setViewSession(session)
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
                    setSwipedId(session.id)
                  } else if (diff < -30) {
                    setSwipedId(null)
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Subject badge */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: subjectColors[session.subject] || '#9B59B6' }}
                  >
                    {session.subject[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800 truncate pr-2">{session.topic}</p>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" className="flex-shrink-0">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-md text-white"
                        style={{ backgroundColor: subjectColors[session.subject] || '#9B59B6' }}
                      >
                        {session.subject}
                      </span>
                      <span className="text-xs text-gray-400">{session.date}</span>
                    </div>

                    {/* Preview of last user message */}
                    <div className="mt-2 bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-500 truncate">
                        {session.messages.filter(m => m.role === 'user')[0]?.content || ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">{session.messageCount} 条对话</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Session detail modal */}
      {viewSession && <SessionDetail session={viewSession} onClose={() => setViewSession(null)} />}

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

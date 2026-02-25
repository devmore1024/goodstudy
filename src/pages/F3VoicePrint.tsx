import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import ActionButton from '../components/ActionButton'
import { mockFamilyMembers } from '../mock/profileData'
import type { FamilyMember } from '../mock/profileData'

type Phase = 'list' | 'recording' | 'success' | 'failed'

const qualityLabels: Record<string, { label: string; color: string; bars: number }> = {
  excellent: { label: '优', color: 'bg-brand', bars: 6 },
  good: { label: '良', color: 'bg-brand', bars: 5 },
  fair: { label: '中', color: 'bg-warning', bars: 4 },
  poor: { label: '差', color: 'bg-error', bars: 2 },
}

function QualityBar({ quality }: { quality?: string }) {
  const info = qualityLabels[quality || 'poor'] || qualityLabels.poor
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-gray-400">声纹质量：{info.label}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`w-2 h-2.5 rounded-sm ${i < info.bars ? info.color : 'bg-gray-200'}`} />
        ))}
      </div>
    </div>
  )
}

function VoiceCard({ member, onAction }: { member: FamilyMember; onAction: () => void }) {
  const avatarBg = member.role === 'parent' ? 'bg-blue' : 'bg-orange'

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full ${avatarBg} flex items-center justify-center text-white text-lg font-bold flex-shrink-0`}>
          {member.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800">{member.name}</span>
            <button onClick={onAction} className={`text-xs font-medium ${member.voiceEnrolled ? 'text-blue' : 'text-orange'}`}>
              {member.voiceEnrolled ? '重新录入' : '去录入'}
            </button>
          </div>
          {member.voiceEnrolled ? (
            <>
              <p className="text-xs text-gray-400 mt-0.5">录入时间 {member.voiceEnrollDate}</p>
              <QualityBar quality={member.voiceQuality} />
            </>
          ) : (
            <p className="text-xs text-warning mt-0.5">
              {member.role === 'student' ? `学生 · ${member.grade}` : member.role === 'parent' ? '家长' : ''}
              <br />⚠ 未录入声纹
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Simulated waveform visualization
function WaveformVisualizer({ active }: { active: boolean }) {
  const [bars, setBars] = useState<number[]>(Array(20).fill(10))
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (active) {
      animRef.current = setInterval(() => {
        setBars(Array.from({ length: 20 }, () => Math.random() * 80 + 10))
      }, 100)
    } else {
      if (animRef.current) clearInterval(animRef.current)
      setBars(Array(20).fill(10))
    }
    return () => { if (animRef.current) clearInterval(animRef.current) }
  }, [active])

  return (
    <div className="flex items-center justify-center gap-0.5 h-16">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-blue transition-all duration-100"
          style={{ height: `${h}%`, opacity: active ? 0.8 : 0.2 }}
        />
      ))}
    </div>
  )
}

export default function F3VoicePrint() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('list')
  const [recording, setRecording] = useState(false)
  const [progress, setProgress] = useState(0)
  const [targetMember, setTargetMember] = useState<FamilyMember | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const enrolled = mockFamilyMembers.filter(m => m.voiceEnrolled)
  const notEnrolled = mockFamilyMembers.filter(m => !m.voiceEnrolled)

  const startRecording = (member: FamilyMember) => {
    setTargetMember(member)
    setPhase('recording')
    setProgress(0)
    setRecording(false)
  }

  const handleRecord = () => {
    if (recording) {
      // Pause
      setRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    } else {
      // Start
      setRecording(true)
      timerRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (timerRef.current) clearInterval(timerRef.current)
            setRecording(false)
            // Simulate success
            setTimeout(() => setPhase('success'), 500)
            return 100
          }
          return prev + 2
        })
      }, 200)
    }
  }

  const navTitle = phase === 'list'
    ? '声纹管理'
    : `录入声纹 - ${targetMember?.name || ''}`

  const handleBack = () => {
    if (phase === 'list') {
      navigate(-1)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      setRecording(false)
      setPhase('list')
    }
  }

  // List phase
  if (phase === 'list') {
    return (
      <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
        <NavigationBar title={navTitle} onBack={handleBack} />
        <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10 px-5 pb-6">
          <p className="text-sm text-gray-400 py-3">声纹用于自动识别家庭成员身份，请在安静环境下录入。</p>

          {enrolled.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400 px-2">已录入</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              {enrolled.map(m => (
                <VoiceCard key={m.id} member={m} onAction={() => startRecording(m)} />
              ))}
            </div>
          )}

          {notEnrolled.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400 px-2">未录入</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              {notEnrolled.map(m => (
                <VoiceCard key={m.id} member={m} onAction={() => startRecording(m)} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Recording phase
  if (phase === 'recording') {
    const seconds = Math.round(progress / 10)
    return (
      <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
        <NavigationBar title={navTitle} onBack={handleBack} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
          <p className="text-sm text-gray-600 font-medium mb-4">请朗读以下文字：</p>
          <div className="bg-[#FFFBEB] rounded-2xl p-4 w-full mb-6">
            <p className="text-base text-gray-800 leading-relaxed text-center">
              "小花老师你好，我是{targetMember?.name}，今天天气真不错，我们一起来学习有趣的知识吧。"
            </p>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-400">环境噪音：</span>
            <span className="text-xs text-brand font-medium">安静 🟢</span>
          </div>

          <div className="w-full bg-white rounded-2xl p-4 mb-4">
            <WaveformVisualizer active={recording} />
          </div>

          <div className="w-full mb-2">
            <p className="text-xs text-gray-400 text-center mb-1.5">录入进度：{seconds}s / 10s</p>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-gray-400 text-center mt-1">还需朗读约 {10 - seconds} 秒</p>
          </div>

          <button
            onClick={handleRecord}
            className={`mt-4 w-18 h-18 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${
              recording ? 'bg-error animate-pulse' : 'bg-gray-100'
            }`}
            style={{ width: 72, height: 72 }}
          >
            {recording ? (
              <div className="w-5 h-5 rounded-sm bg-white" />
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            )}
          </button>
          <p className="text-xs text-gray-400 mt-2">{recording ? '点击暂停' : '点击开始录音'}</p>
        </div>
      </div>
    )
  }

  // Success phase
  if (phase === 'success') {
    return (
      <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
        <NavigationBar title={navTitle} onBack={handleBack} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
          <div className="w-24 h-24 rounded-full bg-brand/10 flex items-center justify-center mb-4 animate-scale-in">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2BBB6E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">声纹录入成功！</h2>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500">声纹质量评估：优</span>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand rounded-full" style={{ width: '92%' }} />
            </div>
            <span className="text-sm font-semibold text-brand">92分</span>
          </div>
          <p className="text-sm text-gray-500 text-center mb-8">
            小花老师现在可以通过声音识别出{targetMember?.name}啦！
          </p>
          <div className="w-full space-y-3">
            <ActionButton variant="primary" fullWidth onClick={() => setPhase('list')}>
              完成返回
            </ActionButton>
            <ActionButton variant="outline" fullWidth onClick={() => { setPhase('recording'); setProgress(0) }}>
              重新录入
            </ActionButton>
          </div>
        </div>
      </div>
    )
  }

  // Failed phase
  return (
    <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
      <NavigationBar title={navTitle} onBack={handleBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <div className="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center mb-4 animate-scale-in">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF4D4F" strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">声纹录入失败</h2>
        <div className="text-sm text-gray-500 text-center mb-6 space-y-1">
          <p>可能原因：</p>
          <p>· 录音中断或不完整</p>
          <p>· 环境噪音过大干扰</p>
          <p>· 朗读内容与提示文字不符</p>
        </div>
        <div className="w-full space-y-3">
          <ActionButton variant="primary" fullWidth onClick={() => { setPhase('recording'); setProgress(0) }}>
            重新录入
          </ActionButton>
          <ActionButton variant="outline" fullWidth onClick={() => setPhase('list')}>
            稍后再试
          </ActionButton>
        </div>
      </div>
    </div>
  )
}

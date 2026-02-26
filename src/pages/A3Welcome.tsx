import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMode } from '../contexts/ModeContext'
import TeacherAvatar from '../components/TeacherAvatar'
import DialogBubble from '../components/DialogBubble'
import ChatInputBar from '../components/ChatInputBar'
import BouncingDots from '../components/BouncingDots'

type Phase = 'greet' | 'greet-done' | 'ask' | 'ask-done' | 'confirm' | 'confirm-done' | 'navigating'

export default function A3Welcome() {
  const navigate = useNavigate()
  const { setMode, homePath } = useMode()
  const [phase, setPhase] = useState<Phase>('greet')
  const [identity, setIdentity] = useState<string>('')
  const [showBubble1, setShowBubble1] = useState(false)
  const [showBubble2, setShowBubble2] = useState(false)
  const [showBubble3, setShowBubble3] = useState(false)
  const [userBubble, setUserBubble] = useState('')
  const [textInput, setTextInput] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setShowBubble1(true), 500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase === 'greet-done') {
      const t = setTimeout(() => {
        setPhase('ask')
        setShowBubble2(true)
      }, 600)
      return () => clearTimeout(t)
    }
    if (phase === 'confirm-done') {
      const t = setTimeout(() => {
        setPhase('navigating')
        navigate(identity.includes('学生') ? '/profile/student' : '/profile/parent')
      }, 1500)
      return () => clearTimeout(t)
    }
  }, [phase, identity, navigate])

  const handleIdentitySelect = (text: string) => {
    const isStudent = text.includes('学生') || text.includes('同学')
    const option = isStudent ? '我是学生' : '我是家长'
    setMode(isStudent ? 'student' : 'parent')
    setIdentity(option)
    setUserBubble(text)
    setTextInput('')
    setPhase('confirm')
    setTimeout(() => setShowBubble3(true), 500)
  }

  const handleSend = () => {
    if (!textInput.trim()) return
    handleIdentitySelect(textInput.trim())
  }

  const isWaitingInput = phase === 'ask-done'

  return (
    <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
      {/* Decorative background */}
      <div className="deco-circle w-56 h-56 bg-orange/5 -top-16 -right-16" />
      <div className="deco-circle w-40 h-40 bg-brand/5 bottom-32 -left-12" />

      {/* Skip button */}
      <div className="flex justify-end px-4 py-2 relative z-10">
        <button
          onClick={() => navigate(homePath)}
          className="text-sm text-gray-400 px-3 py-1 rounded-lg hover:bg-white/50 transition-colors"
        >
          跳过
        </button>
      </div>

      {/* Teacher avatar */}
      <div className="flex justify-center py-4 relative z-10">
        <TeacherAvatar mode="full" />
      </div>

      {/* Chat area */}
      <div className="flex-1 px-4 space-y-4 overflow-y-auto scrollbar-hide pb-4 relative z-10">
        {showBubble1 && (
          <DialogBubble
            content="你好呀！我是小花老师，很高兴认识你！我会陪伴你一起学习，帮你找到最适合自己的学习方式。"
            role="ai"
            animate
            onTypingComplete={() => setPhase('greet-done')}
          />
        )}

        {showBubble2 && (
          <DialogBubble
            content="在开始之前，我想先了解一下，请问你是学生还是家长呢？"
            role="ai"
            animate
            onTypingComplete={() => setPhase('ask-done')}
          />
        )}

        {userBubble && (
          <DialogBubble content={userBubble} role="user" />
        )}

        {showBubble3 && (
          <DialogBubble
            content={identity.includes('学生')
              ? '太好了！欢迎你，同学！让我们先建立你的学习档案，这样我就能更好地帮助你了。'
              : '欢迎您，家长！让我们先建立您的档案，方便我更好地为您的孩子提供帮助。'
            }
            role="ai"
            animate
            onTypingComplete={() => setPhase('confirm-done')}
          />
        )}

        {phase === 'navigating' && (
          <div className="flex justify-center py-4">
            <BouncingDots />
          </div>
        )}
      </div>

      {/* Quick select chips + fixed input bar */}
      {isWaitingInput && (
        <div className="relative z-10">
          {/* Quick select options */}
          <div className="px-4 pb-2 flex gap-2 justify-center">
            <button
              onClick={() => handleIdentitySelect('我是学生')}
              className="px-5 py-2 rounded-full bg-white text-sm font-medium text-brand border border-brand/30 shadow-sm active:scale-95 transition-all hover:bg-brand-light"
            >
              我是学生
            </button>
            <button
              onClick={() => handleIdentitySelect('我是家长')}
              className="px-5 py-2 rounded-full bg-white text-sm font-medium text-brand border border-brand/30 shadow-sm active:scale-95 transition-all hover:bg-brand-light"
            >
              我是家长
            </button>
          </div>
          {/* Input bar */}
          <ChatInputBar
            value={textInput}
            onChange={setTextInput}
            onSend={handleSend}
            onVoiceResult={handleIdentitySelect}
            placeholder="输入或语音回答..."
          />
        </div>
      )}
    </div>
  )
}

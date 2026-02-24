import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TeacherAvatar from '../components/TeacherAvatar'
import DialogBubble from '../components/DialogBubble'
import VoiceInputButton from '../components/VoiceInputButton'
import BouncingDots from '../components/BouncingDots'

type Phase = 'greet' | 'greet-done' | 'ask' | 'ask-done' | 'confirm' | 'confirm-done' | 'navigating'

export default function A3Welcome() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('greet')
  const [identity, setIdentity] = useState<string>('')
  const [showBubble1, setShowBubble1] = useState(false)
  const [showBubble2, setShowBubble2] = useState(false)
  const [showBubble3, setShowBubble3] = useState(false)
  const [userBubble, setUserBubble] = useState('')

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

  const handleIdentitySelect = (option: string) => {
    setIdentity(option)
    setUserBubble(option)
    setPhase('confirm')
    setTimeout(() => setShowBubble3(true), 500)
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-orange-light/30 via-white to-white relative">
      {/* Skip button */}
      <div className="flex justify-end px-4 py-2">
        <button
          onClick={() => navigate('/home/student')}
          className="text-sm text-gray-400 px-3 py-1"
        >
          跳过
        </button>
      </div>

      {/* Teacher avatar */}
      <div className="flex justify-center py-4">
        <TeacherAvatar mode="full" />
      </div>

      {/* Chat area */}
      <div className="flex-1 px-4 space-y-4 overflow-y-auto scrollbar-hide pb-4">
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

      {/* Voice input */}
      {phase === 'ask-done' && (
        <div className="flex justify-center pb-8 pt-2">
          <VoiceInputButton
            options={['我是学生', '我是家长']}
            onSelect={handleIdentitySelect}
          />
        </div>
      )}
    </div>
  )
}

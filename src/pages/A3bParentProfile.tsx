import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMode } from '../contexts/ModeContext'
import TeacherAvatar from '../components/TeacherAvatar'
import ChatMessageList from '../components/ChatMessageList'
import ChatInputBar from '../components/ChatInputBar'
import TagSelector from '../components/TagSelector'
import VoicePrintBar from '../components/VoicePrintBar'
import ChildListCard from '../components/ChildListCard'
import ProfileCard from '../components/ProfileCard'
import ActionButton from '../components/ActionButton'
import { useChatFlow } from '../hooks/useChatFlow'
import { parentProfileFlow } from '../mock/chatFlows'
import { mockChildren } from '../mock/studentData'
import type { ChatMessage } from '../types'

export default function A3bParentProfile() {
  const navigate = useNavigate()
  const { setMode } = useMode()
  const flow = useChatFlow(parentProfileFlow)
  const [showActions, setShowActions] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [avatarShrunk, setAvatarShrunk] = useState(false)
  const [linkedChildren, setLinkedChildren] = useState<string[]>([])

  useEffect(() => {
    flow.start()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (flow.isComplete) {
      setTimeout(() => setShowActions(true), 500)
    }
  }, [flow.isComplete])

  const handleTextSubmit = useCallback(() => {
    if (!textInput.trim()) return
    flow.submitAnswer(textInput.trim())
    setTextInput('')
    setAvatarShrunk(true)
  }, [textInput, flow])

  // Get the current input type from the last AI message
  const lastAiMsg = [...flow.messages].reverse().find(m => m.role === 'ai')
  const currentInputType = lastAiMsg?.inputType
  const showTextBar = currentInputType === 'text' || (!currentInputType && !flow.isComplete && !flow.isTyping)

  const renderInput = useCallback((msg: ChatMessage) => {
    // Text input is now in the fixed bottom bar, skip it here
    if (msg.inputType === 'text') return null

    if (msg.inputType === 'tag-select' && msg.inputConfig && 'type' in msg.inputConfig && msg.inputConfig.type === 'tag-select') {
      const config = msg.inputConfig
      return (
        <div className="mt-3">
          <TagSelector
            tags={'tags' in config ? config.tags : undefined}
            onSelect={(tag) => {
              flow.submitAnswer(tag)
              setAvatarShrunk(true)
            }}
          />
        </div>
      )
    }

    if (msg.inputType === 'voiceprint') {
      return (
        <div className="mt-3 px-2">
          <VoicePrintBar onComplete={() => {
            flow.submitAnswer('已完成')
            setAvatarShrunk(true)
          }} />
        </div>
      )
    }

    if (msg.inputType === 'child-list') {
      return (
        <div className="mt-3">
          <ChildListCard
            children={mockChildren}
            onConfirm={(ids) => {
              setLinkedChildren(ids)
              const names = mockChildren.filter(c => ids.includes(c.id)).map(c => c.name).join('、')
              flow.submitAnswer(names || '无')
              setAvatarShrunk(true)
            }}
          />
        </div>
      )
    }

    if (msg.inputType === 'card') {
      const childNames = mockChildren.filter(c => linkedChildren.includes(c.id)).map(c => c.name).join('、')
      return (
        <div className="mt-3">
          <ProfileCard
            data={{
              '身份': flow.profile.parentRole || '',
              '声纹': flow.profile.voicePrint ? '已采集 ✓' : '未采集',
              '关联孩子': childNames || '无',
            }}
            onConfirm={() => setShowActions(true)}
            onEdit={() => {
              flow.start()
              setShowActions(false)
              setAvatarShrunk(false)
            }}
          />
        </div>
      )
    }

    return null
  }, [flow, linkedChildren])

  return (
    <div className="h-full flex flex-col page-bg-chat relative overflow-hidden">
      {/* Decorative background */}
      <div className="deco-circle w-48 h-48 bg-brand/4 -top-16 -right-16" />
      <div className="deco-circle w-32 h-32 bg-blue/4 bottom-40 -left-10" />

      <div className={`flex justify-center transition-all duration-500 relative z-10 ${avatarShrunk ? 'py-2' : 'py-4'}`}>
        <TeacherAvatar mode={avatarShrunk ? 'avatar' : 'upper'} />
      </div>

      <ChatMessageList
        messages={flow.messages}
        isTyping={flow.isTyping}
        renderInput={renderInput}
        lastMessageAnimate
      />

      {/* Fixed bottom input bar */}
      {showTextBar && !showActions && (
        <ChatInputBar
          value={textInput}
          onChange={setTextInput}
          onSend={handleTextSubmit}
          onVoiceResult={(text) => {
            flow.submitAnswer(text)
            setAvatarShrunk(true)
          }}
          disabled={flow.isTyping}
        />
      )}

      {showActions && (
        <div className="px-4 py-4 glass border-t border-gray-100/50 animate-slide-up">
          <ActionButton
            variant="primary"
            fullWidth
            onClick={() => { setMode('parent'); navigate('/home/parent') }}
          >
            进入家长首页
          </ActionButton>
        </div>
      )}
    </div>
  )
}

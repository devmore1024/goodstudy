import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import TeacherAvatar from '../components/TeacherAvatar'
import ChatMessageList from '../components/ChatMessageList'
import ChatInputBar from '../components/ChatInputBar'
import TagSelector from '../components/TagSelector'
import VoicePrintBar from '../components/VoicePrintBar'
import ProfileCard from '../components/ProfileCard'
import ActionButton from '../components/ActionButton'
import { useChatFlow } from '../hooks/useChatFlow'
import { studentProfileFlow } from '../mock/chatFlows'
import type { ChatMessage } from '../types'

export default function A3aStudentProfile() {
  const navigate = useNavigate()
  const flow = useChatFlow(studentProfileFlow)
  const [showActions, setShowActions] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [avatarShrunk, setAvatarShrunk] = useState(false)

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
            groups={'groups' in config ? config.groups : undefined}
            tags={'tags' in config ? config.tags : undefined}
            searchable={'searchable' in config ? config.searchable : undefined}
            columns={'columns' in config ? config.columns : 3}
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

    if (msg.inputType === 'card') {
      return (
        <div className="mt-3">
          <ProfileCard
            data={{
              '姓名': flow.profile.name || '',
              '年级': flow.profile.grade || '',
              '城市': flow.profile.city || '',
              '声纹': flow.profile.voicePrint ? '已采集 ✓' : '未采集',
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
  }, [flow])

  return (
    <div className="h-full flex flex-col page-bg-chat relative overflow-hidden">
      {/* Decorative background */}
      <div className="deco-circle w-48 h-48 bg-brand/4 -top-16 -right-16" />
      <div className="deco-circle w-32 h-32 bg-blue/4 bottom-40 -left-10" />

      {/* Teacher avatar - shrinkable */}
      <div className={`flex justify-center transition-all duration-500 relative z-10 ${avatarShrunk ? 'py-2' : 'py-4'}`}>
        <TeacherAvatar mode={avatarShrunk ? 'avatar' : 'upper'} />
      </div>

      {/* Chat */}
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

      {/* Bottom actions */}
      {showActions && (
        <div className="px-4 py-4 glass border-t border-gray-100/50 flex gap-3 animate-slide-up">
          <ActionButton
            variant="outline"
            fullWidth
            onClick={() => navigate('/exam-upload')}
          >
            上传试卷
          </ActionButton>
          <ActionButton
            variant="primary"
            fullWidth
            onClick={() => navigate('/home/student')}
          >
            直接开始
          </ActionButton>
        </div>
      )}
    </div>
  )
}

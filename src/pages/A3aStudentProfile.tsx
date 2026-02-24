import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import TeacherAvatar from '../components/TeacherAvatar'
import ChatMessageList from '../components/ChatMessageList'
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

  const renderInput = useCallback((msg: ChatMessage) => {
    if (msg.inputType === 'text') {
      return (
        <div className="flex gap-2 mt-3 animate-slide-up">
          <input
            type="text"
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleTextSubmit()}
            placeholder="请输入..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-brand"
            autoFocus
          />
          <button
            onClick={handleTextSubmit}
            disabled={!textInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-medium disabled:bg-gray-200 disabled:text-gray-400"
          >
            发送
          </button>
        </div>
      )
    }

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
  }, [textInput, handleTextSubmit, flow])

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Teacher avatar - shrinkable */}
      <div className={`flex justify-center transition-all duration-500 ${avatarShrunk ? 'py-2' : 'py-4'}`}>
        <TeacherAvatar mode={avatarShrunk ? 'avatar' : 'upper'} />
      </div>

      {/* Chat */}
      <ChatMessageList
        messages={flow.messages}
        isTyping={flow.isTyping}
        renderInput={renderInput}
        lastMessageAnimate
      />

      {/* Bottom actions */}
      {showActions && (
        <div className="px-4 py-4 bg-white border-t border-gray-100 flex gap-3 animate-slide-up">
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

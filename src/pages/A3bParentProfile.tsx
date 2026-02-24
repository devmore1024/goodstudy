import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import TeacherAvatar from '../components/TeacherAvatar'
import ChatMessageList from '../components/ChatMessageList'
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
  }, [textInput, handleTextSubmit, flow, linkedChildren])

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className={`flex justify-center transition-all duration-500 ${avatarShrunk ? 'py-2' : 'py-4'}`}>
        <TeacherAvatar mode={avatarShrunk ? 'avatar' : 'upper'} />
      </div>

      <ChatMessageList
        messages={flow.messages}
        isTyping={flow.isTyping}
        renderInput={renderInput}
        lastMessageAnimate
      />

      {showActions && (
        <div className="px-4 py-4 bg-white border-t border-gray-100 animate-slide-up">
          <ActionButton
            variant="primary"
            fullWidth
            onClick={() => navigate('/home/parent')}
          >
            进入家长首页
          </ActionButton>
        </div>
      )}
    </div>
  )
}

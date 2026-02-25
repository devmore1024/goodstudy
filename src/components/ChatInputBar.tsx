import { useState, useRef, useEffect } from 'react'

interface Props {
  value: string
  onChange: (val: string) => void
  onSend: () => void
  onVoiceResult?: (text: string) => void
  disabled?: boolean
  placeholder?: string
}

export default function ChatInputBar({ value, onChange, onSend, onVoiceResult, disabled, placeholder = '请输入...' }: Props) {
  const [mode, setMode] = useState<'text' | 'voice'>('text')
  const [isRecording, setIsRecording] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (mode === 'text' && !disabled) {
      inputRef.current?.focus()
    }
  }, [mode, disabled])

  const handleToggleMode = () => {
    setMode(prev => prev === 'text' ? 'voice' : 'text')
  }

  const handleVoiceStart = () => {
    setIsRecording(true)
  }

  const handleVoiceEnd = () => {
    if (!isRecording) return
    setIsRecording(false)
    // Simulate voice recognition result
    if (onVoiceResult) {
      onVoiceResult('语音输入内容')
    }
  }

  const hasContent = value.trim().length > 0

  return (
    <div className="px-3 py-2.5 glass border-t border-gray-100/50 relative z-10">
      <div className="flex items-end gap-2">
        {/* Voice/Keyboard toggle */}
        <button
          onClick={handleToggleMode}
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors active:scale-90"
        >
          {mode === 'text' ? (
            // Microphone icon - switch to voice
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          ) : (
            // Keyboard icon - switch to text
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 16h8" />
            </svg>
          )}
        </button>

        {/* Input area */}
        {mode === 'text' ? (
          <div className="flex-1 flex items-end gap-2">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={e => onChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && onSend()}
              placeholder={placeholder}
              disabled={disabled}
              className="flex-1 px-4 py-2 rounded-2xl bg-white border border-gray-200/80 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 shadow-sm transition-all disabled:bg-gray-50 disabled:text-gray-300"
            />
            {/* Send button */}
            <button
              onClick={onSend}
              disabled={!hasContent || disabled}
              className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                hasContent && !disabled
                  ? 'bg-brand text-white btn-glow-brand'
                  : 'bg-gray-100 text-gray-300'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onTouchStart={handleVoiceStart}
            onTouchEnd={handleVoiceEnd}
            onMouseDown={handleVoiceStart}
            onMouseUp={handleVoiceEnd}
            onMouseLeave={() => isRecording && handleVoiceEnd()}
            disabled={disabled}
            className={`flex-1 py-2.5 rounded-2xl text-sm font-medium transition-all active:scale-[0.98] ${
              isRecording
                ? 'bg-brand-light text-brand border-2 border-brand shadow-inner'
                : 'bg-white text-gray-600 border border-gray-200/80 shadow-sm'
            } ${disabled ? 'opacity-50' : ''}`}
          >
            {isRecording ? '松开发送' : '按住说话'}
          </button>
        )}

        {/* Extra action button (emoji/plus) */}
        <button
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors active:scale-90"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

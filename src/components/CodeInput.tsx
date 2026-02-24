import { useState } from 'react'
import { useCountdown } from '../hooks/useCountdown'

interface Props {
  phoneValid: boolean
  onCodeChange?: (code: string) => void
}

export default function CodeInput({ phoneValid, onCodeChange }: Props) {
  const [code, setCode] = useState('')
  const { count, isActive, start } = useCountdown(60)

  const handleSendCode = () => {
    if (!phoneValid || isActive) return
    start()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(val)
    onCodeChange?.(val)
  }

  return (
    <div className="flex items-center border-b-2 border-gray-200 focus-within:border-orange transition-colors pb-2">
      <input
        type="tel"
        value={code}
        onChange={handleChange}
        placeholder="请输入验证码"
        className="flex-1 text-base outline-none bg-transparent text-gray-800 placeholder-gray-300"
        maxLength={6}
      />
      <button
        onClick={handleSendCode}
        disabled={!phoneValid || isActive}
        className={`flex-shrink-0 text-sm font-medium ml-3 ${
          phoneValid && !isActive ? 'text-orange' : 'text-gray-300'
        }`}
      >
        {isActive ? `${count}s 后重新获取` : '获取验证码'}
      </button>
    </div>
  )
}

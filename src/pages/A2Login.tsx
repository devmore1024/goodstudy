import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TeacherAvatar from '../components/TeacherAvatar'
import PhoneInput from '../components/PhoneInput'
import CodeInput from '../components/CodeInput'
import AgreementCheckbox from '../components/AgreementCheckbox'
import Toast from '../components/Toast'

export default function A2Login() {
  const navigate = useNavigate()
  const [phoneValid, setPhoneValid] = useState(false)
  const [code, setCode] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' as const })

  const canLogin = phoneValid && code.length >= 4 && agreed

  const handleLogin = () => {
    if (!agreed) {
      setToast({ visible: true, message: '请先同意用户协议', type: 'error' })
      return
    }
    if (!canLogin) return
    navigate('/welcome')
  }

  return (
    <div className="h-full flex flex-col bg-white relative">
      <Toast {...toast} onClose={() => setToast(t => ({ ...t, visible: false }))} />

      {/* Top right avatar */}
      <div className="absolute top-4 right-4">
        <TeacherAvatar mode="avatar" />
      </div>

      <div className="flex-1 flex flex-col px-8 pt-20">
        {/* Welcome text */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2 animate-fade-in">
          欢迎来到小花老师
        </h1>
        <p className="text-sm text-gray-400 mb-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
          登录后开启你的AI伴学之旅
        </p>

        {/* Phone input */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <PhoneInput
            onChangeValue={(_val, valid) => setPhoneValid(valid)}
          />
        </div>

        {/* Code input */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <CodeInput
            phoneValid={phoneValid}
            onCodeChange={setCode}
          />
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={!canLogin}
          className={`w-full py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-200 active:scale-95 mb-6 animate-fade-in ${
            canLogin
              ? 'bg-gradient-to-r from-orange to-orange-dark shadow-lg shadow-orange/25'
              : 'bg-orange-light'
          }`}
          style={{ animationDelay: '400ms' }}
        >
          登录
        </button>

        {/* Agreement */}
        <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
          <AgreementCheckbox checked={agreed} onChange={setAgreed} />
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="pb-8 flex justify-center">
        <p className="text-xs text-gray-300">小花老师 · 让学习更高效</p>
      </div>
    </div>
  )
}

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
    <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
      <Toast {...toast} onClose={() => setToast(t => ({ ...t, visible: false }))} />

      {/* Decorative background */}
      <div className="deco-circle w-72 h-72 bg-orange/5 -top-24 -right-24" />
      <div className="deco-circle w-48 h-48 bg-brand/5 bottom-20 -left-20" />

      {/* Content - vertically centered */}
      <div className="flex-1 flex flex-col justify-center px-8 relative z-10">
        {/* Avatar centered */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <TeacherAvatar mode="upper" />
        </div>

        {/* Welcome text - centered */}
        <h1 className="text-[26px] font-bold text-gray-800 mb-2 text-center animate-fade-in" style={{ animationDelay: '100ms' }}>
          欢迎来到小花老师
        </h1>
        <p className="text-sm text-gray-400 mb-10 text-center animate-fade-in" style={{ animationDelay: '150ms' }}>
          登录后开启你的AI伴学之旅
        </p>

        {/* Phone input */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <PhoneInput
            onChangeValue={(_val, valid) => setPhoneValid(valid)}
          />
        </div>

        {/* Code input */}
        <div className="mb-10 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <CodeInput
            phoneValid={phoneValid}
            onCodeChange={setCode}
          />
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={!canLogin}
          className={`w-full py-4 rounded-2xl text-base font-semibold text-white transition-all duration-200 active:scale-[0.97] mb-5 animate-fade-in ${
            canLogin
              ? 'bg-gradient-to-r from-orange to-orange-dark btn-glow-orange'
              : 'bg-gray-200 text-gray-400 shadow-none'
          }`}
          style={{ animationDelay: '400ms' }}
        >
          登录
        </button>

        {/* Agreement */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '500ms' }}>
          <AgreementCheckbox checked={agreed} onChange={setAgreed} />
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="pb-8 flex justify-center relative z-10">
        <p className="text-xs text-gray-300">小花老师 · 让学习更高效</p>
      </div>
    </div>
  )
}

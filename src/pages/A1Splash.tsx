import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BouncingDots from '../components/BouncingDots'

const TEACHER_IMG = '/images/teacher.png'

export default function A1Splash() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0) // 0=init, 1=bg, 2=logo, 3=text, 4=dots, 5=fadeout

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 50),
      setTimeout(() => setPhase(2), 300),
      setTimeout(() => setPhase(3), 900),
      setTimeout(() => setPhase(4), 1300),
      setTimeout(() => setPhase(5), 2000),
      setTimeout(() => navigate('/login', { replace: true }), 2500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [navigate])

  return (
    <div
      className={`h-full flex flex-col items-center justify-center page-bg-splash relative overflow-hidden transition-opacity duration-500 ${
        phase >= 1 && phase < 5 ? 'opacity-100' : phase >= 5 ? 'opacity-0' : 'opacity-0'
      }`}
    >
      {/* Decorative background circles */}
      <div className="deco-circle w-64 h-64 bg-brand/5 -top-20 -right-20" />
      <div className="deco-circle w-48 h-48 bg-orange/5 -bottom-16 -left-16" />
      <div className="deco-circle w-32 h-32 bg-blue/5 top-1/3 -left-10" />

      {/* Teacher avatar */}
      <div
        className={`relative mb-6 transition-all duration-700 ${
          phase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand/20 to-orange/15 blur-2xl scale-[2]" />
        <img
          src={TEACHER_IMG}
          alt="小花老师"
          className="relative w-28 h-28 rounded-3xl object-cover shadow-2xl ring-4 ring-white"
        />
      </div>

      {/* App name */}
      <h1
        className={`text-2xl font-bold text-gray-800 mb-1.5 transition-all duration-500 ${
          phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        小花老师
      </h1>

      {/* Tagline */}
      <p
        className={`text-sm text-gray-400 mb-8 tracking-wide transition-all duration-500 ${
          phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: '100ms' }}
      >
        AI伴学 · 因材施教
      </p>

      {/* Loading dots */}
      <div className={`transition-opacity duration-300 ${phase >= 4 ? 'opacity-100' : 'opacity-0'}`}>
        <BouncingDots />
      </div>

      {/* Version */}
      <p className="absolute bottom-8 text-xs text-gray-300">v1.0.0</p>
    </div>
  )
}

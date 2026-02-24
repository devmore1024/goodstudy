import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BouncingDots from '../components/BouncingDots'

export default function A1Splash() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0) // 0=init, 1=bg, 2=logo, 3=text, 4=dots, 5=fadeout

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 50),    // bg fade in
      setTimeout(() => setPhase(2), 300),   // logo scale in
      setTimeout(() => setPhase(3), 900),   // text fade in
      setTimeout(() => setPhase(4), 1300),  // bouncing dots
      setTimeout(() => setPhase(5), 2000),  // fade out
      setTimeout(() => navigate('/login', { replace: true }), 2500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [navigate])

  return (
    <div
      className={`h-full flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        phase >= 1 && phase < 5 ? 'opacity-100' : phase >= 5 ? 'opacity-0' : 'opacity-0'
      }`}
    >
      {/* Logo */}
      <div
        className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center mb-5 transition-all duration-600 ${
          phase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
      >
        <svg width="44" height="44" viewBox="0 0 48 48" fill="white">
          <circle cx="24" cy="18" r="10" />
          <ellipse cx="24" cy="38" rx="16" ry="10" />
          <circle cx="20" cy="16" r="2" fill="#FF7A45" />
          <circle cx="28" cy="16" r="2" fill="#FF7A45" />
          <path d="M 20 22 Q 24 26 28 22" stroke="#FF7A45" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* App name */}
      <h1
        className={`text-2xl font-bold text-gray-800 mb-2 transition-all duration-400 ${
          phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        小花老师
      </h1>

      {/* Tagline */}
      <p
        className={`text-sm text-gray-400 mb-8 transition-all duration-400 ${
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

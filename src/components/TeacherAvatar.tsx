import type { TeacherMode } from '../types'

interface Props {
  mode: TeacherMode
  className?: string
}

const TEACHER_IMG = '/images/teacher.png'

export default function TeacherAvatar({ mode, className = '' }: Props) {
  if (mode === 'hidden') return null

  if (mode === 'avatar') {
    return (
      <div className={`relative w-10 h-10 ${className}`}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand/30 to-blue/20 blur-md scale-125" />
        <img
          src={TEACHER_IMG}
          alt="小花老师"
          className="relative w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-md"
        />
      </div>
    )
  }

  if (mode === 'upper') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand/20 to-orange/15 blur-xl scale-150" />
          <img
            src={TEACHER_IMG}
            alt="小花老师"
            className="relative w-24 h-24 rounded-full object-cover ring-3 ring-white shadow-xl"
          />
        </div>
        <p className="mt-2 text-xs font-medium text-gray-500">小花老师</p>
      </div>
    )
  }

  // full mode
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand/25 to-orange/20 blur-2xl scale-[1.8]" />
        <div className="absolute inset-0 rounded-full animate-pulse-ring bg-brand/10 scale-[2]" />
        <img
          src={TEACHER_IMG}
          alt="小花老师"
          className="relative w-36 h-36 rounded-full object-cover ring-4 ring-white shadow-2xl animate-breathe"
        />
      </div>
      <p className="mt-3 text-sm font-semibold text-gray-700">小花老师</p>
      <p className="text-xs text-gray-400">AI伴学 · 因材施教</p>
    </div>
  )
}

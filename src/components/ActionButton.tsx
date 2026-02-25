import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'outline' | 'gradient' | 'ghost'
  className?: string
  fullWidth?: boolean
}

export default function ActionButton({ children, onClick, disabled, variant = 'primary', className = '', fullWidth }: Props) {
  const base = 'rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-[0.97] py-3.5 px-6'
  const width = fullWidth ? 'w-full' : ''

  const variants: Record<string, string> = {
    primary: 'bg-brand text-white btn-glow-brand disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none',
    outline: 'border-2 border-brand text-brand bg-white hover:bg-brand-light disabled:border-gray-200 disabled:text-gray-400 disabled:bg-transparent shadow-sm',
    gradient: 'bg-gradient-to-r from-orange to-orange-dark text-white btn-glow-orange disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:shadow-none',
    ghost: 'text-gray-500 bg-transparent hover:bg-gray-50 rounded-xl',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${width} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

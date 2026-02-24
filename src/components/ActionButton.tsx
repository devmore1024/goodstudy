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
  const base = 'rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 py-3 px-6'
  const width = fullWidth ? 'w-full' : ''

  const variants: Record<string, string> = {
    primary: 'bg-brand text-white hover:bg-brand-dark disabled:bg-gray-200 disabled:text-gray-400',
    outline: 'border-2 border-brand text-brand bg-transparent hover:bg-brand-light disabled:border-gray-200 disabled:text-gray-400',
    gradient: 'bg-gradient-to-r from-orange to-orange-dark text-white disabled:from-orange-light disabled:to-orange-light disabled:text-white/70',
    ghost: 'text-gray-500 bg-transparent hover:bg-gray-100',
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

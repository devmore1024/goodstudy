import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  visible: boolean
  onClose: () => void
}

export default function Toast({ message, type = 'info', visible, onClose }: ToastProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (visible) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(onClose, 300)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [visible, onClose])

  if (!visible && !show) return null

  const colors: Record<string, string> = {
    success: 'bg-success shadow-[0_4px_16px_rgba(82,196,26,0.3)]',
    error: 'bg-error shadow-[0_4px_16px_rgba(255,77,79,0.3)]',
    info: 'bg-gray-800 shadow-[0_4px_16px_rgba(0,0,0,0.15)]',
  }

  return (
    <div className="absolute top-16 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <div className={`px-6 py-2.5 rounded-2xl text-white text-sm font-medium transition-all duration-300 ${colors[type]} ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        {message}
      </div>
    </div>
  )
}

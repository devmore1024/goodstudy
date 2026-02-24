import { usePhoneFormat } from '../hooks/usePhoneFormat'

interface Props {
  onComplete?: (phone: string) => void
  onChangeValue?: (value: string, isValid: boolean) => void
}

export default function PhoneInput({ onComplete, onChangeValue }: Props) {
  const { value, displayValue, onChange, isValid } = usePhoneFormat()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    onChange(raw)
    const digits = raw.replace(/\D/g, '').slice(0, 11)
    onChangeValue?.(digits, digits.length === 11)
    if (digits.length === 11) {
      onComplete?.(digits)
    }
  }

  return (
    <div className="flex items-center border-b-2 border-gray-200 focus-within:border-orange transition-colors pb-2">
      <span className="text-base font-medium text-gray-800 mr-3 flex-shrink-0">+86</span>
      <div className="w-px h-5 bg-gray-300 mr-3" />
      <input
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder="请输入手机号"
        className="flex-1 text-base outline-none bg-transparent text-gray-800 placeholder-gray-300"
        maxLength={13}
      />
      {isValid && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-success flex-shrink-0">
          <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
          <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  )
}

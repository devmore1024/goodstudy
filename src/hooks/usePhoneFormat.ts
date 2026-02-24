import { useState, useCallback } from 'react'

export function usePhoneFormat() {
  const [value, setValue] = useState('')

  const formatPhone = (raw: string): string => {
    const digits = raw.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 3) return digits
    if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`
  }

  const onChange = useCallback((input: string) => {
    const digits = input.replace(/\D/g, '').slice(0, 11)
    setValue(digits)
  }, [])

  return {
    value,
    displayValue: formatPhone(value),
    onChange,
    isValid: value.length === 11,
  }
}

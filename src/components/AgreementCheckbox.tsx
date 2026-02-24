interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function AgreementCheckbox({ checked, onChange }: Props) {
  return (
    <label className="flex items-start gap-2 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
          checked ? 'bg-orange border-orange' : 'border-gray-300'
        }`}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <span className="text-xs text-gray-400 leading-relaxed">
        我已阅读并同意<span className="text-orange">《用户服务协议》</span>和<span className="text-orange">《隐私政策》</span>
      </span>
    </label>
  )
}

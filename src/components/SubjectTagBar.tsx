interface Props {
  uploaded: string[]
  remaining: string[]
  onSelect: (subject: string) => void
  onFinish: () => void
}

export default function SubjectTagBar({ uploaded, remaining, onSelect, onFinish }: Props) {
  return (
    <div className="space-y-4 animate-slide-up">
      {uploaded.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2">已上传</p>
          <div className="flex flex-wrap gap-2">
            {uploaded.map(s => (
              <span key={s} className="px-3 py-1.5 rounded-full bg-brand text-white text-xs font-medium flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {remaining.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2">继续上传</p>
          <div className="flex flex-wrap gap-2">
            {remaining.map(s => (
              <button
                key={s}
                onClick={() => onSelect(s)}
                className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 active:scale-95 transition-all"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onFinish}
        className="w-full py-3 rounded-xl bg-brand text-white text-sm font-medium active:scale-95 transition-all mt-4"
      >
        没有了，下一步
      </button>
    </div>
  )
}

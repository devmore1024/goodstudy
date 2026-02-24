interface Props {
  data: Record<string, string>
  onConfirm: () => void
  onEdit?: () => void
}

export default function ProfileCard({ data, onConfirm, onEdit }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
      <div className="px-4 py-3 bg-brand-light">
        <h3 className="text-sm font-semibold text-brand">档案信息确认</h3>
      </div>
      <div className="px-4 py-3 space-y-2.5">
        {Object.entries(data).map(([key, val]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{key}</span>
            <span className="text-sm text-gray-800 font-medium">{val}</span>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 flex gap-3 border-t border-gray-50">
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex-1 py-2.5 rounded-xl border-2 border-brand text-brand text-sm font-medium active:scale-95 transition-transform"
          >
            修改
          </button>
        )}
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-medium active:scale-95 transition-transform"
        >
          确认
        </button>
      </div>
    </div>
  )
}

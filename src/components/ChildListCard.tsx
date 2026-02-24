import { useState } from 'react'
import type { ChildInfo } from '../types'

interface Props {
  children: ChildInfo[]
  onConfirm: (selected: string[]) => void
}

export default function ChildListCard({ children, onConfirm }: Props) {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="space-y-3 animate-slide-up">
      {children.map(child => (
        <div
          key={child.id}
          onClick={() => toggle(child.id)}
          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
            selected.includes(child.id) ? 'border-brand bg-brand-light' : 'border-gray-100 bg-white'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-blue flex items-center justify-center text-white text-sm font-bold">
            {child.name[0]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">{child.name}</p>
            <p className="text-xs text-gray-400">{child.grade}</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selected.includes(child.id) ? 'border-brand bg-brand' : 'border-gray-300'
          }`}>
            {selected.includes(child.id) && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>
      ))}
      <button
        onClick={() => onConfirm(selected)}
        disabled={selected.length === 0}
        className="w-full py-3 rounded-xl bg-brand text-white text-sm font-medium disabled:bg-gray-200 disabled:text-gray-400 active:scale-95 transition-all"
      >
        关联选中的孩子 ({selected.length})
      </button>
    </div>
  )
}

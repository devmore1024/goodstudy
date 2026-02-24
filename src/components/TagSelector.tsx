import { useState } from 'react'
import type { TagGroup } from '../types'

interface Props {
  groups?: TagGroup[]
  tags?: string[]
  searchable?: boolean
  columns?: number
  onSelect: (tag: string) => void
  selected?: string
}

export default function TagSelector({ groups, tags, searchable, columns = 3, onSelect, selected }: Props) {
  const [search, setSearch] = useState('')

  const filteredTags = tags?.filter(t => !search || t.includes(search))

  const renderTag = (tag: string) => (
    <button
      key={tag}
      onClick={() => onSelect(tag)}
      className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-95
        ${selected === tag
          ? 'bg-brand text-white shadow-sm'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
    >
      {tag}
    </button>
  )

  return (
    <div className="w-full animate-slide-up">
      {searchable && (
        <div className="mb-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索城市..."
            className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm outline-none focus:border-brand transition-colors"
          />
        </div>
      )}

      {groups ? (
        <div className="space-y-4">
          {groups.map(group => (
            <div key={group.label}>
              <p className="text-xs text-gray-400 mb-2 font-medium">{group.label}</p>
              <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {group.tags.map(renderTag)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {(filteredTags || []).map(renderTag)}
        </div>
      )}
    </div>
  )
}

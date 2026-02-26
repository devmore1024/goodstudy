import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import { knowledgeData } from '../mock/d1Data'
import type { KnowledgePoint, Chapter } from '../mock/d1Data'

const ITEMS_PER_PAGE = 8

const subjects = knowledgeData.map(s => ({ name: s.subject, icon: s.icon }))

function masteryColor(m: number): string {
  if (m >= 80) return '#2BBB6E'
  if (m >= 40) return '#F5A623'
  return '#D1D5DB'
}

function masteryBg(m: number): string {
  if (m >= 80) return 'bg-brand/8'
  if (m >= 40) return 'bg-[#F5A623]/8'
  return 'bg-gray-100'
}

// ─── Knowledge Card ──────────────────────────────────────

function KnowledgeCard({
  point,
  icon,
  onClick,
}: {
  point: KnowledgePoint
  icon: string
  onClick: () => void
}) {
  const color = masteryColor(point.mastery)
  const bg = masteryBg(point.mastery)

  return (
    <button
      onClick={onClick}
      className={`${bg} rounded-2xl p-3.5 text-left flex flex-col gap-2 active:scale-[0.97] transition-all shadow-sm border border-white/60`}
    >
      <span className="text-xl leading-none">{icon}</span>
      <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 min-h-[2.5rem]">
        {point.name}
      </p>
      {/* Progress bar */}
      <div className="w-full">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-200/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(point.mastery, 2)}%`, backgroundColor: color }}
            />
          </div>
          <span className="text-[11px] font-medium min-w-[2rem] text-right" style={{ color }}>
            {point.mastery}%
          </span>
        </div>
      </div>
      <p className="text-[10px] text-gray-400">
        {point.lastStudied ? `${point.lastStudied}学习` : '未学习'}
      </p>
    </button>
  )
}

// ─── Pagination ──────────────────────────────────────────

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number
  total: number
  onChange: (page: number) => void
}) {
  if (total <= 1) return null

  return (
    <div className="flex items-center justify-center gap-1.5 py-4">
      {Array.from({ length: total }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => onChange(page)}
          className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
            page === current
              ? 'bg-brand text-white shadow-sm'
              : 'text-gray-400 active:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}
      {current < total && (
        <button
          onClick={() => onChange(current + 1)}
          className="ml-2 flex items-center gap-0.5 text-xs text-brand font-medium active:opacity-70 transition-opacity"
        >
          下一页
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────

export default function D1Knowledge() {
  const navigate = useNavigate()
  const [activeSubject, setActiveSubject] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const subjectData = knowledgeData[activeSubject]
  const chapters = subjectData.chapters

  // Flatten all points with chapter info for pagination
  type FlatItem = { type: 'chapter'; chapter: Chapter } | { type: 'point'; point: KnowledgePoint; icon: string }
  const flatItems: FlatItem[] = []
  for (const ch of chapters) {
    flatItems.push({ type: 'chapter', chapter: ch })
    for (const p of ch.points) {
      flatItems.push({ type: 'point', point: p, icon: subjectData.icon })
    }
  }

  // Paginate by points count (chapter headers don't count toward limit)
  let pointCount = 0
  let pageStart = 0
  let pageItems: FlatItem[] = []

  // Find the start index for current page
  let pCount = 0
  let pIdx = 0
  for (let targetPage = 1; targetPage < currentPage; targetPage++) {
    let pagePCount = 0
    while (pIdx < flatItems.length && pagePCount < ITEMS_PER_PAGE) {
      if (flatItems[pIdx].type === 'point') pagePCount++
      pIdx++
    }
  }
  pageStart = pIdx

  // Collect items for current page
  pointCount = 0
  for (let i = pageStart; i < flatItems.length && pointCount < ITEMS_PER_PAGE; i++) {
    const item = flatItems[i]
    if (item.type === 'point') pointCount++
    pageItems.push(item)
  }

  // Total pages
  const totalPoints = chapters.reduce((sum, ch) => sum + ch.points.length, 0)
  const totalPages = Math.ceil(totalPoints / ITEMS_PER_PAGE)

  const handleSubjectChange = (idx: number) => {
    setActiveSubject(idx)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of list
    document.getElementById('knowledge-list')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCardClick = (pointId: string) => {
    navigate(`/knowledge/${pointId}`)
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute w-48 h-48 rounded-full bg-brand/4 -top-16 -right-12 blur-2xl" />
      <div className="absolute w-32 h-32 rounded-full bg-orange/4 bottom-20 -left-8 blur-2xl" />

      {/* Nav */}
      <NavigationBar title="知识课堂" />

      {/* Subject Tabs */}
      <div className="px-5 pt-2 pb-1 relative z-10">
        <div className="flex gap-1 bg-gray-100/80 rounded-2xl p-1">
          {subjects.map((s, i) => (
            <button
              key={s.name}
              onClick={() => handleSubjectChange(i)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                i === activeSubject
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-400'
              }`}
            >
              {s.icon} {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge list */}
      <div id="knowledge-list" className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-3 pb-6 relative z-10">
        {pageItems.map((item, idx) => {
          if (item.type === 'chapter') {
            return (
              <div key={item.chapter.id} className={idx > 0 ? 'mt-5' : ''}>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-brand" />
                  {item.chapter.title}
                </h3>
              </div>
            )
          }

          // Collect consecutive point items for grid rendering
          // We render a grid wrapper for groups of points under a chapter
          // Check if previous item was chapter or point
          const prevItem = idx > 0 ? pageItems[idx - 1] : null
          const isFirstInGroup = !prevItem || prevItem.type === 'chapter'

          if (!isFirstInGroup) return null // Rendered as part of a group

          // Gather all consecutive points
          const groupPoints: { point: KnowledgePoint; icon: string }[] = []
          for (let j = idx; j < pageItems.length; j++) {
            const pItem = pageItems[j]
            if (pItem.type === 'chapter') break
            groupPoints.push(pItem)
          }

          return (
            <div key={`grid-${idx}`} className="grid grid-cols-2 gap-3 mb-2">
              {groupPoints.map(gp => (
                <KnowledgeCard
                  key={gp.point.id}
                  point={gp.point}
                  icon={gp.icon}
                  onClick={() => handleCardClick(gp.point.id)}
                />
              ))}
            </div>
          )
        })}

        {/* Pagination */}
        <Pagination current={currentPage} total={totalPages} onChange={handlePageChange} />
      </div>
    </div>
  )
}

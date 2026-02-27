import { useParams } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import { knowledgeData } from '../mock/d1Data'

function findPointName(pointId: string): string {
  for (const subject of knowledgeData) {
    for (const chapter of subject.chapters) {
      const point = chapter.points.find(p => p.id === pointId)
      if (point) return point.name
    }
  }
  return '知识点精讲'
}

export default function D4KnowledgeLecture() {
  const { pointId } = useParams<{ pointId: string }>()
  const pointName = pointId ? findPointName(pointId) : '知识点精讲'

  return (
    <div className="h-full flex flex-col bg-gray-50 relative overflow-hidden">
      {/* Nav */}
      <NavigationBar title={pointName} />

      {/* Video area */}
      <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide">
        <div className="px-4 pt-4 pb-3">
          <div className="rounded-2xl overflow-hidden bg-black shadow-lg">
            <video
              className="w-full"
              src="/知识点讲解演示视频.mp4"
              controls
              autoPlay
              playsInline
              poster=""
            />
          </div>
        </div>

        {/* Info section */}
        <div className="px-5 pb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">{pointName}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="inline-flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              视频讲解
            </span>
            <span>·</span>
            <span>知识点精讲</span>
          </div>
        </div>
      </div>
    </div>
  )
}

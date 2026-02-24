import { useNavigate } from 'react-router-dom'

export default function PlaceholderPage({ title = '占位页面' }: { title?: string }) {
  const navigate = useNavigate()
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center mb-4">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2BBB6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="9" y1="21" x2="9" y2="9"/>
        </svg>
      </div>
      <h1 className="text-xl font-semibold text-gray-800 mb-2">{title}</h1>
      <p className="text-sm text-gray-400 mb-8">页面建设中，敬请期待</p>
      <button
        onClick={() => navigate(-1)}
        className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-medium"
      >
        返回上一页
      </button>
    </div>
  )
}

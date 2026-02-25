import { useState, useEffect, useRef } from 'react'

type NetworkState = 'auto-retry' | 'manual-retry' | 'weak-network' | 'offline' | 'recovered'

interface Props {
  state: NetworkState
  retryCount?: number
  maxRetries?: number
  onRetry?: () => void
  onDismiss?: () => void
}

const TEACHER_IMG = '/images/teacher.png'

// WiFi broken icon
function WiFiBrokenIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M32 52a4 4 0 100-8 4 4 0 000 8z" fill="#9CA3AF" />
      <path d="M12 24c5.5-5.5 12.5-8 20-8s14.5 2.5 20 8" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 32c3.8-3.8 8.7-5.5 14-5.5s10.2 1.7 14 5.5" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 40c2.2-2.2 5-3.2 8-3.2s5.8 1 8 3.2" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" />
      {/* X slash */}
      <line x1="20" y1="20" x2="44" y2="44" stroke="#FF4D4F" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// Spinner for auto-retry
function RetrySpinner() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className="animate-spin">
      <circle cx="12" cy="12" r="9" fill="none" stroke="#E5E7EB" strokeWidth="2" />
      <circle cx="12" cy="12" r="9" fill="none" stroke="#4A90D9" strokeWidth="2" strokeLinecap="round"
        strokeDasharray="45" strokeDashoffset="35" />
    </svg>
  )
}

// Top toast banner
function NetworkToast({ type, onDismiss }: { type: 'weak' | 'recovered'; onDismiss?: () => void }) {
  const isWeak = type === 'weak'

  useEffect(() => {
    if (type === 'recovered') {
      const t = setTimeout(() => onDismiss?.(), 2500)
      return () => clearTimeout(t)
    }
  }, [type, onDismiss])

  return (
    <div
      className={`absolute top-0 inset-x-0 z-[90] px-4 py-3 flex items-center gap-2 animate-slide-up ${
        isWeak ? 'bg-warning/90' : 'bg-brand/90'
      }`}
      style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}
    >
      {isWeak ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      <p className="text-sm text-white font-medium flex-1">
        {isWeak ? '当前网络不稳定，部分功能可能受影响' : '网络已恢复'}
      </p>
      {isWeak && (
        <button onClick={onDismiss} className="text-white/80 text-xs">关闭</button>
      )}
    </div>
  )
}

// Auto-retry overlay
function AutoRetryView({ retryCount = 1, maxRetries = 3 }: { retryCount?: number; maxRetries?: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <WiFiBrokenIcon />
      <p className="text-sm font-medium text-gray-700 mt-4 mb-1">网络连接出了问题</p>
      <div className="flex items-center gap-2 mt-2">
        <RetrySpinner />
        <p className="text-xs text-gray-400">正在自动重试 ({retryCount}/{maxRetries})</p>
      </div>
    </div>
  )
}

// Manual retry full page
function ManualRetryView({ onRetry }: { onRetry?: () => void }) {
  const cachedItems = ['分数运算', '一元方程', '英语语法']

  return (
    <div className="flex flex-col items-center px-6 py-8">
      {/* Teacher */}
      <div className="relative mb-3">
        <img src={TEACHER_IMG} alt="小花老师" className="w-20 h-20 rounded-full object-cover ring-2 ring-white shadow-lg" />
      </div>
      <p className="text-[10px] text-gray-400 mb-4">无奈叹气...</p>

      <WiFiBrokenIcon size={56} />

      <h3 className="text-base font-bold text-gray-800 mt-4 mb-1">哎呀，网络开小差了</h3>
      <p className="text-sm text-gray-500 mb-5">请检查你的网络连接</p>

      <button
        onClick={onRetry}
        className="w-48 py-3 rounded-full bg-brand text-white text-sm font-semibold active:scale-95 transition-all btn-glow-brand mb-6"
      >
        点击重试
      </button>

      {/* Cached content */}
      <div className="w-full border-t border-dashed border-gray-200 pt-4">
        <p className="text-xs text-gray-500 mb-3">你还可以查看这些离线内容：</p>
        <div className="flex gap-2">
          {cachedItems.map(item => (
            <div key={item} className="flex-1 bg-gray-50 rounded-xl py-3 px-2 text-center">
              <p className="text-[10px] text-gray-400 mb-0.5">已缓存</p>
              <p className="text-xs text-gray-700 font-medium">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Offline mode full screen
function OfflineView() {
  const available = ['查看已缓存的知识点', '浏览已下载的学习内容', '查看历史学习记录', '查看已完成的练习题']
  const unavailable = ['AI 语音对话', '拍照识别/批改', '生成新练习题', '同步学习进度', '查看学习报告']

  return (
    <div className="px-5 py-4">
      {/* Offline banner */}
      <div className="bg-warning/10 border border-warning/20 rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8C42" strokeWidth="2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <p className="text-sm text-warning font-medium">当前处于离线模式</p>
      </div>

      {/* Available features */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
        <p className="text-sm font-medium text-gray-700 mb-3">可用功能：</p>
        <div className="space-y-2">
          {available.map(item => (
            <div key={item} className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2BBB6E" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-sm text-gray-600">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Unavailable features */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <p className="text-sm font-medium text-gray-700 mb-3">需要网络的功能：</p>
        <div className="space-y-2">
          {unavailable.map(item => (
            <div key={item} className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF4D4F" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span className="text-sm text-gray-500">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cached content */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-sm font-medium text-gray-700 mb-3">已缓存内容</p>
        <div className="grid grid-cols-3 gap-2">
          {['分数运算', '一元方程', '英语语法'].map(item => (
            <div key={item} className="bg-gray-50 rounded-xl py-4 flex flex-col items-center gap-1">
              <span className="text-lg">📚</span>
              <span className="text-xs text-gray-700 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function G4NetworkError({ state, retryCount, maxRetries = 3, onRetry, onDismiss }: Props) {
  // Toast states
  if (state === 'weak-network') {
    return <NetworkToast type="weak" onDismiss={onDismiss} />
  }

  if (state === 'recovered') {
    return <NetworkToast type="recovered" onDismiss={onDismiss} />
  }

  // Full content states
  if (state === 'auto-retry') {
    return <AutoRetryView retryCount={retryCount} maxRetries={maxRetries} />
  }

  if (state === 'manual-retry') {
    return <ManualRetryView onRetry={onRetry} />
  }

  if (state === 'offline') {
    return <OfflineView />
  }

  return null
}

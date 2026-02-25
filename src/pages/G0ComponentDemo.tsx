import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import G1VoiceOverlay from '../components/G1VoiceOverlay'
import G2PermissionDialog from '../components/G2PermissionDialog'
import G3LoadingState from '../components/G3LoadingState'
import G4NetworkError from '../components/G4NetworkError'

type PermissionType = 'microphone' | 'camera' | 'photos' | 'notifications'

export default function G0ComponentDemo() {
  const navigate = useNavigate()

  // G1
  const [showVoice, setShowVoice] = useState(false)

  // G2
  const [showPermission, setShowPermission] = useState(false)
  const [permType, setPermType] = useState<PermissionType>('microphone')

  // G3
  const [loadingScenario, setLoadingScenario] = useState<'ai-thinking' | 'ocr-scanning' | 'quiz-generating' | 'generic' | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // G4
  const [networkState, setNetworkState] = useState<'auto-retry' | 'manual-retry' | 'weak-network' | 'offline' | 'recovered' | null>(null)

  const openPermission = (type: PermissionType) => {
    setPermType(type)
    setShowPermission(true)
  }

  return (
    <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
      <NavigationBar title="G系列组件演示" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10 px-5 pb-6">
        <p className="text-xs text-gray-400 py-3">点击按钮预览各全局组件效果</p>

        {/* G1 Voice Overlay */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <h3 className="text-sm font-bold text-gray-800 mb-1">G1 语音交互浮层</h3>
          <p className="text-xs text-gray-400 mb-3">4阶段语音交互：唤醒→聆听→处理→回答</p>
          <button
            onClick={() => setShowVoice(true)}
            className="w-full py-2.5 rounded-xl bg-brand text-white text-sm font-semibold active:scale-95 transition-all"
          >
            打开语音交互
          </button>
        </div>

        {/* G2 Permission Dialog */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <h3 className="text-sm font-bold text-gray-800 mb-1">G2 权限请求弹窗</h3>
          <p className="text-xs text-gray-400 mb-3">4种权限类型，含拒绝后引导</p>
          <div className="grid grid-cols-2 gap-2">
            {([
              { type: 'microphone' as const, label: '🎤 麦克风' },
              { type: 'camera' as const, label: '📷 相机' },
              { type: 'photos' as const, label: '🖼️ 相册' },
              { type: 'notifications' as const, label: '🔔 通知' },
            ]).map(item => (
              <button
                key={item.type}
                onClick={() => openPermission(item.type)}
                className="py-2.5 rounded-xl bg-blue/10 text-blue text-sm font-medium active:scale-95 transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* G3 Loading State */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <h3 className="text-sm font-bold text-gray-800 mb-1">G3 加载处理状态</h3>
          <p className="text-xs text-gray-400 mb-3">4种加载场景，含超时处理（15s/30s）</p>
          <div className="grid grid-cols-2 gap-2">
            {([
              { scenario: 'ai-thinking' as const, label: '🧠 AI思考' },
              { scenario: 'ocr-scanning' as const, label: '📄 OCR扫描' },
              { scenario: 'quiz-generating' as const, label: '✏️ 生成题目' },
              { scenario: 'generic' as const, label: '⏳ 通用加载' },
            ]).map(item => (
              <button
                key={item.scenario}
                onClick={() => { setLoadingScenario(item.scenario); setLoadingProgress(0) }}
                className="py-2.5 rounded-xl bg-orange/10 text-orange text-sm font-medium active:scale-95 transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>

          {loadingScenario && (
            <div className="mt-4 border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">当前场景：{loadingScenario}</span>
                <button onClick={() => setLoadingScenario(null)} className="text-xs text-error font-medium">关闭</button>
              </div>
              {/* Progress slider for demo */}
              {(loadingScenario === 'ocr-scanning' || loadingScenario === 'quiz-generating') && (
                <div className="mb-2">
                  <input
                    type="range" min={0} max={100} value={loadingProgress}
                    onChange={e => setLoadingProgress(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none bg-gray-200 accent-brand"
                  />
                </div>
              )}
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <G3LoadingState
                  visible
                  scenario={loadingScenario}
                  progress={loadingScenario === 'ocr-scanning' || loadingScenario === 'quiz-generating' ? loadingProgress : undefined}
                  progressText={loadingScenario === 'quiz-generating' ? `已生成 ${Math.floor(loadingProgress / 20)}/5 题` : undefined}
                  onRetry={() => setLoadingScenario(null)}
                  onCancel={() => setLoadingScenario(null)}
                />
              </div>
            </div>
          )}
        </div>

        {/* G4 Network Error */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <h3 className="text-sm font-bold text-gray-800 mb-1">G4 网络异常状态</h3>
          <p className="text-xs text-gray-400 mb-3">自动重试、手动重试、弱网、离线、恢复</p>
          <div className="space-y-2">
            {([
              { state: 'auto-retry' as const, label: '自动重试中' },
              { state: 'manual-retry' as const, label: '手动重试' },
              { state: 'offline' as const, label: '离线模式' },
              { state: 'weak-network' as const, label: '弱网提示 (Toast)' },
              { state: 'recovered' as const, label: '网络恢复 (Toast)' },
            ]).map(item => (
              <button
                key={item.state}
                onClick={() => setNetworkState(item.state)}
                className="w-full py-2.5 rounded-xl bg-error/10 text-error text-sm font-medium active:scale-95 transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>

          {networkState && networkState !== 'weak-network' && networkState !== 'recovered' && (
            <div className="mt-4 border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">当前：{networkState}</span>
                <button onClick={() => setNetworkState(null)} className="text-xs text-error font-medium">关闭</button>
              </div>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <G4NetworkError
                  state={networkState}
                  retryCount={2}
                  onRetry={() => setNetworkState(null)}
                  onDismiss={() => setNetworkState(null)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* G1 Voice Overlay */}
      <G1VoiceOverlay visible={showVoice} onClose={() => setShowVoice(false)} />

      {/* G2 Permission Dialog */}
      <G2PermissionDialog
        visible={showPermission}
        permissionType={permType}
        onClose={() => setShowPermission(false)}
        onGranted={() => {}}
      />

      {/* G4 Toast states */}
      {(networkState === 'weak-network' || networkState === 'recovered') && (
        <G4NetworkError
          state={networkState}
          onDismiss={() => setNetworkState(null)}
        />
      )}
    </div>
  )
}

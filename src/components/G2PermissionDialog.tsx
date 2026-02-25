import { useState } from 'react'

type PermissionType = 'microphone' | 'camera' | 'photos' | 'notifications'
type Phase = 'request' | 'denied'

interface Props {
  visible: boolean
  permissionType: PermissionType
  onClose: () => void
  onGranted?: () => void
}

const permissionConfig: Record<PermissionType, {
  icon: string
  title: string
  description: string
  deniedTitle: string
  deniedExpression: string
  unavailable: string[]
  available: string[]
}> = {
  microphone: {
    icon: '🎤',
    title: '需要使用你的麦克风',
    description: '小花老师需要听到你的声音，才能和你语音对话、解答问题哦~',
    deniedTitle: '麦克风权限未开启',
    deniedExpression: '听不到你说话...',
    unavailable: ['语音提问', '语音唤醒小花老师', '口语练习'],
    available: ['文字输入提问', '拍照上传题目'],
  },
  camera: {
    icon: '📷',
    title: '需要使用你的相机',
    description: '拍下不会的题目，小花老师帮你分析解答~',
    deniedTitle: '相机权限未开启',
    deniedExpression: '看不到题目...',
    unavailable: ['拍照识别题目', '实时扫描'],
    available: ['从相册选择图片', '文字输入提问'],
  },
  photos: {
    icon: '🖼️',
    title: '需要访问你的相册',
    description: '从相册选择题目照片发给小花老师批改~',
    deniedTitle: '相册权限未开启',
    deniedExpression: '找不到照片...',
    unavailable: ['从相册选择题目', '保存解答图片'],
    available: ['拍照上传题目', '文字输入提问'],
  },
  notifications: {
    icon: '🔔',
    title: '开启消息通知',
    description: '及时收到学习提醒、作业反馈和鼓励消息~',
    deniedTitle: '通知权限未开启',
    deniedExpression: '没法提醒你了...',
    unavailable: ['学习打卡提醒', '作业批改通知', '鼓励消息推送'],
    available: ['正常使用所有学习功能', '手动查看学习进度'],
  },
}

export default function G2PermissionDialog({ visible, permissionType, onClose, onGranted }: Props) {
  const [phase, setPhase] = useState<Phase>('request')
  const config = permissionConfig[permissionType]

  const handleAllow = () => {
    // Simulate granting permission
    onGranted?.()
    onClose()
  }

  const handleDeny = () => {
    setPhase('denied')
  }

  const handleDismiss = () => {
    setPhase('request')
    onClose()
  }

  const handleGoSettings = () => {
    // In a real app, this would open system settings
    setPhase('request')
    onClose()
  }

  if (!visible) return null

  return (
    <div className="absolute inset-0 z-[80] flex items-center justify-center">
      {/* Backdrop - not closeable */}
      <div className="absolute inset-0 bg-black/60 animate-fade-in" />

      {/* Request phase */}
      {phase === 'request' && (
        <div className="relative w-[80%] max-w-xs bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-scale-in">
          <div className="p-6 flex flex-col items-center">
            {/* Illustration area */}
            <div className="w-full h-36 bg-gradient-to-br from-brand-light to-blue-light rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
              <div className="text-6xl animate-float">{config.icon}</div>
              {/* Decorative circles */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-brand/10" />
              <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-blue/10" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">{config.title}</h3>

            {/* Description */}
            <p className="text-sm text-gray-500 text-center leading-relaxed mb-5">{config.description}</p>

            {/* Buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={handleDeny}
                className="flex-[2] py-2.5 rounded-xl text-sm text-gray-500 font-medium active:scale-95 transition-all"
              >
                暂不
              </button>
              <button
                onClick={handleAllow}
                className="flex-[3] py-2.5 rounded-xl bg-brand text-white text-sm font-semibold active:scale-95 transition-all btn-glow-brand"
              >
                好的开启
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Denied phase */}
      {phase === 'denied' && (
        <div className="relative w-[80%] max-w-xs bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-scale-in">
          <div className="p-6 flex flex-col items-center">
            {/* Sad teacher */}
            <div className="w-20 h-20 rounded-full bg-orange-light/50 flex items-center justify-center mb-2">
              <span className="text-4xl">😢</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">{config.deniedExpression}</p>

            {/* Title */}
            <h3 className="text-base font-bold text-gray-800 mb-4">{config.deniedTitle}</h3>

            {/* Unavailable features */}
            <div className="w-full mb-3">
              <p className="text-xs text-gray-500 mb-2">没有权限，以下功能将无法使用：</p>
              <div className="space-y-1.5">
                {config.unavailable.map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF4D4F" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available features */}
            <div className="w-full mb-5">
              <p className="text-xs text-gray-500 mb-2">你仍然可以使用：</p>
              <div className="space-y-1.5">
                {config.available.map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2BBB6E" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-600 font-medium active:scale-95 transition-all"
              >
                我知道了
              </button>
              <button
                onClick={handleGoSettings}
                className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold active:scale-95 transition-all"
              >
                去设置开启
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

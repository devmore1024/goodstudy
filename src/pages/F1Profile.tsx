import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMode } from '../contexts/ModeContext'
import NavigationBar from '../components/NavigationBar'
import { mockStudentProfile, mockParentProfile } from '../mock/profileData'

// 板块 A —— 管理与会员（仅家长模式显示）
const menuGroupA = [
  { id: 'family', icon: '👨‍👩‍👧‍👦', label: '家庭成员管理', route: '/family' as string | null },
  { id: 'voice', icon: '🎙', label: '声纹管理', route: '/voiceprint' as string | null, badge: false },
  { id: 'vip', icon: '👑', label: '升级会员', route: null },
]

// 板块 B —— 通用信息（学生+家长都显示）
const menuGroupB = [
  { id: 'settings', icon: '📚', label: '学习设置', route: '/settings' as string | null },
  { id: 'qa', icon: '💬', label: '个性化问答', route: null as string | null },
  { id: 'feedback', icon: '📝', label: '咨询与反馈', route: null },
  { id: 'agreement', icon: '📋', label: '协议与公告', route: null },
  { id: 'about', icon: 'ℹ️', label: '关于我们', route: '/about' as string | null },
]

export default function F1Profile() {
  const { mode, setMode, homePath } = useMode()
  const navigate = useNavigate()
  const isStudentMode = mode === 'student'
  const profile = isStudentMode ? mockStudentProfile : mockParentProfile
  const [showSwitchDialog, setShowSwitchDialog] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [toastText, setToastText] = useState('')

  const showToast = (text: string) => {
    setToastText(text)
    setTimeout(() => setToastText(''), 1500)
  }

  const handleMenuClick = (item: { id: string; route: string | null }) => {
    if (item.route) {
      // 学习设置需要传递当前模式
      if (item.id === 'settings') {
        navigate(`${item.route}?mode=${isStudentMode ? 'student' : 'parent'}`)
      } else {
        navigate(item.route)
      }
    } else {
      showToast('即将上线')
    }
  }

  const modeBg = isStudentMode ? 'bg-blue/10' : 'bg-brand/10'
  const modeText = isStudentMode ? '学生模式' : '家长模式'
  const targetMode = isStudentMode ? '家长模式' : '学生模式'

  const handleSwitchConfirm = () => {
    const newMode = isStudentMode ? 'parent' : 'student'
    setMode(newMode)
    setShowSwitchDialog(false)
  }

  const handleLogoutConfirm = () => {
    navigate('/')
  }

  return (
    <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
      <NavigationBar title="设置" onBack={() => navigate(homePath)} />
      <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10 px-5 pt-4 pb-4">
        {/* Mode indicator */}
        <div className={`${modeBg} rounded-2xl p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-base">{isStudentMode ? '🎓' : '👨‍👩‍👧'}</span>
            <span className="text-sm font-medium text-gray-700">当前为：{modeText}</span>
          </div>
          <button
            onClick={() => setShowSwitchDialog(true)}
            className="text-xs text-brand font-medium flex items-center gap-0.5"
          >
            切换到{targetMode}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        {/* User info */}
        <div className="flex items-center gap-4 mt-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue to-brand flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {profile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-800">{profile.name}</h2>
              {!isStudentMode && profile.isAdmin && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand text-white leading-none">管理员</span>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-0.5">
              {isStudentMode
                ? `${profile.grade ? `${profile.grade} · ` : ''}学生`
                : `${profile.relation ? `${profile.relation} · ` : ''}家长`
              }
            </p>
            <p className="text-sm text-gray-400">手机号 {profile.phone}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-200 my-5" />

        {/* Menu Group A - 管理与会员（仅家长模式） */}
        {!isStudentMode && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-5">
            {menuGroupA.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center justify-between px-5 py-5 active:bg-gray-50 transition-colors ${
                  idx < menuGroupA.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {'badge' in item && item.badge && <div className="w-2 h-2 rounded-full bg-error" />}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Menu Group B - 通用信息（学生+家长都显示） */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {menuGroupB.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center justify-between px-5 py-5 active:bg-gray-50 transition-colors ${
                idx < menuGroupB.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutDialog(true)}
          className="w-full mt-5 bg-white rounded-2xl py-3.5 text-center text-sm text-error font-medium shadow-sm active:bg-gray-50 transition-colors"
        >
          退出登录
        </button>
      </div>

      {/* Switch mode dialog */}
      {showSwitchDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-7 mx-6 w-full max-w-sm animate-scale-in">
            <h3 className="text-lg font-bold text-gray-800 text-center mb-4">确认切换到{targetMode}？</h3>
            <p className="text-sm text-gray-500 text-center mb-8">
              切换后将进入{targetMode === '家长模式' ? '家长' : '学生'}视角，
              {targetMode === '家长模式' ? '可查看学习报告和管理设置' : '进入学习界面'}
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowSwitchDialog(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-sm text-gray-600 font-medium active:scale-[0.97] transition-all">
                取消
              </button>
              <button onClick={handleSwitchConfirm} className="flex-1 py-3 rounded-xl bg-brand text-white text-sm font-semibold active:scale-[0.97] transition-all">
                确认切换
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastText && (
        <div className="absolute inset-x-0 top-20 z-50 flex justify-center pointer-events-none">
          <div className="bg-black/70 text-white text-sm px-5 py-2.5 rounded-full">
            {toastText}
          </div>
        </div>
      )}

      {/* Logout dialog */}
      {showLogoutDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-7 mx-6 w-full max-w-sm animate-scale-in">
            <h3 className="text-lg font-bold text-gray-800 text-center mb-4">确认退出登录？</h3>
            <p className="text-sm text-gray-500 text-center mb-8">退出后需重新验证手机号才能使用</p>
            <div className="flex gap-4">
              <button onClick={() => setShowLogoutDialog(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-sm text-gray-600 font-medium active:scale-[0.97] transition-all">
                取消
              </button>
              <button onClick={handleLogoutConfirm} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange to-orange-dark text-white text-sm font-semibold active:scale-[0.97] transition-all">
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

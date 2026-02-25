import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomTabBar from '../components/BottomTabBar'
import { mockStudentProfile } from '../mock/profileData'

const profileTabs = [
  { key: 'home', label: '首页', icon: 'home', route: '/home/student' },
  { key: 'daily', label: '每日学习', icon: 'study', route: '/daily' },
  { key: 'report', label: '学习报告', icon: 'report', route: '/report' },
  { key: 'profile', label: '我的', icon: 'profile', route: '/me' },
]

const menuItems = [
  { id: 'family', icon: '👨‍👩‍👧‍👦', label: '家庭成员管理', route: '/family' },
  { id: 'voice', icon: '🎙', label: '声纹管理', route: '/voiceprint', badge: false },
  { id: 'settings', icon: '📚', label: '学习设置', route: '/settings' },
  { id: 'about', icon: 'ℹ️', label: '关于我们', route: '/about' },
]

export default function F1Profile() {
  const navigate = useNavigate()
  const profile = mockStudentProfile
  const [isStudentMode, setIsStudentMode] = useState(true)
  const [showSwitchDialog, setShowSwitchDialog] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const modeBg = isStudentMode ? 'bg-blue/10' : 'bg-brand/10'
  const modeText = isStudentMode ? '学生模式' : '家长模式'
  const targetMode = isStudentMode ? '家长模式' : '学生模式'

  const handleSwitchConfirm = () => {
    setIsStudentMode(!isStudentMode)
    setShowSwitchDialog(false)
  }

  const handleLogoutConfirm = () => {
    navigate('/')
  }

  return (
    <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
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
            <h2 className="text-lg font-bold text-gray-800">{profile.name}</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {profile.grade ? `${profile.grade} · ` : ''}{profile.role === 'student' ? '学生' : '家长'}
            </p>
            <p className="text-sm text-gray-400">手机号 {profile.phone}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-200 my-5" />

        {/* Menu list */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {menuItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => navigate(item.route)}
              className={`w-full flex items-center justify-between px-4 py-4 active:bg-gray-50 transition-colors ${
                idx < menuItems.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && <div className="w-2 h-2 rounded-full bg-error" />}
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

      <BottomTabBar tabs={profileTabs} />

      {/* Switch mode dialog */}
      {showSwitchDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-6 mx-6 w-full max-w-sm animate-scale-in">
            <h3 className="text-lg font-bold text-gray-800 text-center mb-2">确认切换到{targetMode}？</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              切换后将进入{targetMode === '家长模式' ? '家长' : '学生'}视角，
              {targetMode === '家长模式' ? '可查看学习报告和管理设置' : '进入学习界面'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowSwitchDialog(false)} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-600 font-medium active:scale-[0.97] transition-all">
                取消
              </button>
              <button onClick={handleSwitchConfirm} className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold active:scale-[0.97] transition-all">
                确认切换
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout dialog */}
      {showLogoutDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-6 mx-6 w-full max-w-sm animate-scale-in">
            <h3 className="text-lg font-bold text-gray-800 text-center mb-2">确认退出登录？</h3>
            <p className="text-sm text-gray-500 text-center mb-6">退出后需重新验证手机号才能使用</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutDialog(false)} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-600 font-medium active:scale-[0.97] transition-all">
                取消
              </button>
              <button onClick={handleLogoutConfirm} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange to-orange-dark text-white text-sm font-semibold active:scale-[0.97] transition-all">
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import { mockFamilyMembers } from '../mock/profileData'
import type { FamilyMember } from '../mock/profileData'

function MemberCard({
  member,
  onTap,
  onDelete,
}: {
  member: FamilyMember
  onTap: () => void
  onDelete?: () => void
}) {
  const [swipeX, setSwipeX] = useState(0)
  const [startX, setStartX] = useState<number | null>(null)
  const canDelete = !member.isAdmin && onDelete

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!canDelete) return
    setStartX(e.touches[0].clientX)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX === null || !canDelete) return
    const diff = startX - e.touches[0].clientX
    setSwipeX(Math.max(0, Math.min(80, diff)))
  }
  const handleTouchEnd = () => {
    setStartX(null)
    setSwipeX(swipeX > 40 ? 80 : 0)
  }

  const avatarBg = member.role === 'parent' ? 'bg-blue' : 'bg-orange'

  return (
    <div className="relative overflow-hidden rounded-2xl mb-3">
      {/* Delete button behind */}
      {canDelete && (
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-error flex items-center justify-center rounded-r-2xl">
          <button onClick={onDelete} className="text-white text-sm font-medium">删除</button>
        </div>
      )}
      {/* Card content */}
      <div
        className="relative bg-white rounded-2xl p-4 shadow-sm transition-transform active:scale-[0.99]"
        style={{ transform: `translateX(-${swipeX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => swipeX === 0 && onTap()}
      >
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full ${avatarBg} flex items-center justify-center text-white text-lg font-bold`}>
            {member.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">{member.name}</span>
              {member.isAdmin && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue/10 text-blue font-medium">管理员</span>}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {member.role === 'parent' ? '家长' : `学生 · ${member.grade}`}
            </p>
            <p className={`text-xs mt-0.5 ${member.voiceEnrolled ? 'text-brand' : 'text-warning'}`}>
              声纹：{member.voiceEnrolled ? '已录入 ✓' : '未录入 ⚠'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MemberDetail({ member, onClose }: { member: FamilyMember; onClose: () => void }) {
  const navigate = useNavigate()
  const avatarBg = member.role === 'parent' ? 'bg-blue' : 'bg-orange'

  return (
    <>
      <div className="absolute inset-0 z-40 bg-black/40 animate-fade-in" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl animate-slide-up p-5 pb-[env(safe-area-inset-bottom)]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-16 h-16 rounded-full ${avatarBg} flex items-center justify-center text-white text-2xl font-bold`}>
            {member.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
            <p className="text-sm text-gray-400">{member.role === 'parent' ? '家长' : `学生 · ${member.grade}`}</p>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-200 my-3" />

        {/* Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">昵称</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-800">{member.name}</span>
              <button className="text-xs text-brand font-medium">编辑</button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">角色</span>
            <span className="text-sm text-gray-800">{member.role === 'parent' ? '家长' : '学生'}</span>
          </div>
          {member.grade && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">年级</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-800">{member.grade}</span>
                <button className="text-xs text-brand font-medium">编辑</button>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">声纹状态</span>
            <span className={`text-sm ${member.voiceEnrolled ? 'text-brand' : 'text-warning'}`}>
              {member.voiceEnrolled ? '已录入 ✓' : '未录入 ⚠'}
            </span>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => navigate('/voiceprint')}
          className="w-full mt-5 py-3 rounded-2xl bg-brand/10 text-sm text-brand font-semibold text-center active:scale-[0.97] transition-all"
        >
          管理声纹 →
        </button>
      </div>
    </>
  )
}

export default function F2FamilyMembers() {
  const navigate = useNavigate()
  const [members, setMembers] = useState(mockFamilyMembers)
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState<FamilyMember | null>(null)

  const parents = members.filter(m => m.role === 'parent')
  const students = members.filter(m => m.role === 'student')

  const handleDelete = () => {
    if (showDeleteDialog) {
      setMembers(prev => prev.filter(m => m.id !== showDeleteDialog.id))
      setShowDeleteDialog(null)
    }
  }

  return (
    <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
      <NavigationBar title="家庭成员管理" />

      <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10 px-5 pb-6">
        {/* Summary */}
        <div className="py-3">
          <p className="text-sm text-gray-400">家庭账户：138****1234</p>
          <p className="text-sm text-gray-400">共 {members.length} 位成员</p>
        </div>

        {/* Parents section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400 px-2">家长</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          {parents.map(m => (
            <MemberCard key={m.id} member={m} onTap={() => setSelectedMember(m)} />
          ))}
        </div>

        {/* Students section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400 px-2">学生</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          {students.map(m => (
            <MemberCard
              key={m.id}
              member={m}
              onTap={() => setSelectedMember(m)}
              onDelete={() => setShowDeleteDialog(m)}
            />
          ))}
        </div>

        {/* Add member */}
        <button
          onClick={() => navigate('/welcome')}
          className="w-full py-3.5 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 font-medium text-center active:bg-gray-50 transition-colors"
        >
          ＋ 添加家庭成员
        </button>
      </div>

      {/* Member detail sheet */}
      {selectedMember && (
        <MemberDetail member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}

      {/* Delete dialog */}
      {showDeleteDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-6 mx-6 w-full max-w-sm animate-scale-in">
            <h3 className="text-lg font-bold text-gray-800 text-center mb-2">确认删除成员"{showDeleteDialog.name}"？</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              删除后该成员的学习记录将被保留30天，之后永久删除，且声纹信息将同步清除。
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteDialog(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-600 font-medium active:scale-[0.97] transition-all">
                取消
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-error text-white text-sm font-semibold active:scale-[0.97] transition-all">
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// F-series Profile mock data

export interface FamilyMember {
  id: string
  name: string
  role: 'parent' | 'student'
  relation?: string // 称谓：爸爸、妈妈、爷爷、奶奶等
  isAdmin?: boolean
  grade?: string
  voiceEnrolled: boolean
  voiceEnrollDate?: string
  voiceQuality?: 'excellent' | 'good' | 'fair' | 'poor'
  avatar?: string
}

export const mockFamilyMembers: FamilyMember[] = [
  { id: '1', name: '张爸爸', role: 'parent', relation: '爸爸', isAdmin: true, voiceEnrolled: true, voiceEnrollDate: '2025-12-01', voiceQuality: 'excellent' },
  { id: '2', name: '张妈妈', role: 'parent', relation: '妈妈', voiceEnrolled: true, voiceEnrollDate: '2025-12-01', voiceQuality: 'excellent' },
  { id: '3', name: '张小明', role: 'student', grade: '三年级', voiceEnrolled: true, voiceEnrollDate: '2025-12-03', voiceQuality: 'good' },
  { id: '4', name: '张小红', role: 'student', grade: '一年级', voiceEnrolled: false },
]

export interface UserProfile {
  name: string
  role: 'student' | 'parent'
  relation?: string // 称谓：爸爸、妈妈等（家长模式）
  isAdmin?: boolean // 是否为管理员（家长模式）
  grade?: string
  phone: string
  avatar?: string
}

export const mockStudentProfile: UserProfile = {
  name: '张小明',
  role: 'student',
  grade: '三年级',
  phone: '138****1234',
}

export const mockParentProfile: UserProfile = {
  name: '张爸爸',
  role: 'parent',
  relation: '爸爸',
  isAdmin: true,
  phone: '138****1234',
}

export interface LearningSettings {
  reminders: { id: string; time: string; days: number[] }[]
  maxSessionMinutes: number
  breakIntervalMinutes: number
  speechRate: number
  voiceStyle: string
  eyeCareEnabled: boolean
  eyeCareReminderEnabled: boolean
}

export const mockLearningSettings: LearningSettings = {
  reminders: [
    { id: '1', time: '16:00', days: [1, 2, 3, 4, 5] },
    { id: '2', time: '19:30', days: [1, 2, 3, 4, 5, 6, 0] },
  ],
  maxSessionMinutes: 45,
  breakIntervalMinutes: 25,
  speechRate: 1.0,
  voiceStyle: 'active',
  eyeCareEnabled: true,
  eyeCareReminderEnabled: true,
}

export const voiceStyles = [
  { id: 'gentle', label: '温柔姐姐' },
  { id: 'active', label: '活力老师' },
  { id: 'brother', label: '知心哥哥' },
  { id: 'elder', label: '慈祥长辈' },
]

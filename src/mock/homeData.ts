// B1 Student Home mock data

export interface LearningTask {
  id: string
  subject: string
  title: string
  completed: boolean
  duration?: number    // minutes
  accuracy?: number    // percentage
}

export interface QuickEntry {
  id: string
  icon: string
  label: string
  route: string
  color: string
}

export const mockTasks: LearningTask[] = [
  { id: '1', subject: '语文', title: '古诗词背诵', completed: true, duration: 12, accuracy: 95 },
  { id: '2', subject: '数学', title: '分数加减法', completed: true, duration: 18, accuracy: 88 },
  { id: '3', subject: '英语', title: 'Unit3 单词', completed: false },
  { id: '4', subject: '数学', title: '应用题练习', completed: false },
  { id: '5', subject: '语文', title: '阅读理解', completed: false },
]

export const quickEntries: QuickEntry[] = [
  { id: '1', icon: 'camera', label: '拍照判题', route: '/photo-judge', color: '#FF7A45' },
  { id: '2', icon: 'chat', label: '答疑', route: '/qa', color: '#4A90D9' },
  { id: '3', icon: 'book', label: '知识点', route: '/knowledge', color: '#2BBB6E' },
  { id: '4', icon: 'test', label: '测评', route: '/test/setup', color: '#9B59B6' },
  { id: '5', icon: 'trophy', label: '成就', route: '/achievement', color: '#F5A623' },
]

// B2 Parent Home mock data

export interface ChildData {
  id: string
  name: string
  grade: string
  avatar?: string
  todayMinutes: number
  todayTarget: number
  completedTasks: number
  totalTasks: number
  subjects: SubjectScore[]
  weeklyScores: WeeklyScore[]
}

export interface SubjectScore {
  name: string
  score: number
  trend: number   // positive = up, negative = down
  weakPoint: string
}

export interface WeeklyScore {
  day: string
  scores: Record<string, number>  // subject -> score
}

export const mockChildrenData: ChildData[] = [
  {
    id: '1',
    name: '小明',
    grade: '三年级',
    todayMinutes: 45,
    todayTarget: 60,
    completedTasks: 3,
    totalTasks: 5,
    subjects: [
      { name: '语文', score: 85, trend: 3, weakPoint: '阅读理解' },
      { name: '数学', score: 78, trend: -2, weakPoint: '应用题' },
      { name: '英语', score: 92, trend: 5, weakPoint: '' },
    ],
    weeklyScores: [
      { day: '一', scores: { '语文': 82, '数学': 75, '英语': 88 } },
      { day: '二', scores: { '语文': 85, '数学': 80, '英语': 90 } },
      { day: '三', scores: { '语文': 88, '数学': 72, '英语': 85 } },
      { day: '四', scores: { '语文': 83, '数学': 85, '英语': 92 } },
      { day: '五', scores: { '语文': 86, '数学': 78, '英语': 90 } },
      { day: '六', scores: { '语文': 90, '数学': 82, '英语': 95 } },
      { day: '日', scores: { '语文': 85, '数学': 76, '英语': 88 } },
    ],
  },
  {
    id: '2',
    name: '小红',
    grade: '一年级',
    todayMinutes: 30,
    todayTarget: 45,
    completedTasks: 4,
    totalTasks: 4,
    subjects: [
      { name: '语文', score: 90, trend: 2, weakPoint: '笔画顺序' },
      { name: '数学', score: 95, trend: 1, weakPoint: '' },
      { name: '英语', score: 88, trend: 4, weakPoint: '字母发音' },
    ],
    weeklyScores: [
      { day: '一', scores: { '语文': 88, '数学': 92, '英语': 85 } },
      { day: '二', scores: { '语文': 90, '数学': 94, '英语': 86 } },
      { day: '三', scores: { '语文': 85, '数学': 90, '英语': 88 } },
      { day: '四', scores: { '语文': 92, '数学': 96, '英语': 90 } },
      { day: '五', scores: { '语文': 90, '数学': 95, '英语': 88 } },
      { day: '六', scores: { '语文': 88, '数学': 93, '英语': 92 } },
      { day: '日', scores: { '语文': 90, '数学': 95, '英语': 88 } },
    ],
  },
]

export const aiWeeklyReport = '小明本周数学有明显进步，分数运算正确率提升了15%，建议继续巩固应用题练习。语文古诗词背诵表现稳定，英语听力部分有较大提升空间。'

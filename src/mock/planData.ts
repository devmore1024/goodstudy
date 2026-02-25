// C-series mock data

// C1 - Learning Plan Creation
export interface DiagnosisResult {
  subject: string
  hasExam: boolean
  score?: number
  fullScore?: number
  weakPoints?: string[]
  aiSuggestion?: string
}

export const diagnosisResults: DiagnosisResult[] = [
  {
    subject: '数学',
    hasExam: true,
    score: 85,
    fullScore: 100,
    weakPoints: ['应用题', '几何'],
    aiSuggestion: '重点加强应用题训练，几何部分需巩固基础概念',
  },
  { subject: '语文', hasExam: false },
  { subject: '英语', hasExam: false },
]

export const subjectDirections: Record<string, string[]> = {
  '语文': ['阅读理解', '作文写作', '古诗文', '基础字词', '我不确定'],
  '数学': ['计算能力', '应用题', '几何图形', '概念理解', '我不确定'],
  '英语': ['单词记忆', '阅读理解', '听力', '语法', '我不确定'],
}

export const defaultWeeklySlots: boolean[][] = (() => {
  // 7 days x 14 hours (8:00-21:00), true = recommended
  const grid = Array(7).fill(null).map(() => Array(14).fill(false))
  // Mon 10-11, 18-19
  grid[0][2] = true; grid[0][3] = true; grid[0][10] = true; grid[0][11] = true
  // Tue 16-17
  grid[1][8] = true; grid[1][9] = true
  // Wed 10-11, 16-17, 18-19
  grid[2][2] = true; grid[2][3] = true; grid[2][8] = true; grid[2][9] = true; grid[2][10] = true
  // Thu 16-17
  grid[3][8] = true; grid[3][9] = true
  // Sat 8-11, 19-20
  grid[5][0] = true; grid[5][1] = true; grid[5][2] = true; grid[5][3] = true; grid[5][11] = true
  // Sun 8-9
  grid[6][0] = true; grid[6][1] = true
  return grid
})()

export const testFrequencyOptions = [
  { value: 'weekly', label: '每周', recommended: false },
  { value: 'biweekly', label: '每两周', recommended: true },
  { value: 'monthly', label: '每月', recommended: false },
]

// C2 - Plan Overview
export interface PlanBlock {
  id: string
  day: number        // 0=Mon ... 6=Sun
  startHour: number  // 8-20
  duration: number   // hours (can be 0.5, 1, 1.5, 2)
  subject: string
  topic: string
  completed: boolean
  isTest?: boolean
}

export const weekPlanBlocks: PlanBlock[] = [
  { id: 'p1', day: 0, startHour: 10, duration: 1.5, subject: '数学', topic: '分数运算', completed: true },
  { id: 'p2', day: 0, startHour: 18, duration: 1, subject: '语文', topic: '古诗词', completed: true },
  { id: 'p3', day: 1, startHour: 16, duration: 1.5, subject: '英语', topic: '阅读理解', completed: true },
  { id: 'p4', day: 2, startHour: 10, duration: 1.5, subject: '数学', topic: '应用题', completed: false },
  { id: 'p5', day: 2, startHour: 16, duration: 1, subject: '英语', topic: '单词记忆', completed: false },
  { id: 'p6', day: 2, startHour: 18, duration: 1, subject: '语文', topic: '阅读理解', completed: false },
  { id: 'p7', day: 3, startHour: 16, duration: 1.5, subject: '数学', topic: '几何', completed: false },
  { id: 'p8', day: 3, startHour: 18, duration: 1, subject: '物理', topic: '力学基础', completed: false },
  { id: 'p9', day: 4, startHour: 19, duration: 1, subject: '数学', topic: '周测', completed: false, isTest: true },
  { id: 'p10', day: 5, startHour: 9, duration: 2, subject: '数学', topic: '综合练习', completed: false },
  { id: 'p11', day: 5, startHour: 14, duration: 1.5, subject: '英语', topic: '听力训练', completed: false },
  { id: 'p12', day: 6, startHour: 9, duration: 1.5, subject: '语文', topic: '作文', completed: false },
]

// C2a - Daily Plan Detail
export interface DailyTask {
  id: string
  subject: string
  topic: string
  startTime: string
  endTime: string
  status: 'completed' | 'current' | 'pending' | 'skipped'
  actualMinutes?: number
  contents?: string[]
  aiTip?: string
}

export const todayTasks: DailyTask[] = [
  {
    id: 'd1', subject: '数学', topic: '分数运算',
    startTime: '10:00', endTime: '11:00',
    status: 'completed', actualMinutes: 25,
    contents: ['分数加减法复习', '通分练习 x10', '分数应用题 x5'],
  },
  {
    id: 'd2', subject: '英语', topic: '阅读理解',
    startTime: '16:00', endTime: '17:00',
    status: 'current',
    contents: ['Unit 5 阅读训练', '完形填空专项 x3', '生词记忆 15个'],
    aiTip: '今天的阅读难度适中，注意理解上下文哦！',
  },
  {
    id: 'd3', subject: '英语', topic: '单词记忆',
    startTime: '17:00', endTime: '17:30',
    status: 'completed', actualMinutes: 22,
    contents: ['Unit 5 核心词汇 20个', '听写自测'],
  },
  {
    id: 'd4', subject: '语文', topic: '古诗词',
    startTime: '18:00', endTime: '19:00',
    status: 'pending',
    contents: ['《春望》赏析', '默写练习 x3', '诗词鉴赏方法归纳'],
    aiTip: '杜甫的诗要注意感情色彩，试着体会他的忧国忧民之情~',
  },
  {
    id: 'd5', subject: '物理', topic: '力学基础',
    startTime: '19:00', endTime: '19:45',
    status: 'pending',
    contents: ['牛顿第三定律', '课后习题 x8'],
  },
]

// C3 - Assessment Settings
export interface SubjectOption {
  name: string
  lastScore: number | null
  color: string
  icon: string
}

export const assessmentSubjects: SubjectOption[] = [
  { name: '数学', lastScore: 85, color: '#4A90D9', icon: '📐' },
  { name: '英语', lastScore: 72, color: '#2BBB6E', icon: '📚' },
  { name: '语文', lastScore: 78, color: '#FF7A45', icon: '📝' },
  { name: '物理', lastScore: 90, color: '#9B59B6', icon: '⚡' },
  { name: '化学', lastScore: null, color: '#E74C3C', icon: '🧪' },
  { name: '生物', lastScore: 88, color: '#27AE60', icon: '🌿' },
]

export const difficultyOptions = [
  { value: 'basic', label: '基础', recommended: false },
  { value: 'advanced', label: '进阶', recommended: true },
  { value: 'challenge', label: '挑战', recommended: false },
]

export const questionCountOptions = [10, 15, 20, 30]

export const scoreHistory = [
  { date: '1月w1', score: 62 },
  { date: '1月w3', score: 75 },
  { date: '1月w5', score: 78 },
  { date: '2月w1', score: 80 },
  { date: '2月w3', score: 85 },
]

// C4 - Assessment In Progress
export interface QuizQuestion {
  id: number
  subject: string
  type: '单选题' | '多选题' | '填空题'
  content: string
  options?: string[]
  correctAnswer: string
}

export const quizQuestions: QuizQuestion[] = [
  { id: 1, subject: '数学', type: '单选题', content: '计算 3/4 + 5/8 的结果是？', options: ['A. 1 1/8', 'B. 1 3/8', 'C. 1 1/4', 'D. 1 5/8'], correctAnswer: 'B' },
  { id: 2, subject: '数学', type: '单选题', content: '一个长方形长8cm，宽5cm，周长是多少？', options: ['A. 13cm', 'B. 26cm', 'C. 40cm', 'D. 30cm'], correctAnswer: 'B' },
  { id: 3, subject: '数学', type: '单选题', content: '下列哪个分数与 2/3 相等？', options: ['A. 4/6', 'B. 3/4', 'C. 4/5', 'D. 5/6'], correctAnswer: 'A' },
  { id: 4, subject: '数学', type: '单选题', content: '如果 x + 7 = 15，那么 x 等于？', options: ['A. 6', 'B. 7', 'C. 8', 'D. 9'], correctAnswer: 'C' },
  { id: 5, subject: '数学', type: '单选题', content: '三角形三条边长分别为3、4、5，这是一个什么三角形？', options: ['A. 等边三角形', 'B. 等腰三角形', 'C. 直角三角形', 'D. 钝角三角形'], correctAnswer: 'C' },
  { id: 6, subject: '数学', type: '单选题', content: '把 0.75 化成分数是？', options: ['A. 3/5', 'B. 3/4', 'C. 7/5', 'D. 4/3'], correctAnswer: 'B' },
  { id: 7, subject: '数学', type: '单选题', content: '已知函数 f(x) = 2x² + 3x - 1，求 f(2) 的值是多少？', options: ['A. 11', 'B. 13', 'C. 15', 'D. 17'], correctAnswer: 'B' },
  { id: 8, subject: '数学', type: '单选题', content: '一个圆的半径是7cm，面积约是多少？（π取3.14）', options: ['A. 43.96cm²', 'B. 153.86cm²', 'C. 87.92cm²', 'D. 21.98cm²'], correctAnswer: 'B' },
  { id: 9, subject: '数学', type: '单选题', content: '100以内所有偶数的和是多少？', options: ['A. 2450', 'B. 2500', 'C. 2550', 'D. 5050'], correctAnswer: 'C' },
  { id: 10, subject: '数学', type: '单选题', content: '小明有15颗糖，分给3个朋友，每人分得几颗？', options: ['A. 3', 'B. 4', 'C. 5', 'D. 6'], correctAnswer: 'C' },
  { id: 11, subject: '数学', type: '单选题', content: '在数轴上，-3 在 2 的哪一侧？', options: ['A. 左侧', 'B. 右侧', 'C. 同一位置', 'D. 无法确定'], correctAnswer: 'A' },
  { id: 12, subject: '数学', type: '单选题', content: '一件商品打八折后卖160元，原价是多少？', options: ['A. 180元', 'B. 190元', 'C. 200元', 'D. 210元'], correctAnswer: 'C' },
  { id: 13, subject: '数学', type: '单选题', content: '平行四边形的对角线互相？', options: ['A. 相等', 'B. 垂直', 'C. 平分', 'D. 垂直且相等'], correctAnswer: 'C' },
  { id: 14, subject: '数学', type: '单选题', content: '下列哪组数据的平均数是8？', options: ['A. 6,8,10', 'B. 5,8,12', 'C. 4,8,10', 'D. 6,8,12'], correctAnswer: 'A' },
  { id: 15, subject: '数学', type: '单选题', content: '一个正方体的棱长是3cm，表面积是多少？', options: ['A. 27cm²', 'B. 36cm²', 'C. 45cm²', 'D. 54cm²'], correctAnswer: 'D' },
]

// C5 - Assessment Results
export interface TestResult {
  subject: string
  difficulty: string
  totalScore: number
  maxScore: number
  correctCount: number
  wrongCount: number
  totalQuestions: number
  timeUsed: number     // minutes
  timeLimit: number    // minutes
  percentile: number   // beat XX% of students
  lastScore: number | null
  radarData: { label: string; value: number }[]
  wrongQuestions: WrongQuestion[]
}

export interface WrongQuestion {
  id: number
  content: string
  yourAnswer: string
  correctAnswer: string
  explanation: string
  knowledgePoint: string
}

export const mockTestResult: TestResult = {
  subject: '数学',
  difficulty: '进阶',
  totalScore: 85,
  maxScore: 100,
  correctCount: 13,
  wrongCount: 2,
  totalQuestions: 15,
  timeUsed: 22,
  timeLimit: 30,
  percentile: 78,
  lastScore: 80,
  radarData: [
    { label: '计算', value: 92 },
    { label: '推理', value: 78 },
    { label: '应用', value: 70 },
    { label: '几何', value: 85 },
    { label: '代数', value: 88 },
    { label: '统计', value: 80 },
  ],
  wrongQuestions: [
    {
      id: 5,
      content: '已知三角形ABC中，AB=5, BC=4, AC=6，求三角形面积。',
      yourAnswer: 'B. 12',
      correctAnswer: 'C. 9.92',
      explanation: '这道题需要用海伦公式。先求半周长 s=(5+4+6)/2=7.5，然后面积=√(s(s-a)(s-b)(s-c))=√(7.5×2.5×3.5×1.5)≈9.92',
      knowledgePoint: '海伦公式',
    },
    {
      id: 12,
      content: '一件商品打八折后卖160元，原价是多少？',
      yourAnswer: 'A. 180元',
      correctAnswer: 'C. 200元',
      explanation: '打八折即原价×0.8=160，所以原价=160÷0.8=200元。注意不要用加法思维，折扣是乘法关系！',
      knowledgePoint: '折扣计算',
    },
  ],
}

// E-series Report mock data

export interface DailyActivity {
  id: number
  time: string
  subject: string
  activity: string
  questions: number
  accuracy: number
  weakPoint?: string
}

export interface DailyReport {
  date: string
  weekDay: string
  totalMinutes: number
  totalQuestions: number
  accuracy: number
  subjectDistribution: { name: string; percent: number; color: string }[]
  timeline: DailyActivity[]
  aiComment: string
}

export const mockDailyReport: DailyReport = {
  date: '2026年2月25日',
  weekDay: '星期三',
  totalMinutes: 45,
  totalQuestions: 38,
  accuracy: 86,
  subjectDistribution: [
    { name: '数学', percent: 40, color: '#4A90D9' },
    { name: '语文', percent: 30, color: '#FF7A45' },
    { name: '英语', percent: 20, color: '#2BBB6E' },
    { name: '物理', percent: 10, color: '#9B59B6' },
  ],
  timeline: [
    { id: 1, time: '08:30', subject: '数学', activity: '每日练习', questions: 20, accuracy: 90 },
    { id: 2, time: '10:15', subject: '语文', activity: '古诗词背诵', questions: 3, accuracy: 100 },
    { id: 3, time: '14:00', subject: '英语', activity: '阅读理解', questions: 2, accuracy: 75, weakPoint: '定语从句' },
    { id: 4, time: '16:30', subject: '数学', activity: '错题回顾', questions: 8, accuracy: 75 },
    { id: 5, time: '19:00', subject: '物理', activity: '力学专项', questions: 5, accuracy: 80 },
  ],
  aiComment: '今天学习非常用功！数学练习正确率有明显提升，古诗词背诵全部正确，继续保持哦～英语阅读理解的定语从句部分需要多加练习，建议明天安排一次专项训练。物理力学的掌握度也在稳步提升！',
}

// E2 Weekly report
export interface WeeklyReport {
  weekLabel: string
  dateRange: string
  totalHours: string
  totalQuestions: number
  avgAccuracy: number
  lastWeekHours: string
  lastWeekQuestions: number
  lastWeekAccuracy: number
  dailyMinutes: { day: string; minutes: number }[]
  accuracyTrend: { day: string; thisWeek: number; lastWeek: number }[]
  weakPoints: { rank: number; name: string; accuracy: number; wrongCount: number; mastery: number }[]
  comparison: { label: string; value: string; change: string; up: boolean }[]
  aiSummary: string
}

export const mockWeeklyReport: WeeklyReport = {
  weekLabel: '第8周',
  dateRange: '2/16 - 2/22',
  totalHours: '5h 20min',
  totalQuestions: 186,
  avgAccuracy: 84,
  lastWeekHours: '4h 50min',
  lastWeekQuestions: 164,
  lastWeekAccuracy: 81,
  dailyMinutes: [
    { day: '一', minutes: 50 },
    { day: '二', minutes: 45 },
    { day: '三', minutes: 60 },
    { day: '四', minutes: 40 },
    { day: '五', minutes: 35 },
    { day: '六', minutes: 55 },
    { day: '日', minutes: 35 },
  ],
  accuracyTrend: [
    { day: '一', thisWeek: 88, lastWeek: 82 },
    { day: '二', thisWeek: 85, lastWeek: 80 },
    { day: '三', thisWeek: 78, lastWeek: 75 },
    { day: '四', thisWeek: 82, lastWeek: 78 },
    { day: '五', thisWeek: 90, lastWeek: 85 },
    { day: '六', thisWeek: 86, lastWeek: 82 },
    { day: '日', thisWeek: 80, lastWeek: 76 },
  ],
  weakPoints: [
    { rank: 1, name: '二次函数求极值', accuracy: 45, wrongCount: 5, mastery: 38 },
    { rank: 2, name: '文言文虚词辨析', accuracy: 50, wrongCount: 4, mastery: 52 },
    { rank: 3, name: '定语从句关系词', accuracy: 55, wrongCount: 3, mastery: 58 },
    { rank: 4, name: '牛顿第二定律应用', accuracy: 58, wrongCount: 3, mastery: 60 },
    { rank: 5, name: '化学方程式配平', accuracy: 60, wrongCount: 2, mastery: 65 },
  ],
  comparison: [
    { label: '学习时长', value: '5h20m', change: '+30m', up: true },
    { label: '答题总数', value: '186题', change: '+22题', up: true },
    { label: '平均正确率', value: '84%', change: '+3%', up: true },
    { label: '活跃天数', value: '7天', change: '+1天', up: true },
    { label: '薄弱知识点', value: '5个', change: '-2个', up: true },
  ],
  aiSummary: '这一周你的学习非常稳定！数学方面进步明显，二次函数的正确率从上周32%提升到了45%，继续加油！\n\n建议下周重点关注：\n1. 二次函数求极值\n2. 文言文虚词辨析\n3. 定语从句关系词',
}

// E3 Monthly report
export interface MonthlyReport {
  month: string
  totalHours: string
  avgAccuracy: number
  totalQuestions: number
  lastMonthHours: string
  lastMonthAccuracy: number
  lastMonthQuestions: number
  rankTrend: { month: string; percentile: number }[]
  subjectMastery: {
    name: string
    mastery: number
    points: { name: string; mastery: number }[]
  }[]
  aiEvaluation: string
}

export const mockMonthlyReport: MonthlyReport = {
  month: '2026年2月',
  totalHours: '22h 30m',
  avgAccuracy: 84,
  totalQuestions: 742,
  lastMonthHours: '20h 10m',
  lastMonthAccuracy: 80,
  lastMonthQuestions: 680,
  rankTrend: [
    { month: '9月', percentile: 52 },
    { month: '10月', percentile: 60 },
    { month: '11月', percentile: 68 },
    { month: '12月', percentile: 75 },
    { month: '1月', percentile: 82 },
    { month: '2月', percentile: 90 },
  ],
  subjectMastery: [
    {
      name: '数学',
      mastery: 75,
      points: [
        { name: '一次函数', mastery: 92 },
        { name: '几何证明', mastery: 88 },
        { name: '二次函数', mastery: 45 },
        { name: '概率统计', mastery: 52 },
      ],
    },
    {
      name: '语文',
      mastery: 82,
      points: [
        { name: '阅读理解', mastery: 85 },
        { name: '古诗词鉴赏', mastery: 90 },
        { name: '文言文翻译', mastery: 78 },
        { name: '作文立意', mastery: 72 },
      ],
    },
    {
      name: '英语',
      mastery: 90,
      points: [
        { name: '阅读理解', mastery: 92 },
        { name: '完形填空', mastery: 88 },
        { name: '听力', mastery: 95 },
        { name: '写作', mastery: 82 },
      ],
    },
    {
      name: '物理',
      mastery: 55,
      points: [
        { name: '力学', mastery: 48 },
        { name: '光学', mastery: 65 },
        { name: '电学', mastery: 52 },
      ],
    },
  ],
  aiEvaluation: '2月份的学习表现整体优秀！排名百分位从82%提升到90%，进步非常明显。\n\n亮点：\n· 英语阅读理解突飞猛进\n· 每天坚持学习，无缺席\n· 数学几何证明掌握扎实\n\n待改进：\n· 物理力学模块需重点关注\n· 数学概率统计偏弱\n· 语文作文立意需要拓展思路',
}

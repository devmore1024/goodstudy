// D1 知识课堂 mock data

export interface KnowledgePoint {
  id: string
  name: string
  mastery: number       // 0-100
  lastStudied?: string  // e.g. "2天前" or undefined for 未学习
}

export interface Chapter {
  id: string
  title: string
  points: KnowledgePoint[]
}

export interface SubjectKnowledge {
  subject: string
  icon: string          // emoji
  chapters: Chapter[]
}

export const knowledgeData: SubjectKnowledge[] = [
  {
    subject: '数学',
    icon: '📘',
    chapters: [
      {
        id: 'math-1',
        title: '第一章 · 分数的意义和性质',
        points: [
          { id: 'm1', name: '分数的意义', mastery: 80, lastStudied: '2天前' },
          { id: 'm2', name: '真分数和假分数', mastery: 60, lastStudied: '3天前' },
          { id: 'm3', name: '分数的基本性质', mastery: 100, lastStudied: '1天前' },
          { id: 'm4', name: '分数大小比较', mastery: 55, lastStudied: '5天前' },
        ],
      },
      {
        id: 'math-2',
        title: '第二章 · 分数加减法',
        points: [
          { id: 'm5', name: '同分母加减法', mastery: 70, lastStudied: '昨天' },
          { id: 'm6', name: '异分母加减法', mastery: 45, lastStudied: '4天前' },
          { id: 'm7', name: '分数加减混合运算', mastery: 30, lastStudied: '1周前' },
          { id: 'm8', name: '分数加减法应用题', mastery: 0 },
        ],
      },
      {
        id: 'math-3',
        title: '第三章 · 分数乘除法',
        points: [
          { id: 'm9', name: '分数乘法', mastery: 35, lastStudied: '1周前' },
          { id: 'm10', name: '分数除法', mastery: 0 },
          { id: 'm11', name: '分数乘除混合运算', mastery: 0 },
          { id: 'm12', name: '分数乘除法应用题', mastery: 0 },
        ],
      },
      {
        id: 'math-4',
        title: '第四章 · 小数与分数',
        points: [
          { id: 'm13', name: '小数化分数', mastery: 90, lastStudied: '3天前' },
          { id: 'm14', name: '分数化小数', mastery: 85, lastStudied: '3天前' },
          { id: 'm15', name: '小数分数混合运算', mastery: 40, lastStudied: '6天前' },
          { id: 'm16', name: '比较大小综合', mastery: 20 },
        ],
      },
    ],
  },
  {
    subject: '语文',
    icon: '📕',
    chapters: [
      {
        id: 'cn-1',
        title: '第一单元 · 古诗词',
        points: [
          { id: 'c1', name: '春望', mastery: 100, lastStudied: '今天' },
          { id: 'c2', name: '望岳', mastery: 65, lastStudied: '3天前' },
          { id: 'c3', name: '静夜思', mastery: 75, lastStudied: '1周前' },
          { id: 'c4', name: '登鹳雀楼', mastery: 0 },
        ],
      },
      {
        id: 'cn-2',
        title: '第二单元 · 阅读理解',
        points: [
          { id: 'c5', name: '记叙文阅读', mastery: 70, lastStudied: '5天前' },
          { id: 'c6', name: '说明文阅读', mastery: 0 },
          { id: 'c7', name: '议论文阅读', mastery: 0 },
          { id: 'c8', name: '文言文入门', mastery: 25, lastStudied: '2周前' },
        ],
      },
      {
        id: 'cn-3',
        title: '第三单元 · 写作基础',
        points: [
          { id: 'c9', name: '写人作文', mastery: 80, lastStudied: '4天前' },
          { id: 'c10', name: '写景作文', mastery: 50, lastStudied: '1周前' },
          { id: 'c11', name: '叙事作文', mastery: 35, lastStudied: '2周前' },
          { id: 'c12', name: '读后感写作', mastery: 0 },
        ],
      },
    ],
  },
  {
    subject: '英语',
    icon: '📗',
    chapters: [
      {
        id: 'en-1',
        title: 'Unit 1 · Greetings & Introduction',
        points: [
          { id: 'e1', name: 'Hello & Goodbye', mastery: 100, lastStudied: '1天前' },
          { id: 'e2', name: 'Self Introduction', mastery: 90, lastStudied: '2天前' },
          { id: 'e3', name: 'Numbers 1-100', mastery: 85, lastStudied: '3天前' },
          { id: 'e4', name: 'Colors & Shapes', mastery: 70, lastStudied: '4天前' },
        ],
      },
      {
        id: 'en-2',
        title: 'Unit 2 · Daily Life',
        points: [
          { id: 'e5', name: 'Family Members', mastery: 60, lastStudied: '5天前' },
          { id: 'e6', name: 'Food & Drinks', mastery: 45, lastStudied: '1周前' },
          { id: 'e7', name: 'Days & Months', mastery: 30 },
          { id: 'e8', name: 'Weather', mastery: 0 },
        ],
      },
      {
        id: 'en-3',
        title: 'Unit 3 · Simple Sentences',
        points: [
          { id: 'e9', name: 'I am / You are', mastery: 95, lastStudied: '2天前' },
          { id: 'e10', name: 'What is this?', mastery: 80, lastStudied: '4天前' },
          { id: 'e11', name: 'Do you like...?', mastery: 55, lastStudied: '1周前' },
          { id: 'e12', name: 'Can you...?', mastery: 0 },
        ],
      },
    ],
  },
]

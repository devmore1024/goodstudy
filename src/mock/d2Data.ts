export interface D2Question {
  id: number
  content: string
  correctAnswer: string
  userAnswer: string
  isCorrect: boolean
  explanation?: {
    steps: string[]
    knowledgePoint: string
  }
}

export const mockD2Questions: D2Question[] = [
  {
    id: 1,
    content: '3/4 + 1/2 =',
    correctAnswer: '5/4',
    userAnswer: '5/4',
    isCorrect: true,
  },
  {
    id: 2,
    content: '5 × 3 - 7 =',
    correctAnswer: '8',
    userAnswer: '8',
    isCorrect: true,
  },
  {
    id: 3,
    content: '12 ÷ 4 + 2 =',
    correctAnswer: '5',
    userAnswer: '4',
    isCorrect: false,
    explanation: {
      steps: [
        '先算除法：12 ÷ 4 = 3',
        '再算加法：3 + 2 = 5',
      ],
      knowledgePoint: '四则运算优先级',
    },
  },
  {
    id: 4,
    content: '8 - 3/5 =',
    correctAnswer: '37/5',
    userAnswer: '37/5',
    isCorrect: true,
  },
]

export const mockTeacherReplies: Record<string, string> = {
  '第1题': '第1题 3/4 + 1/2，需要先通分哦！1/2 = 2/4，所以 3/4 + 2/4 = 5/4，你答对啦～',
  '第2题': '第2题 5 × 3 - 7，先算乘法 5×3=15，再算减法 15-7=8，没问题！',
  '第3题': '第3题 12 ÷ 4 + 2，这道题要注意运算优先级哦！先算除法：12÷4=3，再算加法：3+2=5。你写的4，是不是把加法先算了呀？记住：先乘除，后加减～',
  '第4题': '第4题 8 - 3/5，先把8化成分数 8=40/5，然后 40/5 - 3/5 = 37/5，你做得很棒！',
  '运算优先级': '四则运算的优先级口诀：先乘除，后加减，有括号的先算括号里的。遇到同级运算（比如只有加减或只有乘除），就从左到右依次算～',
  '通分': '通分就是把不同分母的分数变成相同分母。方法是找两个分母的最小公倍数作为新分母，然后分子分母同时乘以相应的数。比如 1/2 通分成 2/4，分子分母都乘了2。',
  '分数': '分数运算的关键是通分！加减法要先通分再计算，乘法直接分子乘分子、分母乘分母，除法变成乘倒数。有什么具体的题目不明白吗？',
  default: '嗯嗯，我来看看这道题～你可以告诉我具体是第几题，比如说"第3题"，我来给你详细讲解哦！',
}

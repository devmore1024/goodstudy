/* ─── D3 实时答疑 mock 数据 ─── */

export interface QAMessage {
  id: number
  role: 'ai' | 'user'
  content: string
}

export interface QASession {
  id: string
  date: string
  subject: string
  topic: string        // 简短话题摘要
  messageCount: number
  messages: QAMessage[]
}

export const mockQASessions: QASession[] = [
  {
    id: 'qa-1',
    date: '2026-02-26 14:30',
    subject: '数学',
    topic: '行程问题应用题讲解',
    messageCount: 6,
    messages: [
      { id: 1, role: 'ai', content: '你好呀！有什么不明白的题目吗？可以拍照或者打字告诉我~' },
      { id: 2, role: 'user', content: '老师，这道应用题不会做：小明从家到学校，步行速度是60米/分钟，用了15分钟。请问家到学校有多远？' },
      { id: 3, role: 'ai', content: '我看看~这是一道行程问题呢。你先想想看，题目里提到了哪些已知条件？' },
      { id: 4, role: 'user', content: '速度是60米每分钟，时间是15分钟' },
      { id: 5, role: 'ai', content: '太棒了！你找到了关键条件。那你知道路程、速度和时间的关系吗？用公式表示就是：路程 = 速度 × 时间，所以 S = 60 × 15 = 900米。' },
      { id: 6, role: 'user', content: '明白了，谢谢老师！' },
    ],
  },
  {
    id: 'qa-2',
    date: '2026-02-25 20:15',
    subject: '数学',
    topic: '分数通分方法',
    messageCount: 8,
    messages: [
      { id: 1, role: 'ai', content: '你好呀！有什么不明白的题目吗？可以拍照或者打字告诉我~' },
      { id: 2, role: 'user', content: '老师，通分怎么做？我总是搞不清楚' },
      { id: 3, role: 'ai', content: '通分就是把不同分母的分数变成相同分母，这样才方便加减。关键是找两个分母的最小公倍数。比如 1/3 和 1/4，分母是3和4，最小公倍数是多少？' },
      { id: 4, role: 'user', content: '12？' },
      { id: 5, role: 'ai', content: '对！最小公倍数是12。那 1/3 变成几分之几呢？' },
      { id: 6, role: 'user', content: '4/12' },
      { id: 7, role: 'ai', content: '完全正确！1/3 = 4/12，1/4 = 3/12。这样就可以相加了：4/12 + 3/12 = 7/12。你学会了！' },
      { id: 8, role: 'user', content: '原来这么简单，谢谢！' },
    ],
  },
  {
    id: 'qa-3',
    date: '2026-02-24 19:00',
    subject: '语文',
    topic: '古诗词"静夜思"赏析',
    messageCount: 6,
    messages: [
      { id: 1, role: 'ai', content: '你好呀！有什么不明白的题目吗？可以拍照或者打字告诉我~' },
      { id: 2, role: 'user', content: '老师，静夜思这首诗的意思是什么？' },
      { id: 3, role: 'ai', content: '《静夜思》是李白写的一首很有名的诗。"床前明月光，疑是地上霜"——月光照在床前，诗人以为是地上的霜。你觉得这两句在写什么感受？' },
      { id: 4, role: 'user', content: '感觉好像很冷、很安静？' },
      { id: 5, role: 'ai', content: '感觉很对！"举头望明月，低头思故乡"——抬头看月亮，低下头就想起了自己的家乡。整首诗写的是诗人独自在外，看到月光想家的思念之情。' },
      { id: 6, role: 'user', content: '哦，原来是思乡的诗！我懂了' },
    ],
  },
  {
    id: 'qa-4',
    date: '2026-02-23 18:30',
    subject: '英语',
    topic: 'Unit3 单词记忆方法',
    messageCount: 4,
    messages: [
      { id: 1, role: 'ai', content: '你好呀！有什么不明白的题目吗？可以拍照或者打字告诉我~' },
      { id: 2, role: 'user', content: '老师，apple这个单词怎么记？' },
      { id: 3, role: 'ai', content: '可以用联想记忆法！apple = a + pp + le。想象一个人（a）拍拍（pp）了一下（le）苹果。或者记住：一个（a）苹果（apple）被拍（pp）了一下就乐（le）了。多读几遍：apple, apple, apple~ 🍎' },
      { id: 4, role: 'user', content: '哈哈好有趣，我记住了！' },
    ],
  },
  {
    id: 'qa-5',
    date: '2026-02-22 17:45',
    subject: '数学',
    topic: '四则运算优先级',
    messageCount: 6,
    messages: [
      { id: 1, role: 'ai', content: '你好呀！有什么不明白的题目吗？可以拍照或者打字告诉我~' },
      { id: 2, role: 'user', content: '老师，3 + 5 × 2 为什么等于13不是16？' },
      { id: 3, role: 'ai', content: '好问题！这是因为运算有优先级。口诀是：先乘除，后加减。所以要先算 5 × 2 = 10，再算 3 + 10 = 13。' },
      { id: 4, role: 'user', content: '那如果我想先算加法呢？' },
      { id: 5, role: 'ai', content: '那就要加括号！(3 + 5) × 2 = 8 × 2 = 16。括号里的最优先计算哦。记住口诀：先括号，再乘除，后加减～' },
      { id: 6, role: 'user', content: '明白了！先括号再乘除后加减' },
    ],
  },
]

/* ─── 小花老师 mock 回复（D3用） ─── */

export const mockD3TeacherReplies: Record<string, string> = {
  '应用题': '应用题的关键是找出已知条件和要求的问题，然后选择正确的公式。你可以把题目里的条件一个个列出来，我来帮你分析~',
  '不会': '没关系，不会的题我来教你！你可以把题目发给我，或者拍照给我看~',
  '怎么做': '你先把题目告诉我，我来一步一步引导你解题，这样你能真正理解哦~',
  '谢谢': '不客气！学习中有任何不懂的随时找我哦～加油！💪',
  '不明白': '哪里不明白呢？你可以具体说说，或者把题目发过来，我来帮你分析~',
  default: '嗯嗯，你说的我明白了。你可以把具体的题目发给我，我来帮你一步一步讲解哦~',
}

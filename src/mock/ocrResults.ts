import type { QuestionResult } from '../types'

export const mockOcrResults: QuestionResult[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  content: [
    '计算 (3x + 2)(x - 1) 的展开式',
    '解方程 2x² - 5x + 3 = 0',
    '化简 √48 + √27 - √12',
    '已知三角形ABC中，AB=5，BC=7，AC=8，求面积',
    '求函数 f(x) = x² - 4x + 3 的最小值',
    '某商品打八折后售价为240元，求原价',
    '计算 (-2)³ + |−5| × 2',
    '已知 a:b = 3:5，且 a + b = 40，求 a 和 b',
    '解不等式 3x - 7 > 2x + 1',
    '求圆的面积，已知直径为10cm',
    '计算 (a + b)² - (a - b)²',
    '某班有45人，男女比为5:4，求男女各几人',
    '已知正方形边长为6，求对角线长度',
    '化简 (x² - 9) ÷ (x + 3)',
    '求等差数列 2, 5, 8, 11, ... 的第20项',
  ][i],
  status: i < 8 ? 'correct' : i < 12 ? 'wrong' : 'uncertain',
  score: i < 8 ? [3, 5, 3, 8, 5, 3, 3, 5][i] : 0,
  fullScore: [3, 5, 3, 8, 5, 3, 3, 5, 5, 3, 3, 5, 3, 3, 5][i],
}))

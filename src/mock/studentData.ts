import type { ChildInfo } from '../types'

export const mockChildren: ChildInfo[] = [
  { id: '1', name: '小明', grade: '小学（三年级）' },
  { id: '2', name: '小红', grade: '小学（五年级）' },
]

export const gradeGroups = [
  {
    label: '小学',
    tags: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
  },
  {
    label: '初中',
    tags: ['初一', '初二', '初三'],
  },
  {
    label: '高中',
    tags: ['高一', '高二', '高三'],
  },
]

export const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理']

export const examTypes = ['期中考试', '期末考试', '月考', '单元测试', '模拟考试', '其他']

export const parentRoles = ['爸爸', '妈妈', '爷爷', '奶奶', '其他家人']

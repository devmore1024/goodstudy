import type { ChatFlowConfig } from '../types'
import { gradeGroups } from './studentData'
import { hotCities } from './cities'
import { mockChildren } from './studentData'
import { parentRoles } from './studentData'

export const welcomeFlow: ChatFlowConfig = {
  initialStep: 'greet',
  steps: [
    {
      id: 'greet',
      aiMessage: '你好呀！我是小花老师，很高兴认识你！我会陪伴你一起学习，帮你找到最适合自己的学习方式。',
      inputType: 'text',
      nextStep: 'ask-identity',
    },
    {
      id: 'ask-identity',
      aiMessage: '在开始之前，我想先了解一下你的身份，请问你是学生还是家长呢？',
      inputType: 'voice',
      inputConfig: { type: 'voice', options: ['我是学生', '我是家长'] },
      nextStep: (answer: string) => answer.includes('学生') ? 'confirm-student' : 'confirm-parent',
      fieldKey: 'identity',
    },
    {
      id: 'confirm-student',
      aiMessage: '太好了！欢迎你，同学！让我们先建立你的学习档案，这样我就能更好地帮助你了。',
      inputType: 'text',
      nextStep: 'done-student',
    },
    {
      id: 'done-student',
      aiMessage: '准备好了吗？让我们开始吧！',
      inputType: undefined,
    },
    {
      id: 'confirm-parent',
      aiMessage: '欢迎您，家长！让我们先建立您的档案，方便我更好地为您的孩子提供帮助。',
      inputType: 'text',
      nextStep: 'done-parent',
    },
    {
      id: 'done-parent',
      aiMessage: '好的，让我们开始建立档案吧！',
      inputType: undefined,
    },
  ],
}

export const studentProfileFlow: ChatFlowConfig = {
  initialStep: 'ask-name',
  steps: [
    {
      id: 'ask-name',
      aiMessage: '首先，我想知道你的名字，你叫什么呀？',
      inputType: 'text',
      nextStep: 'ask-grade',
      fieldKey: 'name',
    },
    {
      id: 'ask-grade',
      aiMessage: '{name}，这个名字真好听！那你现在上几年级呢？',
      inputType: 'tag-select',
      inputConfig: { type: 'tag-select', groups: gradeGroups, columns: 3 },
      nextStep: 'ask-city',
      fieldKey: 'grade',
    },
    {
      id: 'ask-city',
      aiMessage: '好的，{grade}的{name}同学！你在哪个城市上学呢？',
      inputType: 'tag-select',
      inputConfig: { type: 'tag-select', tags: hotCities, searchable: true },
      nextStep: 'voiceprint',
      fieldKey: 'city',
    },
    {
      id: 'voiceprint',
      aiMessage: '太好了！接下来我需要采集一下你的声纹，这样我以后就能认出你的声音了。请对着手机说一段话吧~',
      inputType: 'voiceprint',
      nextStep: 'confirm',
      fieldKey: 'voicePrint',
    },
    {
      id: 'confirm',
      aiMessage: '声纹采集成功！让我确认一下你的信息：',
      inputType: 'card',
      inputConfig: { type: 'card', cardType: 'profile', data: {} },
    },
  ],
}

export const parentProfileFlow: ChatFlowConfig = {
  initialStep: 'welcome',
  steps: [
    {
      id: 'welcome',
      aiMessage: '欢迎您！我是小花老师～请问您是孩子的爸爸、妈妈，还是其他家人呢？',
      inputType: 'tag-select',
      inputConfig: { type: 'tag-select', tags: parentRoles },
      nextStep: 'voiceprint',
      fieldKey: 'parentRole',
    },
    {
      id: 'voiceprint',
      aiMessage: '好的！接下来需要采集您的声纹，请对着手机说一段话~',
      inputType: 'voiceprint',
      nextStep: 'link-children',
      fieldKey: 'voicePrint',
    },
    {
      id: 'link-children',
      aiMessage: '声纹采集成功！我发现系统中已经有注册的孩子，请确认需要关联哪些孩子：',
      inputType: 'child-list',
      inputConfig: { type: 'child-list', children: mockChildren },
      nextStep: 'confirm',
      fieldKey: 'linkedChildren',
    },
    {
      id: 'confirm',
      aiMessage: '好的！让我确认一下您的信息：',
      inputType: 'card',
      inputConfig: { type: 'card', cardType: 'profile', data: {} },
    },
  ],
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { A4State, ExamInfo, QuestionResult } from '../types'
import TeacherAvatar from '../components/TeacherAvatar'
import DialogBubble from '../components/DialogBubble'
import ActionButton from '../components/ActionButton'
import NavigationBar from '../components/NavigationBar'
import CameraView from '../components/CameraView'
import CropView from '../components/CropView'
import ExamInfoForm from '../components/ExamInfoForm'
import QuestionCard from '../components/QuestionCard'
import SubjectTagBar from '../components/SubjectTagBar'
import BouncingDots from '../components/BouncingDots'
import { mockOcrResults } from '../mock/ocrResults'
import { subjects } from '../mock/studentData'

export default function A4ExamUpload() {
  const navigate = useNavigate()
  const [state, setState] = useState<A4State>('entry')
  const [ocrProgress, setOcrProgress] = useState(0)
  const [isOcrRunning, setIsOcrRunning] = useState(false)
  const [questions, setQuestions] = useState<QuestionResult[]>(mockOcrResults)
  const [uploadedSubjects, setUploadedSubjects] = useState<string[]>([])
  const [currentSubject, setCurrentSubject] = useState('')

  // OCR progress simulation
  useEffect(() => {
    if (!isOcrRunning) return
    setOcrProgress(0)
    const timer = setInterval(() => {
      setOcrProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setIsOcrRunning(false)
          setState('ocr-result')
          return 100
        }
        return prev + Math.random() * 8 + 2
      })
    }, 100)
    return () => clearInterval(timer)
  }, [isOcrRunning])

  const handleStatusChange = (id: number, status: QuestionResult['status']) => {
    setQuestions(prev => prev.map(q =>
      q.id === id ? { ...q, status, score: status === 'correct' ? q.fullScore : 0 } : q
    ))
  }

  const handleConfirmOcr = () => {
    setUploadedSubjects(prev => [...prev, currentSubject || '数学'])
    setState('multi-subject')
  }

  const handleSelectSubject = (subject: string) => {
    setCurrentSubject(subject)
    setState('camera')
  }

  const stats = {
    correct: questions.filter(q => q.status === 'correct').length,
    wrong: questions.filter(q => q.status === 'wrong').length,
    uncertain: questions.filter(q => q.status === 'uncertain').length,
    totalScore: questions.reduce((s, q) => s + q.score, 0),
    fullScore: questions.reduce((s, q) => s + q.fullScore, 0),
  }

  // Entry state
  if (state === 'entry') {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-brand-light/30 via-white to-white">
        <NavigationBar showBack rightAction={{ label: '跳过', onClick: () => navigate('/home/student') }} />

        <div className="flex-1 flex flex-col items-center px-6 pt-6">
          <TeacherAvatar mode="full" />

          <div className="mt-6 w-full">
            <DialogBubble
              content="欢迎！我可以帮你分析试卷，找出薄弱知识点。你手边有试卷吗？"
              role="ai"
              animate
            />
          </div>

          <div className="mt-auto pb-8 w-full flex gap-3">
            <ActionButton
              variant="primary"
              fullWidth
              onClick={() => {
                setCurrentSubject('数学')
                setState('camera')
              }}
            >
              我有试卷
            </ActionButton>
            <ActionButton
              variant="outline"
              fullWidth
              onClick={() => navigate('/home/student')}
            >
              我没有试卷
            </ActionButton>
          </div>
        </div>
      </div>
    )
  }

  // Camera state
  if (state === 'camera') {
    return (
      <CameraView
        onCapture={() => setState('crop')}
        onBack={() => setState('entry')}
      />
    )
  }

  // Crop state
  if (state === 'crop') {
    return (
      <CropView
        onConfirm={() => setState('info')}
        onRetake={() => setState('camera')}
        onRotate={() => {}}
      />
    )
  }

  // Info form state
  if (state === 'info') {
    return (
      <div className="h-full flex flex-col">
        <NavigationBar title="试卷信息" rightAction={{ label: '取消', onClick: () => setState('entry') }} />
        <div className="flex-1">
          <ExamInfoForm onSubmit={(_info: ExamInfo) => setIsOcrRunning(true)} />
        </div>

        {/* OCR Progress overlay */}
        {isOcrRunning && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20">
            <TeacherAvatar mode="avatar" className="mb-6" />
            <p className="text-base font-semibold text-gray-800 mb-4">正在识别试卷...</p>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-brand to-blue rounded-full transition-all duration-200"
                style={{ width: `${Math.min(ocrProgress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">{Math.min(Math.round(ocrProgress), 100)}%</p>
            <div className="mt-4">
              <BouncingDots />
            </div>
          </div>
        )}
      </div>
    )
  }

  // OCR Result state
  if (state === 'ocr-result') {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <NavigationBar title="识别结果" />

        {/* Stats */}
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-800">
              得分：<span className="text-brand font-bold text-lg">{stats.totalScore}</span>
              <span className="text-gray-400">/{stats.fullScore}</span>
            </span>
          </div>
          <div className="flex gap-4 text-xs">
            <span className="text-success">正确 {stats.correct} 题</span>
            <span className="text-error">错误 {stats.wrong} 题</span>
            <span className="text-warning">待确认 {stats.uncertain} 题</span>
          </div>
        </div>

        {/* Question list */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-2.5">
          {questions.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {/* Confirm */}
        <div className="px-4 py-4 bg-white border-t border-gray-100">
          <ActionButton variant="primary" fullWidth onClick={handleConfirmOcr}>
            确认结果
          </ActionButton>
        </div>
      </div>
    )
  }

  // Multi-subject state
  if (state === 'multi-subject') {
    const remaining = subjects.filter(s => !uploadedSubjects.includes(s))
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <NavigationBar title="上传更多科目" />

        <div className="flex-1 px-4 py-6">
          <div className="mb-6">
            <DialogBubble
              content={`${uploadedSubjects.join('、')}试卷已分析完成！还有其他科目要上传吗？`}
              role="ai"
              animate
            />
          </div>

          <SubjectTagBar
            uploaded={uploadedSubjects}
            remaining={remaining}
            onSelect={handleSelectSubject}
            onFinish={() => navigate('/plan/create')}
          />
        </div>
      </div>
    )
  }

  return null
}

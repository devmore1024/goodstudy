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

const TEACHER_IMG = '/images/teacher.png'

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
      <div className="h-full flex flex-col page-bg-warm relative overflow-hidden">
        <NavigationBar showBack rightAction={{ label: '跳过', onClick: () => navigate('/home/student') }} />

        {/* Decorative background */}
        <div className="deco-circle w-56 h-56 bg-orange/5 -top-16 -right-16" />
        <div className="deco-circle w-40 h-40 bg-brand/5 bottom-32 -left-12" />

        <div className="flex-1 flex flex-col items-center px-6 pt-4 relative z-10">
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
      <div className="h-full flex flex-col page-bg-chat">
        <NavigationBar title="试卷信息" rightAction={{ label: '取消', onClick: () => setState('entry') }} />
        <div className="flex-1">
          <ExamInfoForm onSubmit={(_info: ExamInfo) => setIsOcrRunning(true)} />
        </div>

        {/* OCR Progress overlay */}
        {isOcrRunning && (
          <div className="absolute inset-0 glass flex flex-col items-center justify-center z-20">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-brand/15 blur-xl scale-[2] animate-pulse" />
              <img
                src={TEACHER_IMG}
                alt="小花老师"
                className="relative w-20 h-20 rounded-full object-cover ring-3 ring-white shadow-xl animate-breathe"
              />
            </div>
            <p className="text-base font-semibold text-gray-800 mb-4">正在识别试卷...</p>
            <div className="w-52 h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2 shadow-inner">
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
      <div className="h-full flex flex-col page-bg-chat">
        <NavigationBar title="识别结果" />

        {/* Stats */}
        <div className="mx-4 mt-2 mb-3 p-4 bg-white rounded-2xl card-glow">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-medium text-gray-700">
              得分：<span className="text-brand font-bold text-xl">{stats.totalScore}</span>
              <span className="text-gray-400 text-sm">/{stats.fullScore}</span>
            </span>
          </div>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="text-gray-600">正确 {stats.correct} 题</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-error" />
              <span className="text-gray-600">错误 {stats.wrong} 题</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-warning" />
              <span className="text-gray-600">待确认 {stats.uncertain} 题</span>
            </span>
          </div>
        </div>

        {/* Question list */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-3 space-y-2.5">
          {questions.map(q => (
            <QuestionCard
              key={q.id}
              question={q}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {/* Confirm */}
        <div className="px-4 py-4 glass border-t border-gray-100/50">
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
      <div className="h-full flex flex-col page-bg-chat">
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

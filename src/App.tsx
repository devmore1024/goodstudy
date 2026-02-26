import { Routes, Route } from 'react-router-dom'
import MobileLayout from './layouts/MobileLayout'
import A1Splash from './pages/A1Splash'
import A2Login from './pages/A2Login'
import A3Welcome from './pages/A3Welcome'
import A3aStudentProfile from './pages/A3aStudentProfile'
import A3bParentProfile from './pages/A3bParentProfile'
import A4ExamUpload from './pages/A4ExamUpload'
import B1StudentHome from './pages/B1StudentHome'
import B2ParentHome from './pages/B2ParentHome'
import C1PlanCreate from './pages/C1PlanCreate'
import C2PlanOverview from './pages/C2PlanOverview'
import C2aDailyPlan from './pages/C2aDailyPlan'
import C3TestSetup from './pages/C3TestSetup'
import C4TestProgress from './pages/C4TestProgress'
import C5TestResult from './pages/C5TestResult'
import E1DailyReport from './pages/E1DailyReport'
import E2WeeklyReport from './pages/E2WeeklyReport'
import E3MonthlyReport from './pages/E3MonthlyReport'
import F1Profile from './pages/F1Profile'
import F2FamilyMembers from './pages/F2FamilyMembers'
import F3VoicePrint from './pages/F3VoicePrint'
import F4LearningSettings from './pages/F4LearningSettings'
import D2PhotoJudge from './pages/D2PhotoJudge'
import D2PhotoJudgeHistory from './pages/D2PhotoJudgeHistory'
import D3QA from './pages/D3QA'
import D3QAHistory from './pages/D3QAHistory'
import G0ComponentDemo from './pages/G0ComponentDemo'
import PlaceholderPage from './pages/PlaceholderPage'

export default function App() {
  return (
    <MobileLayout>
      <Routes>
        {/* A - Login & Onboarding */}
        <Route path="/" element={<A1Splash />} />
        <Route path="/login" element={<A2Login />} />
        <Route path="/welcome" element={<A3Welcome />} />
        <Route path="/profile/student" element={<A3aStudentProfile />} />
        <Route path="/profile/parent" element={<A3bParentProfile />} />
        <Route path="/exam-upload" element={<A4ExamUpload />} />
        {/* B - Home */}
        <Route path="/home/student" element={<B1StudentHome />} />
        <Route path="/home/parent" element={<B2ParentHome />} />
        {/* C - Plans & Assessment */}
        <Route path="/plan/create" element={<C1PlanCreate />} />
        <Route path="/plan/overview" element={<C2PlanOverview />} />
        <Route path="/plan/daily" element={<C2aDailyPlan />} />
        <Route path="/test/setup" element={<C3TestSetup />} />
        <Route path="/test/progress" element={<C4TestProgress />} />
        <Route path="/test/result" element={<C5TestResult />} />
        {/* E - Reports */}
        <Route path="/report" element={<E1DailyReport />} />
        <Route path="/report/weekly" element={<E2WeeklyReport />} />
        <Route path="/report/monthly" element={<E3MonthlyReport />} />
        {/* F - Profile & Settings */}
        <Route path="/me" element={<F1Profile />} />
        <Route path="/family" element={<F2FamilyMembers />} />
        <Route path="/voiceprint" element={<F3VoicePrint />} />
        <Route path="/settings" element={<F4LearningSettings />} />
        {/* D - Core Learning */}
        <Route path="/photo-judge" element={<D2PhotoJudge />} />
        <Route path="/photo-judge/history" element={<D2PhotoJudgeHistory />} />
        <Route path="/qa" element={<D3QA />} />
        <Route path="/qa/history" element={<D3QAHistory />} />
        {/* G - Global Components Demo */}
        <Route path="/demo/components" element={<G0ComponentDemo />} />
        {/* Placeholder routes */}
        <Route path="/plan" element={<PlaceholderPage title="学习计划" />} />
        <Route path="/knowledge" element={<PlaceholderPage title="知识课堂 (D1)" />} />
        <Route path="/test" element={<C3TestSetup />} />
        <Route path="/achievement" element={<PlaceholderPage title="成就" />} />
        <Route path="/about" element={<PlaceholderPage title="关于我们" />} />
      </Routes>
    </MobileLayout>
  )
}

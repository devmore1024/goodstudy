import { Routes, Route } from 'react-router-dom'
import MobileLayout from './layouts/MobileLayout'
import A1Splash from './pages/A1Splash'
import A2Login from './pages/A2Login'
import A3Welcome from './pages/A3Welcome'
import A3aStudentProfile from './pages/A3aStudentProfile'
import A3bParentProfile from './pages/A3bParentProfile'
import A4ExamUpload from './pages/A4ExamUpload'
import PlaceholderPage from './pages/PlaceholderPage'

export default function App() {
  return (
    <MobileLayout>
      <Routes>
        <Route path="/" element={<A1Splash />} />
        <Route path="/login" element={<A2Login />} />
        <Route path="/welcome" element={<A3Welcome />} />
        <Route path="/profile/student" element={<A3aStudentProfile />} />
        <Route path="/profile/parent" element={<A3bParentProfile />} />
        <Route path="/exam-upload" element={<A4ExamUpload />} />
        <Route path="/home/student" element={<PlaceholderPage title="学生首页 (B1)" />} />
        <Route path="/home/parent" element={<PlaceholderPage title="家长首页 (B2)" />} />
        <Route path="/plan/create" element={<PlaceholderPage title="学习计划 (C1)" />} />
      </Routes>
    </MobileLayout>
  )
}

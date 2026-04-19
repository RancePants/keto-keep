import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import { ToastProvider } from './components/ui/Toast.jsx';
import StreakMilestoneWatcher from './components/ui/StreakMilestoneWatcher.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import UpdatePassword from './pages/UpdatePassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import AdminTags from './pages/AdminTags.jsx';
import AdminAdminTags from './pages/AdminAdminTags.jsx';
import AdminHub from './pages/AdminHub.jsx';
import MembersDirectory from './pages/MembersDirectory.jsx';
import ForumHome from './pages/ForumHome.jsx';
import SpaceView from './pages/SpaceView.jsx';
import PostDetail from './pages/PostDetail.jsx';
import EventsHome from './pages/EventsHome.jsx';
import EventDetail from './pages/EventDetail.jsx';
import CoursesHome from './pages/CoursesHome.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import LessonView from './pages/LessonView.jsx';
import InviteFriends from './pages/InviteFriends.jsx';
import TermsOfUse from './pages/TermsOfUse.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import HealthDisclaimer from './pages/HealthDisclaimer.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <StreakMilestoneWatcher />
          <ScrollToTop />
          <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tags"
              element={
                <ProtectedRoute>
                  <AdminTags />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminHub />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/admin-tags"
              element={
                <ProtectedRoute>
                  <AdminAdminTags />
                </ProtectedRoute>
              }
            />
            <Route
              path="/members"
              element={
                <ProtectedRoute>
                  <MembersDirectory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forums"
              element={
                <ProtectedRoute>
                  <ForumHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forums/:slug"
              element={
                <ProtectedRoute>
                  <SpaceView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forums/:slug/:postId"
              element={
                <ProtectedRoute>
                  <PostDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <EventsHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <ProtectedRoute>
                  <EventDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <CoursesHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:slug"
              element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:slug/:lessonId"
              element={
                <ProtectedRoute>
                  <LessonView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invite"
              element={
                <ProtectedRoute>
                  <InviteFriends />
                </ProtectedRoute>
              }
            />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/disclaimer" element={<HealthDisclaimer />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

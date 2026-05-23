import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import Topics from './pages/Topics';
import Submissions from './pages/Submissions';
import Contests from './pages/Contests';
import Notes from './pages/Notes';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Sheets from './pages/Sheets';
import SheetDetail from './pages/SheetDetail';
import Revisions from './pages/Revisions';
import TopicDetail from './pages/TopicDetail';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/sheets" element={<Sheets />} />
          <Route path="/sheets/:id" element={<SheetDetail />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/topics/:id" element={<TopicDetail />} />
          <Route path="/revisions" element={<Revisions />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

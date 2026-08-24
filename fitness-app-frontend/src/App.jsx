import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router';
import { useSelector } from 'react-redux';
import theme from './theme';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './components/dashboard/DashboardPage';
import ActivitiesPage from './components/dashboard/ActivitiesPage';
import ActivityDetail from './components/activities/ActivityDetail';
import AICoachPage from './components/ai/AICoachPage';
import ProfilePage from './components/profile/ProfilePage';
import LoginPage from './components/auth/LoginPage';
import ErrorBoundary from './components/common/ErrorBoundary';

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  return token && userId ? children : <Navigate to="/login" replace />;
};

const AuthenticatedApp = () => {
  return (
    <DashboardLayout>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/ai-coach" element={<AICoachPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ErrorBoundary>
    </DashboardLayout>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <AuthenticatedApp />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
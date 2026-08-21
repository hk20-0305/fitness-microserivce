import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router';
import theme from './theme';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './components/dashboard/DashboardPage';
import ActivitiesPage from './components/dashboard/ActivitiesPage';
import ActivityDetail from './components/activities/ActivityDetail';
import AICoachPage from './components/ai/AICoachPage';
import ProfilePage from './components/profile/ProfilePage';

const AuthenticatedApp = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/activities/:id" element={<ActivityDetail />} />
        <Route path="/ai-coach" element={<AICoachPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthenticatedApp />
      </Router>
    </ThemeProvider>
  );
}

export default App;
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router';
import { useDispatch } from 'react-redux';
import { setCredentials } from './store/authSlice';
import theme from './theme';
import LoginPage from './components/LoginPage';
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
  const { token, tokenData } = useContext(AuthContext);
  const dispatch = useDispatch();

  // Sync auth state with Redux/localStorage when token changes
  if (token && tokenData) {
    dispatch(setCredentials({ token, user: tokenData }));
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {!token ? (
          <LoginPage />
        ) : (
          <AuthenticatedApp />
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
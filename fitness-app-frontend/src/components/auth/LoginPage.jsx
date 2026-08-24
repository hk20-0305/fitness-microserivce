import { useState } from 'react';
import {
  Box, Button, Card, CardContent, CircularProgress,
  Divider, TextField, Typography, Alert, Tabs, Tab
} from '@mui/material';
import { Activity } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { setCredentials } from '../../store/authSlice';
import { login, register } from '../../services/api';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tab, setTab] = useState(0); // 0 = Login, 1 = Register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  /**
   * Extracts a human-readable string from an Axios error.
   * Handles:
   *  - Spring Boot default error shape: { timestamp, status, error, path }
   *  - Spring ResponseStatusException shape: { message }
   *  - HTTP 409 Conflict → switch to login tab automatically
   *  - Raw string responses
   * Never returns a non-string so React never tries to render an object.
   */
  const getErrorMessage = (err, fallback) => {
    const status = err?.response?.status;
    const data = err?.response?.data;

    // 409 Conflict — email already registered
    if (status === 409) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    // 401 Unauthorized — wrong credentials
    if (status === 401) {
      return 'Invalid email or password. Please try again.';
    }

    // Parse Spring Boot error body
    if (typeof data === 'string' && data.trim()) return data;
    if (data && typeof data === 'object') {
      // Spring ResponseStatusException uses 'message'
      if (typeof data.message === 'string' && data.message.trim()) return data.message;
      // Spring Boot default error body uses 'error'
      if (typeof data.error === 'string' && data.error.trim()) return data.error;
    }
    // Axios network error
    if (typeof err?.message === 'string' && err.message.trim()) {
      if (err.message.includes('Network Error')) return 'Unable to reach the server. Please check your connection.';
      return err.message;
    }
    return fallback;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(loginForm);
      const { token, user, id, email, firstName, lastName } = res.data;
      dispatch(setCredentials({
        token: token || null,
        user: user || { id, email, firstName, lastName }
      }));
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid email or password.'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register(registerForm);
      const { token, id, email, firstName, lastName } = res.data;
      dispatch(setCredentials({
        token: token || null,
        user: { id, email, firstName, lastName }
      }));
      navigate('/dashboard');
    } catch (err) {
      const msg = getErrorMessage(err, 'Registration failed. Please try again.');
      setError(msg);
      // If email already exists (409), switch to login tab automatically
      if (err?.response?.status === 409) {
        setTab(0);
        setLoginForm((prev) => ({ ...prev, email: registerForm.email }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0B0F14 0%, #141922 100%)',
        px: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #7CFF4F, #4FD1FF)',
              mb: 2,
            }}
          >
            <Activity size={30} color="#0B0F14" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Fitness Tracker
          </Typography>
          <Typography variant="body2" sx={{ color: '#9AA4B2', mt: 0.5 }}>
            AI-Powered Personal Coach
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Tabs
              value={tab}
              onChange={(_, v) => { setTab(v); setError(''); }}
              sx={{ mb: 3 }}
              variant="fullWidth"
            >
              <Tab label="Sign In" id="tab-login" />
              <Tab label="Register" id="tab-register" />
            </Tabs>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {typeof error === 'string' ? error : 'An error occurred. Please try again.'}
              </Alert>
            )}

            {/* LOGIN FORM */}
            {tab === 0 && (
              <Box component="form" onSubmit={handleLoginSubmit}>
                <TextField
                  id="login-email"
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  autoComplete="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  id="login-password"
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  sx={{ mb: 3 }}
                />
                <Button
                  id="login-submit"
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #7CFF4F, #4FD1FF)',
                    color: '#0B0F14',
                    '&:hover': { opacity: 0.9 },
                  }}
                >
                  {loading ? <CircularProgress size={22} sx={{ color: '#0B0F14' }} /> : 'Sign In'}
                </Button>
              </Box>
            )}

            {/* REGISTER FORM */}
            {tab === 1 && (
              <Box component="form" onSubmit={handleRegisterSubmit}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    id="register-firstname"
                    label="First Name"
                    fullWidth
                    required
                    value={registerForm.firstName}
                    onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                  />
                  <TextField
                    id="register-lastname"
                    label="Last Name"
                    fullWidth
                    required
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                  />
                </Box>
                <TextField
                  id="register-email"
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  autoComplete="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  id="register-password"
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  autoComplete="new-password"
                  helperText="Minimum 6 characters"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  sx={{ mb: 3 }}
                />
                <Button
                  id="register-submit"
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #7CFF4F, #4FD1FF)',
                    color: '#0B0F14',
                    '&:hover': { opacity: 0.9 },
                  }}
                >
                  {loading ? <CircularProgress size={22} sx={{ color: '#0B0F14' }} /> : 'Create Account'}
                </Button>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />
            <Typography variant="caption" sx={{ color: '#9AA4B2', textAlign: 'center', display: 'block' }}>
              Your fitness data is encrypted and securely stored.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;

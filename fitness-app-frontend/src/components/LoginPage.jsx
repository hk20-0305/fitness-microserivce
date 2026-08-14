import { Box, Button, Typography, Paper } from '@mui/material';
import { Activity as ActivityIcon, Sparkles } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';

const LoginPage = () => {
  const { logIn } = useContext(AuthContext);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#0B0F14',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          p: { md: 8, lg: 12 },
          background: 'linear-gradient(135deg, #0B0F14 0%, #121821 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 255, 79, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79, 209, 255, 0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 520 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 6 }}>
            <ActivityIcon size={32} color="#7CFF4F" />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
              Fitness Tracker
            </Typography>
          </Box>

          <Typography variant="h2" sx={{ fontWeight: 700, mb: 3, lineHeight: 1.2, color: '#FFFFFF' }}>
            Train smarter.
            <br />
            <Box component="span" sx={{ color: '#7CFF4F' }}>Recover better.</Box>
            <br />
            Perform stronger.
          </Typography>

          <Typography variant="body1" sx={{ color: '#9AA4B2', mb: 6, maxWidth: 420, lineHeight: 1.7 }}>
            Your AI-powered fitness companion. Track activities, analyze performance, and get personalized coaching to achieve your goals.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Sparkles size={16} color="#7CFF4F" />
              <Typography variant="body2" sx={{ color: '#9AA4B2' }}>
                AI Coaching
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ActivityIcon size={16} color="#4FD1FF" />
              <Typography variant="body2" sx={{ color: '#9AA4B2' }}>
                Activity Tracking
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 4, sm: 6, md: 8 },
          backgroundColor: '#0B0F14',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <Box sx={{ mb: 6, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 1 }}>
              Welcome back
            </Typography>
            <Typography variant="body2" sx={{ color: '#9AA4B2' }}>
              Sign in to continue your fitness journey
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              backgroundColor: '#121821',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 4,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '16px',
                    backgroundColor: 'rgba(124, 255, 79, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <ActivityIcon size={32} color="#7CFF4F" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                  Sign in with Keycloak
                </Typography>
                <Typography variant="body2" sx={{ color: '#9AA4B2', mt: 0.5 }}>
                  Secure authentication powered by Keycloak
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => logIn()}
                sx={{
                  py: 1.75,
                  borderRadius: 3,
                  backgroundColor: '#7CFF4F',
                  color: '#0B0F14',
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#6EE049',
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          </Paper>

          <Typography variant="body2" sx={{ color: '#9AA4B2', textAlign: 'center', mt: 4 }}>
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
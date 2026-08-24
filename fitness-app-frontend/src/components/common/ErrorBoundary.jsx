import React from 'react';
import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '50vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}
        >
          <Card
            sx={{
              maxWidth: 480,
              width: '100%',
              backgroundColor: '#161D27',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: 3,
              textAlign: 'center',
              p: 2,
            }}
          >
            <CardContent>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255, 107, 107, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <AlertTriangle size={28} color="#FF6B6B" />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 1 }}>
                Something went wrong
              </Typography>
              <Typography variant="body2" sx={{ color: '#9AA4B2', mb: 3 }}>
                {this.state.error?.message || 'An unexpected error occurred while rendering this section.'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<RefreshCw size={18} />}
                onClick={this.handleReset}
                sx={{
                  background: 'linear-gradient(135deg, #7CFF4F, #4FD1FF)',
                  color: '#0B0F14',
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

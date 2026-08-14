import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';

const WelcomeSection = () => {
  const handleTrackActivity = () => {
    const form = document.getElementById('track-activity-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ maxWidth: 600 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.2 }}>
          Your fitness journey,
          <br />
          <Box component="span" sx={{ color: '#7CFF4F' }}>powered by AI.</Box>
        </Typography>
        <Typography variant="body1" sx={{ color: '#9AA4B2', mb: 3 }}>
          Track your activities, understand your progress, and get personalized recommendations.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Plus size={20} />}
            onClick={handleTrackActivity}
            sx={{ borderRadius: 3 }}
          >
            Track Activity
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default WelcomeSection;

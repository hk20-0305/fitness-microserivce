import { useState, useCallback } from 'react';
import { Box, Grid2, Typography, Button } from '@mui/material';
import { Plus } from 'lucide-react';
import ActivityForm from '../activities/ActivityForm';
import ActivityList from '../activities/ActivityList';

const ActivitiesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActivityAdded = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  const handleTrackActivity = () => {
    document.getElementById('track-activity-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Activities
          </Typography>
          <Typography variant="body1" sx={{ color: '#9AA4B2' }}>
            Track and manage all your fitness activities.
          </Typography>
        </Box>
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

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 5, lg: 4 }}>
          <Box id="track-activity-form">
            <ActivityForm onActivityAdded={handleActivityAdded} />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 7, lg: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            All Activities
          </Typography>
          <ActivityList refreshKey={refreshKey} />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ActivitiesPage;
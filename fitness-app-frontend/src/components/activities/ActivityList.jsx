import { useEffect, useState, useCallback } from 'react';
import { Grid2, Typography, Box, Skeleton, Button, Snackbar, Alert } from '@mui/material';
import { RefreshCw } from 'lucide-react';
import { getActivities, deleteActivity } from '../../services/api';
import ActivityCard from './ActivityCard';

const ActivityList = ({ onActivitiesLoaded, refreshKey, onDelete }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getActivities();
      setActivities(response.data || []);
      onActivitiesLoaded?.(response.data || []);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [onActivitiesLoaded]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities, refreshKey]);

  const handleDelete = async (id) => {
    try {
      await deleteActivity(id);
      setActivities((prev) => prev.filter((a) => a.id !== id));
      setSnackbar({ open: true, message: 'Activity deleted successfully', severity: 'success' });
      onDelete?.();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to delete activity', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Grid2 container spacing={3}>
        {[...Array(3)].map((_, i) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={i}>
            <Box sx={{ p: 3 }}>
              <Skeleton variant="rectangular" sx={{ borderRadius: 2, height: 160 }} />
            </Box>
          </Grid2>
        ))}
      </Grid2>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: '#FF6B6B', mb: 1 }}>
          Unable to load activities
        </Typography>
        <Typography variant="body2" sx={{ color: '#9AA4B2', mb: 3 }}>
          Please check your connection and try again.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshCw size={16} />}
          onClick={fetchActivities}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (activities.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
          No activities yet
        </Typography>
        <Typography variant="body2" sx={{ color: '#9AA4B2', mb: 3 }}>
          Start your fitness journey by tracking your first activity.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid2 container spacing={3}>
        {activities.map((activity) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={activity.id}>
            <ActivityCard activity={activity} onDelete={handleDelete} />
          </Grid2>
        ))}
      </Grid2>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ActivityList;
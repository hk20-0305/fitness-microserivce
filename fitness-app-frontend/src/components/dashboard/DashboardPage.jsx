import { useState, useCallback, useEffect } from 'react';
import { Box, Grid2, Typography, Button } from '@mui/material';
import { Plus } from 'lucide-react';
import WelcomeSection from './WelcomeSection';
import StatsGrid from './StatsGrid';
import AICoachCard from './AICoachCard';
import ActivityForm from '../activities/ActivityForm';
import ActivityList from '../activities/ActivityList';
import { getUserRecommendations } from '../../services/api';
import { useSelector } from 'react-redux';

const DashboardPage = () => {
  const [activities, setActivities] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [recommendation, setRecommendation] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id || user?.userId || user?.sub;

  const handleActivitiesLoaded = useCallback((loaded) => {
    setActivities(loaded || []);
  }, []);

  const handleActivityAdded = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (!userId) return;
    getUserRecommendations(userId)
      .then((res) => {
        const recs = res.data || [];
        if (recs.length > 0) {
          setRecommendation(recs[recs.length - 1]);
        }
      })
      .catch((err) => {
        console.error('Failed to load recommendations:', err);
      });
  }, [userId, refreshKey]);

  const handleTrackActivity = () => {
    document.getElementById('track-activity-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Box>
      <WelcomeSection />

      <StatsGrid activities={activities} />

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 5, lg: 4 }}>
          <Box id="track-activity-form">
            <ActivityForm onActivityAdded={handleActivityAdded} />
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 7, lg: 8 }}>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Recent Activities
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Plus size={16} />}
              onClick={handleTrackActivity}
            >
              Track Activity
            </Button>
          </Box>
          <ActivityList onActivitiesLoaded={handleActivitiesLoaded} refreshKey={refreshKey} />
        </Grid2>
      </Grid2>

      <Box sx={{ mt: 4 }}>
        <AICoachCard recommendation={recommendation} />
      </Box>
    </Box>
  );
};

export default DashboardPage;
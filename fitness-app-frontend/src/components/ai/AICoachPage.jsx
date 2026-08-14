import { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Skeleton, Button } from '@mui/material';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getUserRecommendations } from '../../services/api';
import RecommendationCard from './RecommendationCard';

const AICoachPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.sub;

  const fetchRecommendations = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await getUserRecommendations(userId);
      setRecommendations(response.data || []);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rectangular" sx={{ borderRadius: 3, height: 200, mb: 3 }} />
        <Skeleton variant="rectangular" sx={{ borderRadius: 3, height: 300 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" sx={{ color: '#FF6B6B', mb: 2 }}>
          Unable to load AI recommendations
        </Typography>
        <Typography variant="body2" sx={{ color: '#9AA4B2', mb: 3 }}>
          Please check your connection and try again.
        </Typography>
        <Button variant="outlined" startIcon={<RefreshCw size={16} />} onClick={fetchRecommendations}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              backgroundColor: 'rgba(124, 255, 79, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={22} color="#7CFF4F" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            AI Fitness Coach
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#9AA4B2' }}>
          Personalized insights and recommendations based on your activity data.
        </Typography>
      </Box>

      {recommendations.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
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
            <Sparkles size={32} color="#7CFF4F" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            No AI recommendations yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#9AA4B2', maxWidth: 500, mx: 'auto' }}>
            Complete an activity to receive personalized AI-powered insights and recommendations.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AICoachPage;
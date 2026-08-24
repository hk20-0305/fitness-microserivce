import {
  Box,
  Button,
  Card, CardContent,
  Chip,
  Grid2, Skeleton,
  Snackbar, Alert,
  IconButton, Tooltip,
  Typography
} from '@mui/material';
import { Activity, ArrowLeft, CheckCircle, Clock, Flame, Lightbulb, Shield, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getActivities, getActivityDetail, deleteActivity } from '../../services/api';

const typeConfig = {
  RUNNING: { color: '#7CFF4F', bg: 'rgba(124, 255, 79, 0.12)', icon: '🏃', label: 'Running' },
  WALKING: { color: '#4FD1FF', bg: 'rgba(79, 209, 255, 0.12)', icon: '🚶', label: 'Walking' },
  CYCLING: { color: '#FFB84D', bg: 'rgba(255, 184, 77, 0.12)', icon: '🚴', label: 'Cycling' },
  SWIMMING: { color: '#4FD1FF', bg: 'rgba(79, 209, 255, 0.12)', icon: '🏊', label: 'Swimming' },
  GYM: { color: '#B084FF', bg: 'rgba(176, 132, 255, 0.12)', icon: '🏋️', label: 'Gym' },
};

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleDelete = async () => {
    try {
      await deleteActivity(id);
      setSnackbar({ open: true, message: 'Activity deleted successfully', severity: 'success' });
      setTimeout(() => navigate('/activities'), 1200);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to delete activity', severity: 'error' });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch activity directly by ID
        const [activityRes, detailRes] = await Promise.allSettled([
          getActivity(id),
          getActivityDetail(id),
        ]);

        if (activityRes.status === 'fulfilled') {
          setActivities([activityRes.value.data]);
        } else {
          // Fallback to getActivities list if single get fails
          try {
            const listRes = await getActivities();
            setActivities(listRes.data || []);
          } catch (e) {
            console.error('Failed to load activities list fallback:', e);
          }
        }

        if (detailRes.status === 'fulfilled') {
          setRecommendation(detailRes.value.data);
        } else {
          // Recommendation not ready yet or 404 - normal for newly created activities
          setRecommendation(null);
        }
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);


  if (loading) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Skeleton variant="rectangular" sx={{ borderRadius: 3, height: 200, mb: 3 }} />
        <Skeleton variant="rectangular" sx={{ borderRadius: 3, height: 300 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', textAlign: 'center', py: 8 }}>
        <Typography variant="h5" sx={{ color: '#FF6B6B', mb: 2 }}>
          Unable to load activity details
        </Typography>
        <Typography variant="body2" sx={{ color: '#9AA4B2', mb: 3 }}>
          Please check your connection and try again.
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/activities')}>
          Back to Activities
        </Button>
      </Box>
    );
  }

  const activity = activities.find((a) => a.id === id);
  const config = activity ? typeConfig[activity.type] : typeConfig.RUNNING;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate('/activities')}
          sx={{ color: '#9AA4B2', '&:hover': { color: '#FFFFFF' } }}
        >
          Back to Activities
        </Button>
        <Tooltip title="Delete activity">
          <IconButton
            onClick={handleDelete}
            sx={{
              color: '#9AA4B2',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '&:hover': { color: '#FF6B6B', borderColor: 'rgba(255, 107, 107, 0.4)', backgroundColor: 'rgba(255, 107, 107, 0.1)' }
            }}
          >
            <Trash2 size={18} />
          </IconButton>
        </Tooltip>
      </Box>

      {activity && (
        <Card sx={{ mb: 3, border: `1px solid ${config.color}20` }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '14px',
                  backgroundColor: config.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                }}
              >
                {config.icon}
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {activity.type}
                </Typography>
                <Typography variant="body2" sx={{ color: '#9AA4B2' }}>
                  {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'Recent activity'}
                </Typography>
              </Box>
              {recommendation && (
                <Chip
                  icon={<Sparkles size={14} />}
                  label="AI Analyzed"
                  sx={{
                    ml: 'auto',
                    backgroundColor: 'rgba(124, 255, 79, 0.1)',
                    color: '#7CFF4F',
                    border: '1px solid rgba(124, 255, 79, 0.2)',
                  }}
                />
              )}
            </Box>

            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: 'rgba(255, 107, 107, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Flame size={20} color="#FF6B6B" />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#9AA4B2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Calories
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {activity.caloriesBurned} <Typography component="span" variant="body2" sx={{ color: '#9AA4B2' }}>kcal</Typography>
                    </Typography>
                  </Box>
                </Box>
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: 'rgba(79, 209, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={20} color="#4FD1FF" />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#9AA4B2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Duration
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {activity.duration} <Typography component="span" variant="body2" sx={{ color: '#9AA4B2' }}>min</Typography>
                    </Typography>
                  </Box>
                </Box>
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={20} color={config.color} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#9AA4B2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Type
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {activity.type}
                    </Typography>
                  </Box>
                </Box>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
      )}

      {recommendation ? (
        <Card sx={{ border: '1px solid rgba(124, 255, 79, 0.15)', background: 'linear-gradient(180deg, rgba(124, 255, 79, 0.05) 0%, #121821 100%)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: 'rgba(124, 255, 79, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={20} color="#7CFF4F" />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                AI Recommendation
              </Typography>
            </Box>

            {recommendation.recommendation && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ color: '#FFFFFF', lineHeight: 1.7, mb: 2 }}>
                  {typeof recommendation.recommendation === 'object'
                    ? (recommendation.recommendation.overall || JSON.stringify(recommendation.recommendation))
                    : recommendation.recommendation}
                </Typography>
              </Box>
            )}

            <Grid2 container spacing={3}>
              {Array.isArray(recommendation.improvements) && recommendation.improvements.length > 0 && (
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined" sx={{ borderColor: 'rgba(79, 209, 255, 0.2)', backgroundColor: 'rgba(79, 209, 255, 0.03)' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <Lightbulb size={18} color="#4FD1FF" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#4FD1FF' }}>
                          Improvements
                        </Typography>
                      </Box>
                      {recommendation.improvements.map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'flex-start' }}>
                          <Box sx={{ mt: 0.25, flexShrink: 0, display: 'flex' }}>
                            <CheckCircle size={16} color="#4FD1FF" />
                          </Box>
                          <Typography variant="body2" sx={{ color: '#9AA4B2' }}>
                            {typeof item === 'object' ? (item.recommendation ? `${item.area ? item.area + ': ' : ''}${item.recommendation}` : JSON.stringify(item)) : String(item)}
                          </Typography>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid2>
              )}

              {Array.isArray(recommendation.suggestions) && recommendation.suggestions.length > 0 && (
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined" sx={{ borderColor: 'rgba(124, 255, 79, 0.2)', backgroundColor: 'rgba(124, 255, 79, 0.03)' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <Activity size={18} color="#7CFF4F" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#7CFF4F' }}>
                          Suggestions
                        </Typography>
                      </Box>
                      {recommendation.suggestions.map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'flex-start' }}>
                          <Box sx={{ mt: 0.25, flexShrink: 0, display: 'flex' }}>
                            <CheckCircle size={16} color="#7CFF4F" />
                          </Box>
                          <Typography variant="body2" sx={{ color: '#9AA4B2' }}>
                            {typeof item === 'object' ? (item.description ? `${item.workout ? item.workout + ': ' : ''}${item.description}` : JSON.stringify(item)) : String(item)}
                          </Typography>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid2>
              )}

              {Array.isArray(recommendation.safety) && recommendation.safety.length > 0 && (
                <Grid2 size={{ xs: 12 }}>
                  <Card variant="outlined" sx={{ borderColor: 'rgba(255, 184, 77, 0.2)', backgroundColor: 'rgba(255, 184, 77, 0.03)' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <Shield size={18} color="#FFB84D" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#FFB84D' }}>
                          Safety Guidelines
                        </Typography>
                      </Box>
                      <Grid2 container spacing={2}>
                        {recommendation.safety.map((item, idx) => (
                          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                              <Box sx={{ mt: 0.25, flexShrink: 0, display: 'flex' }}>
                                <CheckCircle size={16} color="#FFB84D" />
                              </Box>
                              <Typography variant="body2" sx={{ color: '#9AA4B2' }}>
                                {typeof item === 'object' ? (item.text || JSON.stringify(item)) : String(item)}
                              </Typography>
                            </Box>
                          </Grid2>
                        ))}
                      </Grid2>
                    </CardContent>
                  </Card>
                </Grid2>
              )}
            </Grid2>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ border: '1px dashed rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(124, 255, 79, 0.03)' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: 'rgba(124, 255, 79, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Sparkles size={24} color="#7CFF4F" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              AI Recommendation
            </Typography>
            <Typography variant="body2" sx={{ color: '#9AA4B2', maxWidth: 500, mx: 'auto' }}>
              AI is analyzing your activity. Recommendations are being generated and will appear here shortly.
            </Typography>
          </CardContent>
        </Card>
      )}
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
    </Box>
  );
};

export default ActivityDetail;

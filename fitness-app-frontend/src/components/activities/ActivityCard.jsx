import { Card, CardContent, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { Flame, Clock, ChevronRight, Sparkles, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';

const typeConfig = {
  RUNNING: { color: '#7CFF4F', bg: 'rgba(124, 255, 79, 0.12)', icon: '🏃' },
  WALKING: { color: '#4FD1FF', bg: 'rgba(79, 209, 255, 0.12)', icon: '🚶' },
  CYCLING: { color: '#FFB84D', bg: 'rgba(255, 184, 77, 0.12)', icon: '🚴' },
  SWIMMING: { color: '#4FD1FF', bg: 'rgba(79, 209, 255, 0.12)', icon: '🏊' },
  WEIGHT_TRAINING: { color: '#B084FF', bg: 'rgba(176, 132, 255, 0.12)', icon: '🏋️' },
  YOGA: { color: '#FF8FA3', bg: 'rgba(255, 143, 163, 0.12)', icon: '🧘' },
  HIIT: { color: '#FF6B6B', bg: 'rgba(255, 107, 107, 0.12)', icon: '⚡' },
  CARDIO: { color: '#FF6B6B', bg: 'rgba(255, 107, 107, 0.12)', icon: '❤️' },
  STRETCHING: { color: '#4FD1FF', bg: 'rgba(79, 209, 255, 0.12)', icon: '🤸' },
  OTHER: { color: '#9AA4B2', bg: 'rgba(154, 164, 178, 0.12)', icon: '🏅' },
};

const ActivityCard = ({ activity, onDelete }) => {
  const navigate = useNavigate();
  const config = typeConfig[activity.type] || typeConfig.OTHER;
  const hasRecommendation = !!activity.recommendation;

  return (
    <Card
      onClick={() => navigate(`/activities/${activity.id}`)}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 8px 30px ${config.color}15`,
        },
        border: `1px solid ${config.color}20`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                backgroundColor: config.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}
            >
              {config.icon}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {activity.type}
              </Typography>
              <Typography variant="caption" sx={{ color: '#9AA4B2' }}>
                {activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : 'Recent'}
              </Typography>
            </Box>
          </Box>
          {hasRecommendation && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: '20px',
                backgroundColor: 'rgba(124, 255, 79, 0.1)',
                border: '1px solid rgba(124, 255, 79, 0.2)',
              }}
            >
              <Sparkles size={12} color="#7CFF4F" />
              <Typography variant="caption" sx={{ color: '#7CFF4F', fontWeight: 600 }}>
                AI
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Clock size={16} color="#9AA4B2" />
            <Typography variant="body2" sx={{ color: '#9AA4B2' }}>
              {activity.duration} min
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Flame size={16} color="#FF6B6B" />
            <Typography variant="body2" sx={{ color: '#9AA4B2' }}>
              {activity.caloriesBurned} kcal
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: config.color }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              View Details
            </Typography>
            <ChevronRight size={16} />
          </Box>
          <Tooltip title="Delete activity">
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onDelete?.(activity.id); }}
              sx={{ color: '#9AA4B2', '&:hover': { color: '#FF6B6B', backgroundColor: 'rgba(255, 107, 107, 0.1)' } }}
            >
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
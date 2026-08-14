import { Box, Card, CardContent, Typography } from '@mui/material';
import { Flame, Activity, Clock, TrendingUp } from 'lucide-react';

const iconMap = {
  calories: Flame,
  activities: Activity,
  duration: Clock,
  streak: TrendingUp,
};

const accentColorMap = {
  calories: '#FF6B6B',
  activities: '#7CFF4F',
  duration: '#4FD1FF',
  streak: '#FFB84D',
};

const StatCard = ({ title, value, subtitle, type }) => {
  const Icon = iconMap[type] || Activity;
  const accent = accentColorMap[type] || '#7CFF4F';

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#9AA4B2', mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: '#9AA4B2', mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: `${accent}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={24} color={accent} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
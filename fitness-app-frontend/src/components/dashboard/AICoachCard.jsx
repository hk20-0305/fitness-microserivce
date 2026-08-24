import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';

const renderSafeText = (val) => {
  if (val == null) return '';
  if (typeof val === 'string' || typeof val === 'number') return String(val);
  if (typeof val === 'object') {
    if (val.recommendation) return val.area ? `${val.area}: ${val.recommendation}` : val.recommendation;
    if (val.description) return val.workout ? `${val.workout}: ${val.description}` : val.description;
    if (val.text) return val.text;
    if (val.overall) return `Overall: ${val.overall}`;
    return JSON.stringify(val);
  }
  return String(val);
};

const AICoachCard = ({ recommendation }) => {
  const navigate = useNavigate();

  if (!recommendation) {
    return (
      <Card
        sx={{
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(124, 255, 79, 0.03)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Sparkles size={20} color="#7CFF4F" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AI Fitness Coach
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#9AA4B2' }}>
            Complete an activity to receive personalized AI-powered insights and recommendations.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const latestActivity = recommendation.activityType || 'Activity';
  const improvements = Array.isArray(recommendation.improvements) ? recommendation.improvements : [];
  const suggestions = Array.isArray(recommendation.suggestions) ? recommendation.suggestions : [];
  const safety = Array.isArray(recommendation.safety) ? recommendation.safety : [];

  return (
    <Card
      sx={{
        border: '1px solid rgba(124, 255, 79, 0.15)',
        background: 'linear-gradient(180deg, rgba(124, 255, 79, 0.05) 0%, #121821 100%)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: 'rgba(124, 255, 79, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={18} color="#7CFF4F" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            AI Fitness Coach
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#9AA4B2', mb: 1.5 }}>
          Latest activity: <Box component="span" sx={{ color: '#FFFFFF', fontWeight: 500 }}>{latestActivity}</Box>
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          {recommendation.recommendation && (
            <Box>
              <Typography variant="body2" sx={{ color: '#FFFFFF', lineHeight: 1.6 }}>
                {renderSafeText(recommendation.recommendation)}
              </Typography>
            </Box>
          )}
        </Box>

        {(improvements.length > 0 || suggestions.length > 0 || safety.length > 0) && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {improvements.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ color: '#4FD1FF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Improvements
                </Typography>
                <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2, color: '#9AA4B2' }}>
                  {improvements.slice(0, 2).map((item, idx) => (
                    <Typography key={idx} component="li" variant="body2" sx={{ mb: 0.3 }}>
                      {renderSafeText(item)}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
            {safety.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ color: '#FFB84D', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Safety
                </Typography>
                <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2, color: '#9AA4B2' }}>
                  {safety.slice(0, 2).map((item, idx) => (
                    <Typography key={idx} component="li" variant="body2" sx={{ mb: 0.3 }}>
                      {renderSafeText(item)}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <Button
            variant="text"
            endIcon={<ChevronRight size={16} />}
            onClick={() => navigate('/ai-coach')}
            sx={{ color: '#7CFF4F', p: 0, '&:hover': { backgroundColor: 'transparent', opacity: 0.8 } }}
          >
            View full recommendation
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AICoachCard;

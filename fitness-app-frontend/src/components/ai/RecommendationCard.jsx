import { Card, CardContent, Typography, Box, Grid2 } from '@mui/material';
import { Sparkles, CheckCircle, Lightbulb, Shield, Activity } from 'lucide-react';
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

const RecommendationCard = ({ recommendation }) => {
  const navigate = useNavigate();

  if (!recommendation) return null;

  const improvements = Array.isArray(recommendation.improvements) ? recommendation.improvements : [];
  const suggestions = Array.isArray(recommendation.suggestions) ? recommendation.suggestions : [];
  const safety = Array.isArray(recommendation.safety) ? recommendation.safety : [];

  return (
    <Card
      sx={{
        border: '1px solid rgba(124, 255, 79, 0.15)',
        background: 'linear-gradient(180deg, rgba(124, 255, 79, 0.05) 0%, #121821 100%)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': { transform: 'translateY(-2px)' },
      }}
      onClick={() => recommendation.activityId && navigate(`/activities/${recommendation.activityId}`)}
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

        {recommendation.activityType && (
          <Typography variant="body2" sx={{ color: '#9AA4B2', mb: 1.5 }}>
            Latest activity: <Box component="span" sx={{ color: '#FFFFFF', fontWeight: 500 }}>{recommendation.activityType}</Box>
          </Typography>
        )}

        {recommendation.recommendation && (
          <Typography variant="body2" sx={{ color: '#FFFFFF', lineHeight: 1.6, mb: 2 }}>
            {renderSafeText(recommendation.recommendation)}
          </Typography>
        )}

        {(improvements.length > 0 || suggestions.length > 0 || safety.length > 0) && (
          <Grid2 container spacing={2}>
            {improvements.length > 0 && (
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
                    <Lightbulb size={16} color="#4FD1FF" />
                    <Typography variant="caption" sx={{ color: '#4FD1FF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Improvements
                    </Typography>
                  </Box>
                  {improvements.slice(0, 3).map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'flex-start' }}>
                      <Box sx={{ mt: 0.25, flexShrink: 0, display: 'flex' }}>
                        <CheckCircle size={14} color="#4FD1FF" />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#9AA4B2' }}>{renderSafeText(item)}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid2>
            )}

            {suggestions.length > 0 && (
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
                    <Activity size={16} color="#7CFF4F" />
                    <Typography variant="caption" sx={{ color: '#7CFF4F', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Suggestions
                    </Typography>
                  </Box>
                  {suggestions.slice(0, 3).map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'flex-start' }}>
                      <Box sx={{ mt: 0.25, flexShrink: 0, display: 'flex' }}>
                        <CheckCircle size={14} color="#7CFF4F" />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#9AA4B2' }}>{renderSafeText(item)}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid2>
            )}

            {safety.length > 0 && (
              <Grid2 size={{ xs: 12 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
                    <Shield size={16} color="#FFB84D" />
                    <Typography variant="caption" sx={{ color: '#FFB84D', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Safety
                    </Typography>
                  </Box>
                  {safety.slice(0, 3).map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'flex-start' }}>
                      <Box sx={{ mt: 0.25, flexShrink: 0, display: 'flex' }}>
                        <CheckCircle size={14} color="#FFB84D" />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#9AA4B2' }}>{renderSafeText(item)}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid2>
            )}
          </Grid2>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
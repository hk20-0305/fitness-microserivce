import { Box, Card, CardContent, Typography, Grid2, Avatar, Divider } from '@mui/material';
import { User, Mail, Shield, Calendar, Fingerprint } from 'lucide-react';
import { useSelector } from 'react-redux';

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = useSelector((state) => state.auth.userId);

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
          Profile information unavailable
        </Typography>
        <Typography variant="body2" sx={{ color: '#9AA4B2' }}>
          Please sign in again to view your profile.
        </Typography>
      </Box>
    );
  }

  const firstName = user.firstName || user.given_name || '';
  const lastName = user.lastName || user.family_name || '';
  const displayName = `${firstName} ${lastName}`.trim() || user.name || user.email?.split('@')[0] || 'User';
  const email = user.email || '';
  const subject = user.id || user.userId || userId || '';

  const profileItems = [
    {
      title: 'Full Name',
      value: displayName || `${firstName} ${lastName}`.trim() || '—',
      icon: User,
      color: '#7CFF4F',
    },
    {
      title: 'Email',
      value: email || '—',
      icon: Mail,
      color: '#4FD1FF',
    },
    {
      title: 'User ID',
      value: subject ? `${subject.slice(0, 8)}...${subject.slice(-4)}` : '—',
      icon: Fingerprint,
      color: '#B084FF',
    },
    {
      title: 'Role',
      value: 'Authenticated User',
      icon: Shield,
      color: '#FFB84D',
    },
  ];

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Profile
        </Typography>
        <Typography variant="body1" sx={{ color: '#9AA4B2' }}>
          Your account information from secure authentication.
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: '#7CFF4F',
                color: '#0B0F14',
                fontSize: '1.75rem',
                fontWeight: 700,
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {displayName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#9AA4B2' }}>
                {email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid2 container spacing={3}>
            {profileItems.map((item) => {
              const Icon = item.icon;
              return (
                <Grid2 size={{ xs: 12, sm: 6 }} key={item.title}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        backgroundColor: `${item.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} color={item.color} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="caption" sx={{ color: '#9AA4B2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 500, wordBreak: 'break-all' }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                </Grid2>
              );
            })}
          </Grid2>
        </CardContent>
      </Card>

      <Card sx={{ border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Calendar size={18} color="#7CFF4F" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Account
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#9AA4B2' }}>
            Your account profile and fitness data.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
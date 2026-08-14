import { AppBar, IconButton, Toolbar, Typography, useMediaQuery, useTheme, Avatar, Menu, MenuItem, Box } from '@mui/material';
import { Menu as MenuIcon, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const Header = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: '#0B0F14',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={onMenuClick}
              sx={{ color: '#9AA4B2', mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
              {user ? `Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, ${user.name || user.preferred_username || 'User'}` : 'Welcome'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#9AA4B2', fontSize: '0.875rem' }}>
              Ready to improve your fitness today?
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handleProfileClick} sx={{ p: 0, ml: 1 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: '#7CFF4F', color: '#0B0F14', fontWeight: 600 }}>
              {(user?.name || user?.preferred_username || 'U').charAt(0).toUpperCase()}
            </Avatar>
            {!isMobile && <ChevronDown size={16} sx={{ color: '#9AA4B2', ml: -0.5 }} />}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                mt: 1,
                backgroundColor: '#161D27',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                minWidth: 180,
              },
            }}
          >
            <MenuItem onClick={handleCloseMenu} sx={{ color: '#FFFFFF', '&:hover': { backgroundColor: 'rgba(124, 255, 79, 0.1)' } }}>
              <Typography variant="body2">{user?.email}</Typography>
            </MenuItem>
            <MenuItem onClick={() => { handleCloseMenu(); navigate('/profile'); }} sx={{ color: '#9AA4B2' }}>
              Profile
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
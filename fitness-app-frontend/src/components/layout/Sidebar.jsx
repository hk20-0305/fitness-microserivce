import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery, useTheme } from '@mui/material';
import { LayoutDashboard, Activity, Sparkles, User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const drawerWidth = 260;

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Activities', icon: Activity, path: '/activities' },
  { label: 'AI Coach', icon: Sparkles, path: '/ai-coach' },
  { label: 'Profile', icon: User, path: '/profile' },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#7CFF4F', letterSpacing: '-0.02em' }}>
          Fitness Tracker
        </Typography>
        <Typography variant="body2" sx={{ color: '#9AA4B2', mt: 0.5 }}>
          AI Personal Coach
        </Typography>
      </Box>

      <List sx={{ px: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === '/activities' && location.pathname.startsWith('/activities'));
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? 'rgba(124, 255, 79, 0.1)' : 'transparent',
                  color: isActive ? '#7CFF4F' : '#9AA4B2',
                  '&:hover': {
                    backgroundColor: isActive ? 'rgba(124, 255, 79, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  <item.icon size={20} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        {user && (
          <Box sx={{ mb: 2, px: 1 }}>
            <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
              {user.name || user.preferred_username || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#9AA4B2' }}>
              {user.email}
            </Typography>
          </Box>
        )}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: '#9AA4B2' }}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <LogOut size={20} />
            </ListItemIcon>
            <ListItemText primary="Reset Profile" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', borderRight: 'none' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
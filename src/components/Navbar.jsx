import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  FiSearch,
  FiBell,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiMoon,
  FiSun,
  FiMenu,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
} from 'react-icons/fi';
import { MdWarning } from 'react-icons/md';

const Navbar = ({ darkMode, setDarkMode, toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/tenders') return 'Shubhali Tenderlar';
    if (path === '/notifications') return 'Bildirishnomalar';
    if (path === '/analytics/advanced') return 'Kengaytirilgan Tahlil';
    if (path === '/analytics/risk-distribution') return 'Risk Taqsimoti';
    if (path === '/analytics/regional') return 'Hududiy Tahlil';
    if (path === '/analytics/network') return 'Tarmoq Aloqalari';

    if (path === '/settings') return 'Sozlamalar';
    if (path === '/help') return 'Yordam';
    if (path === '/profile') return 'Profil';
    return 'ShafofAI';
  };

  const notifications = [
    { id: 1, type: 'critical', title: 'Yuqori xavfli tender aniqlandi', message: 'TG-2024-0005 tenderi 120 ball bilan yuqori xavf guruhiga kiritildi', time: '2 daqiqa oldin', icon: <MdWarning size={18} />, color: '#f44336', read: false, tenderId: 'TG-2024-0005' },
    { id: 2, type: 'warning', title: 'Narx anomaliyasi', message: 'Toshkent shahar tenderi bozor narxidan 3.2x yuqori', time: '15 daqiqa oldin', icon: <FiAlertTriangle size={18} />, color: '#ff7043', read: false, tenderId: 'TG-2024-0003' },
    { id: 3, type: 'info', title: 'Tizim yangilandi', message: '47 ta yangi tender ma\'lumotlari qo\'shildi', time: '1 soat oldin', icon: <FiInfo size={18} />, color: '#5c9eff', read: true },
    { id: 4, type: 'success', title: 'Tahlil yakunlandi', message: 'Oylik hisobot tayyor', time: '2 soat oldin', icon: <FiCheckCircle size={18} />, color: '#4caf50', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);
  const handleNotifOpen = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/tenders?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleNotificationClick = (notif) => {
    if (notif.tenderId) {
      navigate(`/tender/${notif.tenderId}`);
    }
    handleNotifClose();
  };

  const colors = {
    bgCard: darkMode ? '#182040' : '#ffffff',
    textPrimary: darkMode ? '#e8eaf6' : '#0f172a',
    textSecondary: darkMode ? '#8892b0' : '#475569',
    border: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    blue: darkMode ? '#5c9eff' : '#168aad',
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: colors.bgCard,
        boxShadow: 'none',
        borderBottom: `1px solid ${colors.border}`,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        left: !isMobile ? (isSidebarOpen ? 260 : 72) : 0,
        width: !isMobile 
          ? (isSidebarOpen ? `calc(100% - 260px)` : `calc(100% - 72px)`)
          : '100%',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: '64px !important', px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={toggleSidebar} sx={{ color: colors.textSecondary, '&:focus': { outline: 'none' } }}>
            <FiMenu size={22} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.25rem' }, color: colors.textPrimary, display: { xs: 'none', sm: 'block' } }}>
            {getPageTitle()}
          </Typography>
        </Box>

        {!isMobile && (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', maxWidth: 500, mx: 2 }}>
            <TextField
              size="small"
              placeholder="Tender qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: alpha(colors.textPrimary, 0.03),
                  borderRadius: '12px',
                  '& fieldset': { borderColor: colors.border },
                  '&:hover fieldset': { borderColor: colors.blue },
                  '&.Mui-focused fieldset': { borderColor: colors.blue },
                },
                '& .MuiInputBase-input': {
                  color: colors.textPrimary,
                  fontSize: '0.9rem',
                  py: 0.75,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiSearch size={18} style={{ color: colors.textSecondary }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={darkMode ? 'Yorug\' rejim' : 'Qorong\'u rejim'}>
            <IconButton onClick={handleThemeToggle} sx={{ color: colors.textSecondary, '&:focus': { outline: 'none' } }}>
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Bildirishnomalar">
            <IconButton onClick={handleNotifOpen} sx={{ color: colors.textSecondary, position: 'relative', '&:focus': { outline: 'none' } }}>
              <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { backgroundColor: '#f44336', color: 'white', fontSize: '10px', height: '18px', minWidth: '18px', borderRadius: '10px' } }}>
                <FiBell size={20} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Profil">
            <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0, '&:focus': { outline: 'none' } }}>
              <Avatar sx={{ width: 36, height: 36, background: `linear-gradient(135deg, ${colors.blue}, #ab47bc)`, fontSize: '0.9rem', fontWeight: 600 }}>AS</Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} slotProps={{ paper: { sx: { mt: 1, minWidth: 220, bgcolor: darkMode ? '#141d35' : '#ffffff', borderRadius: '12px', border: `1px solid ${colors.border}` } } }}>
          <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${colors.border}` }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.textPrimary }}>Admin User</Typography>
            <Typography variant="caption" sx={{ color: colors.textSecondary }}>admin@shafof.uz</Typography>
          </Box>
          <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }} sx={{ gap: 1.5, py: 1 }}><FiUser size={16} style={{ color: colors.textSecondary }} /><Typography variant="body2" sx={{ color: colors.textPrimary }}>Profil</Typography></MenuItem>
          <MenuItem onClick={() => { navigate('/settings'); handleProfileMenuClose(); }} sx={{ gap: 1.5, py: 1 }}><FiSettings size={16} style={{ color: colors.textSecondary }} /><Typography variant="body2" sx={{ color: colors.textPrimary }}>Sozlamalar</Typography></MenuItem>
          <MenuItem onClick={() => { navigate('/help'); handleProfileMenuClose(); }} sx={{ gap: 1.5, py: 1 }}><FiHelpCircle size={16} style={{ color: colors.textSecondary }} /><Typography variant="body2" sx={{ color: colors.textPrimary }}>Yordam</Typography></MenuItem>
          <Divider sx={{ borderColor: colors.border }} />
          <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1 }}><FiLogOut size={16} style={{ color: '#f44336' }} /><Typography variant="body2" sx={{ color: '#f44336' }}>Chiqish</Typography></MenuItem>
        </Menu>

        {/* Notifications Popover */}
        <Popover open={Boolean(notifAnchorEl)} anchorEl={notifAnchorEl} onClose={handleNotifClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} slotProps={{ paper: { sx: { mt: 1, width: 360, maxHeight: 480, bgcolor: darkMode ? '#141d35' : '#ffffff', borderRadius: '12px', border: `1px solid ${colors.border}` } } }}>
          <Box sx={{ p: 2, borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.textPrimary }}>Bildirishnomalar</Typography>
            <Button size="small" sx={{ textTransform: 'none', color: colors.blue, fontSize: '0.75rem' }} onClick={() => { navigate('/notifications'); handleNotifClose(); }}>Barchasini ko'rish</Button>
          </Box>
          <List sx={{ p: 0 }}>
            {notifications.map((notif, index) => (
              <React.Fragment key={notif.id}>
                <ListItem button onClick={() => handleNotificationClick(notif)} sx={{ px: 2, py: 1.5, backgroundColor: !notif.read ? alpha(notif.color, 0.08) : 'transparent', '&:hover': { backgroundColor: alpha(notif.color, 0.05) } }}>
                  <ListItemAvatar><Avatar sx={{ bgcolor: alpha(notif.color, 0.15), color: notif.color, width: 36, height: 36 }}>{notif.icon}</Avatar></ListItemAvatar>
                  <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary, mb: 0.5 }}>{notif.title}</Typography>} secondary={<><Typography variant="caption" sx={{ color: colors.textSecondary, display: 'block', mb: 0.5 }}>{notif.message}</Typography><Typography variant="caption" sx={{ color: colors.textSecondary, fontSize: '0.65rem' }}>{notif.time}</Typography></>} />
                  {!notif.read && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: notif.color, ml: 1 }} />}
                </ListItem>
                {index < notifications.length - 1 && <Divider sx={{ borderColor: colors.border }} />}
              </React.Fragment>
            ))}
          </List>
        </Popover>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
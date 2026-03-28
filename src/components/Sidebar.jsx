import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Collapse,
  useTheme,
  useMediaQuery,
  SwipeableDrawer,
  Stack,
  Chip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  FiHome,
  FiAlertTriangle,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiHelpCircle,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiTrendingUp,
  FiPieChart,
  FiMap,
  FiShare2,
  FiZap,
  FiMoon,
  FiSun,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { MdAnalytics, MdOutlineWork } from 'react-icons/md';

// Light mode colors
const lightColors = {
  bgBase: '#f8fafc',
  bgSurface: '#ffffff',
  bgElevated: '#f1f5f9',
  bgCard: '#ffffff',
  bgCardHover: '#f8fafc',
  border: 'rgba(0, 0, 0, 0.08)',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  red: '#f44336',
  orange: '#ff7043',
  green: '#4caf50',
  blue: '#168aad',
  purple: '#ab47bc',
};

// Dark mode colors
const darkColors = {
  bgBase: '#0a0e1a',
  bgSurface: '#0f1629',
  bgElevated: '#141d35',
  bgCard: '#182040',
  bgCardHover: '#1e2a50',
  border: 'rgba(255, 255, 255, 0.07)',
  textPrimary: '#e8eaf6',
  textSecondary: '#8892b0',
  red: '#f44336',
  orange: '#ff7043',
  green: '#4caf50',
  blue: '#5c9eff',
  purple: '#ab47bc',
};

const Sidebar = ({ darkMode, setDarkMode, isOpen, onToggle }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState({});

  const colors = darkMode ? darkColors : lightColors;
  const drawerWidth = 260;
  const collapsedWidth = 72;

  // Use external open state if provided, otherwise use internal state
  const isDrawerOpen = isOpen !== undefined ? isOpen : sidebarOpen;
  
  const handleDrawerToggle = () => {
    if (onToggle) {
      onToggle();
    } else if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleSubmenuToggle = (menuName) => {
    setOpenSubmenu((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleAvatarClose = () => setAnchorEl(null);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  const menuItems = [
    { text: 'Asosiy', icon: <FiHome size={20} />, path: '/', exact: true },
    { text: 'Shubhali Tenderlar', icon: <FiAlertTriangle size={20} />, path: '/tenders', badge: 247, badgeColor: colors.red },
    {
      text: 'Tahlil',
      icon: <FiBarChart2 size={20} />,
      children: [
        { text: 'Kengaytirilgan Tahlil', icon: <MdAnalytics size={18} />, path: '/analytics/advanced' },
        { text: 'Risk Taqsimoti', icon: <FiPieChart size={18} />, path: '/analytics/risk-distribution' },
        { text: 'Hududiy Tahlil', icon: <FiMap size={18} />, path: '/analytics/regional' },
        { text: 'Tarmoq Aloqalari', icon: <FiShare2 size={18} />, path: '/analytics/network' },
      ],
    },
    
    { text: 'Bildirishnomalar', icon: <FiBell size={20} />, path: '/notifications', badge: 12, badgeColor: colors.orange },
    { text: 'Sozlamalar', icon: <FiSettings size={20} />, path: '/settings' },
    { text: 'Yordam', icon: <FiHelpCircle size={20} />, path: '/help' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return window.location.pathname === path;
    return window.location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: colors.bgSurface, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ 
        p: isDrawerOpen ? 2.5 : 1.5, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isDrawerOpen ? 'space-between' : 'center', 
        borderBottom: `1px solid ${colors.border}`, 
        mb: 2,
        flexShrink: 0
      }}>
        {isDrawerOpen && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '12px', 
              background: `linear-gradient(135deg, ${colors.blue}, ${colors.purple})`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: `0 4px 12px ${alpha(colors.blue, 0.3)}` 
            }}>
              <FiZap size={22} color="white" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: colors.textPrimary }}>
                ShafofAI
              </Typography>
              <Typography variant="caption" sx={{ color: colors.textSecondary, fontSize: '10px' }}>
                Tender Monitoring
              </Typography>
            </Box>
          </Box>
        )}
        <IconButton 
          onClick={handleDrawerToggle} 
          sx={{ 
            color: colors.textSecondary,
            '&:focus': { outline: 'none' }
          }}
        >
          {isDrawerOpen ? <FiChevronLeft size={20} /> : <FiMenu size={20} />}
        </IconButton>
      </Box>

      {/* Navigation */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        px: isDrawerOpen ? 1.5 : 0.5,
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: colors.border,
          borderRadius: '4px',
        },
      }}>
        <List sx={{ px: 0 }}>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={!isDrawerOpen ? item.text : ''} placement="right" arrow>
                  <ListItemButton 
                    onClick={() => item.children ? handleSubmenuToggle(item.text) : handleNavigation(item.path)} 
                    selected={item.children ? false : isActive(item.path, item.exact)} 
                    sx={{ 
                      borderRadius: '12px', 
                      mx: isDrawerOpen ? 0 : 'auto', 
                      width: isDrawerOpen ? 'auto' : '100%', 
                      justifyContent: isDrawerOpen ? 'initial' : 'center', 
                      px: isDrawerOpen ? 2 : 1.5, 
                      py: 1.2,
                      transition: 'all 0.2s ease',
                      '&:active': { outline: 'none' },
                      '&:focus': { outline: 'none' },
                      '&.Mui-selected': { 
                        bgcolor: alpha(colors.blue, darkMode ? 0.12 : 0.08),
                        '&:hover': { bgcolor: alpha(colors.blue, darkMode ? 0.2 : 0.12) },
                        '& .MuiListItemIcon-root': { color: colors.blue },
                        '& .MuiListItemText-primary': { color: colors.blue, fontWeight: 600 }
                      },
                      '&:hover': { bgcolor: alpha(colors.textPrimary, darkMode ? 0.05 : 0.03) }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: isDrawerOpen ? 2 : 'auto', justifyContent: 'center', color: isActive(item.path, item.exact) ? colors.blue : colors.textSecondary }}>
                      {item.icon}
                    </ListItemIcon>
                    {isDrawerOpen && (
                      <>
                        <ListItemText 
                          primary={item.text} 
                          primaryTypographyProps={{ 
                            fontSize: '0.9rem', 
                            fontWeight: isActive(item.path, item.exact) ? 600 : 500, 
                            color: colors.textPrimary 
                          }} 
                        />
                        {item.badge && (
                          <Chip 
                            label={item.badge} 
                            size="small" 
                            sx={{ 
                              height: 22, 
                              fontSize: '0.7rem', 
                              fontWeight: 600, 
                              bgcolor: alpha(item.badgeColor, darkMode ? 0.15 : 0.1), 
                              color: item.badgeColor 
                            }} 
                          />
                        )}
                        {item.children && (
                          <Box component="span" sx={{ ml: 'auto', color: colors.textSecondary }}>
                            {openSubmenu[item.text] ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                          </Box>
                        )}
                      </>
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
              {item.children && (
                <Collapse in={openSubmenu[item.text]} timeout="auto">
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItem key={child.text} disablePadding sx={{ pl: isDrawerOpen ? 5 : 0, mb: 0.5 }}>
                        <Tooltip title={!isDrawerOpen ? child.text : ''} placement="right" arrow>
                          <ListItemButton 
                            onClick={() => handleNavigation(child.path)} 
                            selected={isActive(child.path)} 
                            sx={{ 
                              borderRadius: '12px', 
                              mx: isDrawerOpen ? 0 : 'auto', 
                              width: isDrawerOpen ? 'auto' : '100%', 
                              justifyContent: isDrawerOpen ? 'initial' : 'center', 
                              px: isDrawerOpen ? 2 : 1.5, 
                              py: 1,
                              transition: 'all 0.2s ease',
                              '&:active': { outline: 'none' },
                              '&:focus': { outline: 'none' },
                              '&.Mui-selected': { 
                                bgcolor: alpha(colors.orange, darkMode ? 0.12 : 0.08),
                                '& .MuiListItemIcon-root': { color: colors.orange }
                              }
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 0, mr: isDrawerOpen ? 2 : 'auto', justifyContent: 'center', color: isActive(child.path) ? colors.orange : colors.textSecondary }}>
                              {child.icon}
                            </ListItemIcon>
                            {isDrawerOpen && (
                              <ListItemText 
                                primary={child.text} 
                                primaryTypographyProps={{ 
                                  fontSize: '0.85rem', 
                                  color: colors.textPrimary 
                                }} 
                              />
                            )}
                          </ListItemButton>
                        </Tooltip>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        p: isDrawerOpen ? 2 : 1, 
        mt: 'auto', 
        borderTop: `1px solid ${colors.border}`, 
        bgcolor: colors.bgSurface,
        flexShrink: 0
      }}>
        <Stack spacing={1.5} alignItems={isDrawerOpen ? 'stretch' : 'center'}>
          {/* Profile */}
 

        
          
               <Box 
            onClick={handleAvatarClick}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: isDrawerOpen ? 2 : 1, 
              justifyContent: isDrawerOpen ? 'flex-start' : 'center',
              cursor: 'pointer',
              p: isDrawerOpen ? 1 : 0.5,
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: alpha(colors.textPrimary, darkMode ? 0.05 : 0.03) },
              '&:focus': { outline: 'none' }
            }}
          >
            <Avatar 
              sx={{ 
                width: isDrawerOpen ? 40 : 36, 
                height: isDrawerOpen ? 40 : 36, 
                background: `linear-gradient(135deg, ${colors.blue}, ${colors.purple})`, 
                fontWeight: 'bold', 
                color: 'white',
                fontSize: isDrawerOpen ? 16 : 14
              }}
            >
              AS
            </Avatar>
            {isDrawerOpen && (
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Admin User
                </Typography>
                <Typography variant="caption" sx={{ color: colors.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                  admin@shafof.uz
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </Box>

      {/* User Menu */}
      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={handleAvatarClose} 
        PaperProps={{ 
          sx: { 
            mt: -1, 
            minWidth: 200, 
            bgcolor: colors.bgElevated, 
            borderRadius: '12px', 
            border: `1px solid ${colors.border}`,
            '& .MuiMenuItem-root': {
              color: colors.textPrimary,
            }
          } 
        }}
      >
        <MenuItem onClick={() => { handleNavigation('/profile'); handleAvatarClose(); }} sx={{ gap: 1.5 }}>
          <FiUser size={16} style={{ color: colors.textSecondary }} />
          <span>Profil</span>
        </MenuItem>
        <MenuItem onClick={handleThemeToggle} sx={{ gap: 1.5 }}>
          {darkMode ? <FiSun size={16} style={{ color: colors.textSecondary }} /> : <FiMoon size={16} style={{ color: colors.textSecondary }} />}
          <span>{darkMode ? 'Yorug\' rejim' : 'Qorong\'u rejim'}</span>
        </MenuItem>
        <Divider sx={{ borderColor: colors.border }} />
        <MenuItem onClick={() => { handleNavigation('/logout'); handleAvatarClose(); }} sx={{ gap: 1.5 }}>
          <FiLogOut size={16} style={{ color: colors.red }} />
          <span style={{ color: colors.red }}>Chiqish</span>
        </MenuItem>
      </Menu>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton 
          onClick={handleDrawerToggle} 
          sx={{ 
            position: 'fixed', 
            top: 16, 
            left: 16, 
            zIndex: 1200, 
            bgcolor: colors.bgCard, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:focus': { outline: 'none' },
            color: colors.textPrimary
          }}
        >
          <FiMenu size={22} />
        </IconButton>
        <SwipeableDrawer 
          anchor="left" 
          open={mobileOpen} 
          onClose={() => setMobileOpen(false)} 
          onOpen={() => setMobileOpen(true)} 
          PaperProps={{ 
            sx: { 
              width: drawerWidth, 
              bgcolor: colors.bgSurface, 
              borderRight: `1px solid ${colors.border}` 
            } 
          }}
        >
          {drawerContent}
        </SwipeableDrawer>
      </>
    );
  }

  return (
    <Drawer 
      variant="permanent" 
      sx={{ 
        width: isDrawerOpen ? drawerWidth : collapsedWidth, 
        flexShrink: 0, 
        '& .MuiDrawer-paper': { 
          width: isDrawerOpen ? drawerWidth : collapsedWidth, 
          boxSizing: 'border-box', 
          borderRight: `1px solid ${colors.border}`, 
          bgcolor: colors.bgSurface, 
          transition: theme.transitions.create('width', { 
            easing: theme.transitions.easing.sharp, 
            duration: theme.transitions.duration.enteringScreen 
          }), 
          overflowX: 'hidden',
          outline: 'none'
        } 
      }} 
      open={isDrawerOpen}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
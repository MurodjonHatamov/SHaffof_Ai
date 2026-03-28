import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Checkbox,
  Avatar,
  Tooltip,
  Stack,
  Divider,
  Badge,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Pagination,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  FiBell,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo,
  FiTrash2,
  FiCheck,
  FiSearch,
  FiEye,
  FiClock,
  FiRefreshCw,
  FiDownload,
  FiDatabase,
  FiActivity,
} from 'react-icons/fi';
import {
  MdErrorOutline,
  MdLocationOn,
  MdBusiness,
  MdAttachMoney,
} from 'react-icons/md';
import { FaRobot, FaChartLine } from 'react-icons/fa';

// API base URL
const API_BASE_URL = 'https://shaffofai-production.up.railway.app/api';

// Mock notifications data (fallback when API is unavailable)
const mockNotifications = [
  { id: 'N001', type: 'critical', title: 'Kritik Risk Aniqlandi!', message: 'TG-2024-0001 raqamli tender 3 mezondan 3 tasini ham qondirdi. Risk bali: 120/120.', time: new Date(Date.now() - 5 * 60000).toISOString(), read: false, tenderId: 'TG-2024-0001', icon: 'fas fa-triangle-exclamation', color: '#f44336', tags: [{ text: 'yuqori xavf', class: 'risk-high' }], severityScore: 95 },
  { id: 'N002', type: 'critical', title: 'Narx Anomaliyasi — Katta Summa', message: 'Toshkent shahar Qurilish Boshqarmasi tender summasi bozor narxidan 3.2 marta oshib ketdi.', time: new Date(Date.now() - 15 * 60000).toISOString(), read: false, tenderId: 'TG-2024-0003', icon: 'fas fa-money-bill-wave', color: '#f44336', tags: [{ text: 'narx anomaliyasi', class: 'badge-blue' }], severityScore: 85 },
  { id: 'N003', type: 'critical', title: 'Manzil Moslik Aniqlandi', message: 'Samarqand viloyat tender ishtirokchilari (3 ta kompaniya) bir xil yuridik manzilda ro\'yxatdan o\'tgan.', time: new Date(Date.now() - 30 * 60000).toISOString(), read: false, tenderId: 'TG-2024-0007', icon: 'fas fa-location-dot', color: '#f44336', tags: [{ text: 'manzil moslik', class: 'badge-blue' }], severityScore: 90 },
  { id: 'N004', type: 'critical', title: 'Yangi Tashkil Etilgan Firma', message: 'G\'olib kompaniya atigi 2 oy oldin ro\'yxatdan o\'tgan. 1.2 mlrd so\'mlik qurilish tenderi shubha ostida.', time: new Date(Date.now() - 2 * 60 * 60000).toISOString(), read: false, tenderId: 'TG-2024-0012', icon: 'fas fa-building', color: '#f44336', tags: [{ text: 'yangi kompaniya', class: 'badge-blue' }], severityScore: 80 },
  { id: 'N005', type: 'warning', title: 'O\'rtacha Risk — Kuzatuvda', message: 'Farg\'ona viloyat ta\'lim departamentining 3 ta tenderi o\'rtacha risk zonasiga tushdi.', time: new Date(Date.now() - 3 * 60 * 60000).toISOString(), read: true, tenderId: null, icon: 'fas fa-circle-exclamation', color: '#ff7043', tags: [{ text: 'o\'rtacha xavf', class: 'risk-medium' }], severityScore: 55 },
  { id: 'N006', type: 'info', title: 'Tizim Yangilandi', message: 'Har 30 daqiqalik ma\'lumot yig\'ish siklida 47 ta yangi tender qo\'shildi.', time: new Date(Date.now() - 5 * 60 * 60000).toISOString(), read: true, tenderId: null, icon: 'fas fa-rotate', color: '#5c9eff', tags: [{ text: '+47 yangi', class: 'badge-green' }], severityScore: 20 },
  { id: 'N007', type: 'success', title: 'AI Model Yangilandi', message: 'Sun\'iy intellekt modeli yangi ma\'lumotlar bilan qayta o\'qitildi. Aniqlik darajasi 94.2% ga yetdi.', time: new Date(Date.now() - 24 * 60 * 60000).toISOString(), read: false, tenderId: null, icon: 'fas fa-robot', color: '#4caf50', tags: [{ text: 'AI', class: 'badge-blue' }], severityScore: 30 },
];

const notificationTypes = {
  critical: { label: 'Kritik', color: '#f44336', bg: 'rgba(244, 67, 54, 0.12)', icon: <MdErrorOutline /> },
  warning: { label: 'Ogohlantirish', color: '#ff7043', bg: 'rgba(255, 112, 67, 0.12)', icon: <FiAlertTriangle /> },
  info: { label: 'Ma\'lumot', color: '#5c9eff', bg: 'rgba(92, 158, 255, 0.12)', icon: <FiInfo /> },
  success: { label: 'Muvaffaqiyat', color: '#4caf50', bg: 'rgba(76, 175, 80, 0.12)', icon: <FiCheckCircle /> },
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'hozirgina';
  if (diffMins < 60) return `${diffMins} daqiqa oldin`;
  if (diffHours < 24) return `${diffHours} soat oldin`;
  if (diffDays < 7) return `${diffDays} kun oldin`;
  return date.toLocaleDateString('uz-UZ');
};

const getIconComponent = (iconName) => {
  if (iconName === 'fas fa-triangle-exclamation') return <MdErrorOutline size={20} />;
  if (iconName === 'fas fa-money-bill-wave') return <MdAttachMoney size={20} />;
  if (iconName === 'fas fa-location-dot') return <MdLocationOn size={20} />;
  if (iconName === 'fas fa-building') return <MdBusiness size={20} />;
  if (iconName === 'fas fa-circle-exclamation') return <FiAlertTriangle size={20} />;
  if (iconName === 'fas fa-rotate') return <FiRefreshCw size={20} />;
  if (iconName === 'fas fa-robot') return <FaRobot size={20} />;
  if (iconName === 'fas fa-database') return <FiDatabase size={20} />;
  return <FiBell size={20} />;
};

function Notifications({ darkMode }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotifs, setSelectedNotifs] = useState([]);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const itemsPerPage = 10;

  const colors = {
    bgCard: darkMode ? '#182040' : '#ffffff',
    textPrimary: darkMode ? '#e8eaf6' : '#0f172a',
    textSecondary: darkMode ? '#8892b0' : '#475569',
    border: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    blue: darkMode ? '#5c9eff' : '#168aad',
    green: '#4caf50',
    red: '#f44336',
    orange: '#ff7043',
  };

  // Fetch notifications from API
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/`);
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      const data = await response.json();
      
      // Transform API data to component format
      const transformedData = data.map(notif => ({
        ...notif,
        type: notif.type || 'info',
        read: notif.unread === false,
        tenderId: notif.tender,
        icon: getIconComponent(notif.icon),
        color: notif.type === 'critical' ? '#f44336' : notif.type === 'warning' ? '#ff7043' : notif.type === 'success' ? '#4caf50' : '#5c9eff',
        message: notif.desc,
        time: notif.time === 'Yaqinda' ? new Date().toISOString() : notif.time,
      }));
      
      setNotifications(transformedData);
      setApiError(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setApiError(true);
      // Fallback to mock data
      const mockWithCurrentTime = mockNotifications.map(n => ({
        ...n,
        icon: getIconComponent(n.icon),
        message: n.message,
      }));
      setNotifications(mockWithCurrentTime);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 300000);
    
    return () => clearInterval(interval);
  }, []);

  // Generate random notification for demo (when API returns empty)
  const generateRandomNotification = () => {
    const types = ['critical', 'warning', 'info', 'success'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const messages = {
      critical: { title: 'Yangi yuqori xavfli tender aniqlandi', message: 'TG-2024-' + Math.floor(Math.random() * 9000 + 1000) + ' tenderi yuqori xavf guruhiga kiritildi.', severityScore: 85 + Math.random() * 35 },
      warning: { title: 'Narx anomaliyasi', message: 'Tender summasi bozor narxidan ' + (2 + Math.random() * 2).toFixed(1) + 'x yuqori aniqlandi.', severityScore: 40 + Math.random() * 40 },
      info: { title: 'Tizim yangilandi', message: Math.floor(Math.random() * 50 + 10) + ' ta yangi tender ma\'lumotlari qo\'shildi.', severityScore: 10 + Math.random() * 20 },
      success: { title: 'Tahlil yakunlandi', message: 'Haftalik risk tahlili muvaffaqiyatli yakunlandi.', severityScore: 15 + Math.random() * 15 },
    };
    
    const newNotif = {
      id: 'N' + Date.now() + Math.random(),
      type: randomType,
      title: messages[randomType].title,
      message: messages[randomType].message,
      time: new Date().toISOString(),
      read: false,
      tenderId: randomType === 'critical' || randomType === 'warning' ? 'TG-2024-' + Math.floor(Math.random() * 9000 + 1000) : null,
      icon: getIconComponent(randomType === 'critical' ? 'fas fa-triangle-exclamation' : randomType === 'warning' ? 'fas fa-circle-exclamation' : randomType === 'info' ? 'fas fa-rotate' : 'fas fa-check-circle'),
      color: randomType === 'critical' ? '#f44336' : randomType === 'warning' ? '#ff7043' : randomType === 'info' ? '#5c9eff' : '#4caf50',
      tags: [{ text: randomType === 'critical' ? 'yuqori xavf' : randomType === 'warning' ? 'ogohlantirish' : randomType === 'info' ? 'yangilik' : 'muvaffaqiyat', class: 'badge-' + randomType }],
      severityScore: messages[randomType].severityScore,
    };
    
    setNotifications(prev => [newNotif, ...prev]);
    setSnackbar({ open: true, message: 'Yangi bildirishnoma keldi!', severity: 'info' });
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setSnackbar({ open: true, message: 'Bildirishnoma o\'qilgan deb belgilandi', severity: 'success' });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setSelectedNotifs([]);
    setSnackbar({ open: true, message: 'Barcha bildirishnomalar o\'qilgan deb belgilandi', severity: 'success' });
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setSelectedNotifs(prev => prev.filter(nid => nid !== id));
    setSnackbar({ open: true, message: 'Bildirishnoma o\'chirildi', severity: 'info' });
  };

  const handleDeleteSelected = () => {
    setNotifications(prev => prev.filter(n => !selectedNotifs.includes(n.id)));
    setSelectedNotifs([]);
    setSnackbar({ open: true, message: `${selectedNotifs.length} ta bildirishnoma o\'chirildi`, severity: 'info' });
  };

  const handleSelectAll = () => {
    if (selectedNotifs.length === paginatedNotifs.length) setSelectedNotifs([]);
    else setSelectedNotifs(paginatedNotifs.map(n => n.id));
  };

  const handleSelect = (id) => {
    if (selectedNotifs.includes(id)) setSelectedNotifs(prev => prev.filter(n => n !== id));
    else setSelectedNotifs(prev => [...prev, id]);
  };

  const handleMarkSelectedAsRead = () => {
    setNotifications(prev => prev.map(n => selectedNotifs.includes(n.id) ? { ...n, read: true } : n));
    setSelectedNotifs([]);
    setSnackbar({ open: true, message: `${selectedNotifs.length} ta bildirishnoma o\'qilgan deb belgilandi`, severity: 'success' });
  };

  const handleRefresh = () => {
    fetchNotifications();
    setSnackbar({ open: true, message: 'Bildirishnomalar yangilandi', severity: 'success' });
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    const types = ['all', 'critical', 'warning', 'info', 'success'];
    setSelectedType(types[newValue]);
    setPage(1);
  };

  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];
    if (selectedType !== 'all') filtered = filtered.filter(n => n.type === selectedType);
    if (searchQuery) filtered = filtered.filter(n => 
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      n.message?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (n.tenderId && n.tenderId.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    filtered.sort((a, b) => new Date(b.time) - new Date(a.time));
    return filtered;
  }, [notifications, selectedType, searchQuery]);

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifs = filteredNotifications.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.type === 'critical' && !n.read).length;

  const getNotificationIcon = (type, icon) => {
    if (icon) return icon;
    switch(type) {
      case 'critical': return <MdErrorOutline size={20} />;
      case 'warning': return <FiAlertTriangle size={20} />;
      case 'info': return <FiInfo size={20} />;
      case 'success': return <FiCheckCircle size={20} />;
      default: return <FiBell size={20} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: colors.blue }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh', width: '100%' }}>
      {/* Header with Stats */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Paper sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1.5, bgcolor: alpha(colors.red, 0.08), borderRadius: 2 }}>
            <Box><Typography variant="caption" sx={{ color: colors.textSecondary }}>O'qilmagan</Typography><Typography variant="h6" sx={{ color: colors.red, fontWeight: 600 }}>{unreadCount}</Typography></Box>
            <Box sx={{ width: 1, height: 30, bgcolor: colors.border }} />
            <Box><Typography variant="caption" sx={{ color: colors.textSecondary }}>Kritik</Typography><Typography variant="h6" sx={{ color: colors.orange, fontWeight: 600 }}>{criticalCount}</Typography></Box>
          </Paper>
          {apiError && (
            <Chip icon={<FiDatabase size={14} />} label="API ulanmadi, demo ma'lumotlar ko'rsatilmoqda" size="small" sx={{ bgcolor: alpha(colors.orange, 0.1), color: colors.orange }} />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<FiRefreshCw />} onClick={handleRefresh} sx={{ textTransform: 'none', borderRadius: 2 }}>Yangilash</Button>
          <Button variant="contained" startIcon={<FiCheck />} onClick={handleMarkAllAsRead} sx={{ textTransform: 'none', borderRadius: 2, bgcolor: colors.blue }}>Barchasini o'qildi</Button>
          {selectedNotifs.length > 0 && (
            <Button variant="outlined" startIcon={<FiTrash2 />} onClick={handleDeleteSelected} sx={{ textTransform: 'none', borderRadius: 2, color: colors.red, borderColor: colors.red }}>O'chirish ({selectedNotifs.length})</Button>
          )}
        </Box>
      </Box>

      {/* Live Indicator */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: alpha(colors.green, 0.08), border: `1px solid ${alpha(colors.green, 0.2)}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: colors.green, animation: 'pulse 1.5s infinite' }} />
            <Typography variant="body2" sx={{ fontWeight: 500, color: colors.textPrimary }}>Jonli kuzatuv faol</Typography>
          </Box>
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>Ma'lumotlar har 30 soniyada yangilanadi</Typography>
          <Button size="small" startIcon={<FiActivity />} onClick={generateRandomNotification} sx={{ textTransform: 'none', color: colors.blue }}>Test bildirishnoma</Button>
        </Box>
        <Typography variant="caption" sx={{ color: colors.textSecondary }}>Oxirgi yangilanish: {formatTime(new Date().toISOString())}</Typography>
      </Paper>

      {/* Search */}
      <Card sx={{ borderRadius: 1, mb: 3, bgcolor: colors.bgCard }}>
        <CardContent sx={{ p: 3 }}>
          <TextField 
            size="small" 
            placeholder="Bildirishnomalarni qidirish..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            sx={{ width: '100%' }} 
            slotProps={{ 
              input: { 
                startAdornment: (<InputAdornment position="start"><FiSearch size={18} style={{ color: colors.textSecondary }} /></InputAdornment>), 
                sx: { bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 2 } 
              } 
            }} 
          />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3, borderBottom: `1px solid ${colors.border}`, '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, color: colors.textSecondary }, '& .Mui-selected': { color: colors.blue }, '& .MuiTabs-indicator': { bgcolor: colors.blue } }}>
        <Tab label={`Barcha (${filteredNotifications.length})`} />
        <Tab label={`Kritik (${notifications.filter(n => n.type === 'critical').length})`} />
        <Tab label={`Ogohlantirish (${notifications.filter(n => n.type === 'warning').length})`} />
        <Tab label={`Ma'lumot (${notifications.filter(n => n.type === 'info').length})`} />
        <Tab label={`Muvaffaqiyat (${notifications.filter(n => n.type === 'success').length})`} />
      </Tabs>

      {/* Select All Bar */}
      {paginatedNotifs.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Checkbox checked={selectedNotifs.length === paginatedNotifs.length && paginatedNotifs.length > 0} indeterminate={selectedNotifs.length > 0 && selectedNotifs.length < paginatedNotifs.length} onChange={handleSelectAll} sx={{ color: colors.textSecondary }} />
          <Typography variant="body2" sx={{ color: colors.textSecondary }}>{selectedNotifs.length} ta tanlangan</Typography>
          {selectedNotifs.length > 0 && (
            <Button size="small" startIcon={<FiCheck />} onClick={handleMarkSelectedAsRead} sx={{ textTransform: 'none' }}>O'qilgan deb belgilash</Button>
          )}
        </Box>
      )}

      {/* Notifications List */}
      <Card sx={{ borderRadius: 1, bgcolor: colors.bgCard, overflow: 'hidden' }}>
        {paginatedNotifs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <FiBell size={48} style={{ color: colors.textSecondary, opacity: 0.5, marginBottom: 16 }} />
            <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 1 }}>Bildirishnomalar yo'q</Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>Yangi bildirishnomalar kelganda bu yerda ko'rinadi</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {paginatedNotifs.map((notif, index) => {
              const typeConfig = notificationTypes[notif.type] || notificationTypes.info;
              const isSelected = selectedNotifs.includes(notif.id);
              const severityColor = notif.severityScore >= 80 ? colors.red : notif.severityScore >= 50 ? colors.orange : colors.green;
              
              return (
                <React.Fragment key={notif.id}>
                  <ListItem alignItems="flex-start" sx={{ p: 2, bgcolor: !notif.read ? alpha(typeConfig.color, 0.05) : 'transparent', borderLeft: !notif.read ? `3px solid ${typeConfig.color}` : 'none', transition: 'all 0.2s ease', '&:hover': { bgcolor: alpha(colors.textPrimary, 0.03) } }}>
                    <Checkbox checked={isSelected} onChange={() => handleSelect(notif.id)} sx={{ mr: 1, color: colors.textSecondary }} />
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: alpha(typeConfig.color, 0.15), color: typeConfig.color }}>
                        {getNotificationIcon(notif.type, notif.icon)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.textPrimary }}>{notif.title}</Typography>
                          {!notif.read && <Chip label="Yangi" size="small" sx={{ bgcolor: typeConfig.color, color: 'white', height: 20, fontSize: '0.65rem' }} />}
                          <Chip label={typeConfig.label} size="small" sx={{ bgcolor: typeConfig.bg, color: typeConfig.color, height: 20, fontSize: '0.65rem' }} />
                          <Chip label={`Xavf: ${Math.round(notif.severityScore || 0)}`} size="small" sx={{ bgcolor: alpha(severityColor, 0.15), color: severityColor, height: 20, fontSize: '0.65rem' }} />
                        </Box>
                      } 
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>{notif.message}</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <FiClock size={12} style={{ color: colors.textSecondary }} />
                              <Typography variant="caption" sx={{ color: colors.textSecondary }}>{formatTime(notif.time)}</Typography>
                            </Box>
                            {notif.tags?.map(tag => (
                              <Chip key={tag.text} label={tag.text} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.6rem' }} />
                            ))}
                            {notif.tenderId && (
                              <Button size="small" variant="text" onClick={() => navigate(`/tender/${notif.tenderId}`)} sx={{ textTransform: 'none', color: colors.blue, p: 0, minWidth: 'auto' }}>
                                <FiEye size={14} style={{ marginRight: 4 }} />{notif.tenderId} ni ko'rish
                              </Button>
                            )}
                          </Box>
                        </Box>
                      } 
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!notif.read && (
                        <Tooltip title="O'qildi deb belgilash">
                          <IconButton size="small" onClick={() => handleMarkAsRead(notif.id)} sx={{ color: colors.textSecondary }}>
                            <FiCheck size={18} />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="O'chirish">
                        <IconButton size="small" onClick={() => handleDelete(notif.id)} sx={{ color: colors.textSecondary }}>
                          <FiTrash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                  {index < paginatedNotifs.length - 1 && <Divider sx={{ borderColor: colors.border }} />}
                </React.Fragment>
              );
            })}
          </List>
        )}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, borderTop: `1px solid ${colors.border}` }}>
            <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" sx={{ '& .MuiPaginationItem-root': { color: colors.textSecondary }, '& .Mui-selected': { bgcolor: colors.blue, color: 'white' } }} />
          </Box>
        )}
      </Card>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }`}</style>
    </Box>
  );
}

export default Notifications;
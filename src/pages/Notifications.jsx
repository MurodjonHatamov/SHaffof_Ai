import React, { useState, useMemo } from 'react';
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
} from 'react-icons/fi';
import {
  MdErrorOutline,
  MdLocationOn,
  MdBusiness,
  MdAttachMoney,
} from 'react-icons/md';
import { FaRobot, FaChartLine } from 'react-icons/fa';

// Mock notifications data
const mockNotifications = [
  { id: 'N001', type: 'critical', title: 'Kritik Risk Aniqlandi!', message: 'TG-2024-0001 raqamli tender 3 mezondan 3 tasini ham qondirdi. Risk bali: 120/120.', time: '2024-01-15T08:30:00Z', read: false, tenderId: 'TG-2024-0001', icon: <MdErrorOutline size={20} />, color: '#f44336', tags: ['yuqori xavf'] },
  { id: 'N002', type: 'critical', title: 'Narx Anomaliyasi — Katta Summa', message: 'Toshkent shahar Qurilish Boshqarmasi tender summasi bozor narxidan 3.2 marta oshib ketdi.', time: '2024-01-15T07:45:00Z', read: false, tenderId: 'TG-2024-0003', icon: <MdAttachMoney size={20} />, color: '#f44336', tags: ['narx anomaliyasi'] },
  { id: 'N003', type: 'critical', title: 'Manzil Moslik Aniqlandi', message: 'Samarqand viloyat tender ishtirokchilari (3 ta kompaniya) bir xil yuridik manzilda ro\'yxatdan o\'tgan.', time: '2024-01-15T06:20:00Z', read: false, tenderId: 'TG-2024-0007', icon: <MdLocationOn size={20} />, color: '#f44336', tags: ['manzil moslik'] },
  { id: 'N004', type: 'critical', title: 'Yangi Tashkil Etilgan Firma', message: 'G\'olib kompaniya atigi 2 oy oldin ro\'yxatdan o\'tgan. 1.2 mlrd so\'mlik qurilish tenderi shubha ostida.', time: '2024-01-15T05:10:00Z', read: false, tenderId: 'TG-2024-0012', icon: <MdBusiness size={20} />, color: '#f44336', tags: ['yangi kompaniya'] },
  { id: 'N005', type: 'warning', title: 'O\'rtacha Risk — Kuzatuvda', message: 'Farg\'ona viloyat ta\'lim departamentining 3 ta tenderi o\'rtacha risk zonasiga tushdi.', time: '2024-01-14T18:15:00Z', read: true, tenderId: null, icon: <FiAlertTriangle size={20} />, color: '#ff7043', tags: [] },
  { id: 'N006', type: 'info', title: 'Tizim Yangilandi', message: 'Har 30 daqiqalik ma\'lumot yig\'ish siklida 47 ta yangi tender qo\'shildi.', time: '2024-01-14T08:00:00Z', read: true, tenderId: null, icon: <FiRefreshCw size={20} />, color: '#5c9eff', tags: [] },
  { id: 'N007', type: 'success', title: 'AI Model Yangilandi', message: 'Sun\'iy intellekt modeli yangi ma\'lumotlar bilan qayta o\'qitildi. Aniqlik darajasi 94.2% ga yetdi.', time: '2024-01-13T20:30:00Z', read: false, tenderId: null, icon: <FaRobot size={20} />, color: '#4caf50', tags: ['AI'] },
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

function Notifications({ darkMode }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
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
  };

  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];
    if (selectedType !== 'all') filtered = filtered.filter(n => n.type === selectedType);
    if (searchQuery) filtered = filtered.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.message.toLowerCase().includes(searchQuery.toLowerCase()) || (n.tenderId && n.tenderId.toLowerCase().includes(searchQuery.toLowerCase())));
    filtered.sort((a, b) => new Date(b.time) - new Date(a.time));
    return filtered;
  }, [notifications, selectedType, searchQuery]);

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifs = filteredNotifications.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.type === 'critical' && !n.read).length;

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
    setSnackbar({ open: true, message: 'Bildirishnomalar yangilandi', severity: 'success' });
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    const types = ['all', 'critical', 'warning', 'info', 'success'];
    setSelectedType(types[newValue]);
    setPage(1);
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'critical': return <MdErrorOutline size={20} />;
      case 'warning': return <FiAlertTriangle size={20} />;
      case 'info': return <FiInfo size={20} />;
      case 'success': return <FiCheckCircle size={20} />;
      default: return <FiBell size={20} />;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
       <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    bgcolor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 3,
    px: 2,
    py: 1.5,
    width: "100%",
    maxWidth: 320,
  }}
>
  {/* Chap taraf */}
  <Box sx={{ display: "flex", flexDirection: "column" }}>
    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
      O‘qilmagan
    </Typography>
    <Typography variant="h6" sx={{ color: "#f44336", fontWeight: 600 }}>
      {unreadCount}
    </Typography>
  </Box>

  {/* Divider */}
  <Box
    sx={{
      width: "1px",
      height: 30,
      bgcolor: "rgba(255,255,255,0.1)",
    }}
  />

  {/* O‘ng taraf */}
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    }}
  >
    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
      Kritik
    </Typography>
    <Typography variant="h6" sx={{ color: "#ff7043", fontWeight: 600 }}>
      {criticalCount}
    </Typography>
  </Box>
</Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<FiRefreshCw />} onClick={handleRefresh} sx={{ textTransform: 'none', borderRadius: 2 }}>Yangilash</Button>
          <Button variant="contained" startIcon={<FiCheck />} onClick={handleMarkAllAsRead} sx={{ textTransform: 'none', borderRadius: 2, bgcolor: colors.blue }}>Barchasini o'qildi</Button>
          {selectedNotifs.length > 0 && <Button variant="outlined" startIcon={<FiTrash2 />} onClick={handleDeleteSelected} sx={{ textTransform: 'none', borderRadius: 2, color: '#f44336', borderColor: '#f44336' }}>O'chirish ({selectedNotifs.length})</Button>}
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: alpha(colors.green, 0.08), border: `1px solid ${alpha(colors.green, 0.2)}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: colors.green, animation: 'pulse 1.5s infinite' }} />
            <Typography variant="body2" sx={{ fontWeight: 500, color: colors.textPrimary }}>Jonli kuzatuv faol</Typography>
          </Box>
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>Ma'lumotlar har 30 soniyada yangilanadi</Typography>
        </Box>
        <Typography variant="caption" sx={{ color: colors.textSecondary }}>Oxirgi yangilanish: {formatTime(new Date().toISOString())}</Typography>
      </Paper>

      <Card sx={{ borderRadius: 1, mb: 3, bgcolor: colors.bgCard,  }}>
        <CardContent sx={{ p: 3 }}>
          <TextField size="small" placeholder="Bildirishnomalarni qidirish..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} sx={{ width: '100%' }} slotProps={{ input: { startAdornment: (<InputAdornment position="start"><FiSearch size={18} style={{ color: colors.textSecondary }} /></InputAdornment>), sx: { bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 2 } } }} />
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3, borderBottom: `1px solid ${colors.border}`, '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, color: colors.textSecondary }, '& .Mui-selected': { color: colors.blue }, '& .MuiTabs-indicator': { bgcolor: colors.blue } }}>
        <Tab label={`Barcha (${filteredNotifications.length})`} />
        <Tab label={`Kritik (${notifications.filter(n => n.type === 'critical').length})`} />
        <Tab label={`Ogohlantirish (${notifications.filter(n => n.type === 'warning').length})`} />
        <Tab label={`Ma'lumot (${notifications.filter(n => n.type === 'info').length})`} />
        <Tab label={`Muvaffaqiyat (${notifications.filter(n => n.type === 'success').length})`} />
      </Tabs>

      {paginatedNotifs.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Checkbox checked={selectedNotifs.length === paginatedNotifs.length && paginatedNotifs.length > 0} indeterminate={selectedNotifs.length > 0 && selectedNotifs.length < paginatedNotifs.length} onChange={handleSelectAll} sx={{ color: colors.textSecondary }} />
          <Typography variant="body2" sx={{ color: colors.textSecondary }}>{selectedNotifs.length} ta tanlangan</Typography>
          {selectedNotifs.length > 0 && <Button size="small" startIcon={<FiCheck />} onClick={handleMarkSelectedAsRead} sx={{ textTransform: 'none' }}>O'qilgan deb belgilash</Button>}
        </Box>
      )}

      <Card sx={{ borderRadius: 1, bgcolor: colors.bgCard, overflow: 'hidden' }}>
        {paginatedNotifs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}><FiBell size={48} style={{ color: colors.textSecondary, opacity: 0.5, marginBottom: 16 }} /><Typography variant="h6" sx={{ color: colors.textPrimary, mb: 1 }}>Bildirishnomalar yo'q</Typography><Typography variant="body2" sx={{ color: colors.textSecondary }}>Yangi bildirishnomalar kelganda bu yerda ko'rinadi</Typography></Box>
        ) : (
          <List sx={{ p: 0 }}>
            {paginatedNotifs.map((notif, index) => {
              const typeConfig = notificationTypes[notif.type];
              const isSelected = selectedNotifs.includes(notif.id);
              return (
                <React.Fragment key={notif.id}>
                  <ListItem alignItems="flex-start" sx={{ p: 2, bgcolor: !notif.read ? alpha(typeConfig.color, 0.05) : 'transparent', borderLeft: !notif.read ? `3px solid ${typeConfig.color}` : 'none', transition: 'all 0.2s ease', '&:hover': { bgcolor: alpha(colors.textPrimary, 0.03) } }}>
                    <Checkbox checked={isSelected} onChange={() => handleSelect(notif.id)} sx={{ mr: 1, color: colors.textSecondary }} />
                    <ListItemAvatar><Avatar sx={{ bgcolor: alpha(typeConfig.color, 0.15), color: typeConfig.color }}>{getNotificationIcon(notif.type)}</Avatar></ListItemAvatar>
                    <ListItemText primary={<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 0.5 }}><Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.textPrimary }}>{notif.title}</Typography>{!notif.read && <Chip label="Yangi" size="small" sx={{ bgcolor: typeConfig.color, color: 'white', height: 20, fontSize: '0.65rem' }} />}<Chip label={typeConfig.label} size="small" sx={{ bgcolor: typeConfig.bg, color: typeConfig.color, height: 20, fontSize: '0.65rem' }} /></Box>} secondary={<Box><Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>{notif.message}</Typography><Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mt: 1 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><FiClock size={12} style={{ color: colors.textSecondary }} /><Typography variant="caption" sx={{ color: colors.textSecondary }}>{formatTime(notif.time)}</Typography></Box>{notif.tags.map(tag => <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.6rem' }} />)}{notif.tenderId && <Button size="small" variant="text" onClick={() => navigate(`/tender/${notif.tenderId}`)} sx={{ textTransform: 'none', color: colors.blue, p: 0, minWidth: 'auto' }}><FiEye size={14} style={{ marginRight: 4 }} />{notif.tenderId} ni ko'rish</Button>}</Box></Box>} />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!notif.read && <Tooltip title="O'qildi deb belgilash"><IconButton size="small" onClick={() => handleMarkAsRead(notif.id)} sx={{ color: colors.textSecondary }}><FiCheck size={18} /></IconButton></Tooltip>}
                      <Tooltip title="O'chirish"><IconButton size="small" onClick={() => handleDelete(notif.id)} sx={{ color: colors.textSecondary }}><FiTrash2 size={18} /></IconButton></Tooltip>
                    </Box>
                  </ListItem>
                  {index < paginatedNotifs.length - 1 && <Divider sx={{ borderColor: colors.border }} />}
                </React.Fragment>
              );
            })}
          </List>
        )}
        {totalPages > 1 && <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, borderTop: `1px solid ${colors.border}` }}><Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" sx={{ '& .MuiPaginationItem-root': { color: colors.textSecondary }, '& .Mui-selected': { bgcolor: colors.blue, color: 'white' } }} /></Box>}
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }`}</style>
    </Box>
  );
}

export default Notifications;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  Slider,
  TextField,
  Button,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  FormHelperText,
  Alert,
  Snackbar,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Paper,
  Tabs,
  Tab,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  Stack,
  Switch as MuiSwitch,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  FiBell,
  FiUser,
  FiLock,
  FiShield,
  FiDatabase,
  FiRefreshCw,
  FiSave,
  FiRotateCcw,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiGlobe,
  FiMonitor,
  FiSmartphone,
  FiSun,
  FiMoon,
  FiTrendingUp,
  FiAlertTriangle,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
  FiDownload,
  FiUpload,
  FiTrash2,
  FiEdit,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiHelpCircle,
} from 'react-icons/fi';
import { MdBusiness, MdLocationOn, MdAttachMoney } from 'react-icons/md';
import { FaRobot, FaChartLine } from 'react-icons/fa';

// Tabs configuration
const tabs = [
  { id: 'general', label: 'Umumiy', icon: <FiSettings size={18} /> },
  { id: 'risk', label: 'Risk Sozlamalari', icon: <FiTrendingUp size={18} /> },
  { id: 'notifications', label: 'Bildirishnomalar', icon: <FiBell size={18} /> },
  { id: 'integrations', label: 'Integratsiyalar', icon: <FiDatabase size={18} /> },
  { id: 'security', label: 'Xavfsizlik', icon: <FiShield size={18} /> },
  { id: 'profile', label: 'Profil', icon: <FiUser size={18} /> },
];

// Risk parameters
const riskParameters = [
  {
    id: 'priceAnomaly',
    name: 'Narx Anomaliyasi',
    icon: <MdAttachMoney size={20} />,
    description: 'Tender summasi bozor narxidan qancha yuqori bo\'lsa, shuncha ball qo\'shiladi',
    default: 40,
    min: 0,
    max: 60,
    step: 5,
    unit: 'ball',
    color: '#f44336',
  },
  {
    id: 'newCompany',
    name: 'Yangi Kompaniya',
    icon: <MdBusiness size={20} />,
    description: '6 oydan kam tashkil etilgan kompaniyalar uchun ball',
    default: 30,
    min: 0,
    max: 50,
    step: 5,
    unit: 'ball',
    color: '#ff7043',
  },
  {
    id: 'addressMatch',
    name: 'Manzil Moslik',
    icon: <MdLocationOn size={20} />,
    description: 'Ishtirokchilar bir xil manzilda ro\'yxatdan o\'tganda qo\'shiladigan ball',
    default: 50,
    min: 0,
    max: 70,
    step: 5,
    unit: 'ball',
    color: '#ab47bc',
  },
];

// Notification channels
const notificationChannels = [
  { id: 'email', name: 'Email', icon: <FiMail size={18} />, description: 'Email orqali bildirishnomalar', default: true },
  { id: 'telegram', name: 'Telegram', icon: <FiMessageSquare size={18} />, description: 'Telegram bot orqali', default: true },
  { id: 'sms', name: 'SMS', icon: <FiPhone size={18} />, description: 'SMS orqali ogohlantirishlar', default: false },
  { id: 'push', name: 'Push', icon: <FiBell size={18} />, description: 'Brauzer push bildirishnomalari', default: true },
];

// Notification types
const notificationTypes = [
  { id: 'critical', name: 'Kritik xavf', color: '#f44336', default: true },
  { id: 'high', name: 'Yuqori xavf', color: '#ff7043', default: true },
  { id: 'medium', name: 'O\'rtacha xavf', color: '#ffb74d', default: true },
  { id: 'low', name: 'Past xavf', color: '#4caf50', default: false },
  { id: 'system', name: 'Tizim xabarlari', color: '#5c9eff', default: true },
  { id: 'report', name: 'Hisobotlar', color: '#9c27b0', default: false },
];

// Language options
const languages = [
  { code: 'uz', name: 'O\'zbekcha', flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

// Theme options
const themeOptions = [
  { id: 'light', name: 'Yorug\'', icon: <FiSun size={20} />, description: 'Yorug\' rejim' },
  { id: 'dark', name: 'Qorong\'u', icon: <FiMoon size={20} />, description: 'Qorong\'u rejim' },
  { id: 'system', name: 'Tizim', icon: <FiMonitor size={20} />, description: 'Tizim sozlamalariga moslash' },
];

function Settings({ darkMode, setDarkMode }) {
  const [activeTab, setActiveTab] = useState(0);
  const [riskValues, setRiskValues] = useState({
    priceAnomaly: riskParameters[0].default,
    newCompany: riskParameters[1].default,
    addressMatch: riskParameters[2].default,
  });
  const [notificationChannelsState, setNotificationChannelsState] = useState(
    notificationChannels.reduce((acc, ch) => ({ ...acc, [ch.id]: ch.default }), {})
  );
  const [notificationTypesState, setNotificationTypesState] = useState(
    notificationTypes.reduce((acc, nt) => ({ ...acc, [nt.id]: nt.default }), {})
  );
  const [language, setLanguage] = useState('uz');
  const [theme, setTheme] = useState(darkMode ? 'dark' : 'light');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(30);
  const [apiKey, setApiKey] = useState('••••••••••••••••');
  const [webhookUrl, setWebhookUrl] = useState('https://api.shafof.uz/webhook');
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@shafof.uz',
    phone: '+998 90 123 45 67',
    company: 'ShafofAI',
    position: 'Administrator',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });
  const [isLoading, setIsLoading] = useState(false);

  const colors = {
    bgCard: darkMode ? '#182040' : '#ffffff',
    textPrimary: darkMode ? '#e8eaf6' : '#0f172a',
    textSecondary: darkMode ? '#8892b0' : '#475569',
    border: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    blue: darkMode ? '#5c9eff' : '#168aad',
    red: '#f44336',
    orange: '#ff7043',
    green: '#4caf50',
    purple: '#ab47bc',
  };

  const handleRiskChange = (param, value) => {
    setRiskValues({ ...riskValues, [param]: value });
  };

  const handleNotificationChannelChange = (channel) => {
    setNotificationChannelsState({ ...notificationChannelsState, [channel]: !notificationChannelsState[channel] });
  };

  const handleNotificationTypeChange = (type) => {
    setNotificationTypesState({ ...notificationTypesState, [type]: !notificationTypesState[type] });
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (newTheme !== 'system') {
      setDarkMode(newTheme === 'dark');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSnackbar({ open: true, message: 'Sozlamalar muvaffaqiyatli saqlandi', severity: 'success' });
  };

  const handleReset = () => {
    setConfirmDialog({
      open: true,
      title: 'Sozlamalarni tiklash',
      message: 'Barcha sozlamalar standart holatga qaytariladi. Davom etishga ishonchingiz komilmi?',
      onConfirm: () => {
        setRiskValues({
          priceAnomaly: riskParameters[0].default,
          newCompany: riskParameters[1].default,
          addressMatch: riskParameters[2].default,
        });
        setNotificationChannelsState(notificationChannels.reduce((acc, ch) => ({ ...acc, [ch.id]: ch.default }), {}));
        setNotificationTypesState(notificationTypes.reduce((acc, nt) => ({ ...acc, [nt.id]: nt.default }), {}));
        setLanguage('uz');
        setTheme(darkMode ? 'dark' : 'light');
        setAutoUpdate(true);
        setUpdateInterval(30);
        setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
        setSnackbar({ open: true, message: 'Sozlamalar standart holatga qaytarildi', severity: 'success' });
      },
    });
  };

  const handleProfileUpdate = () => {
    setSnackbar({ open: true, message: 'Profil ma\'lumotlari yangilandi', severity: 'success' });
  };

  const handleApiKeyRegenerate = () => {
    setConfirmDialog({
      open: true,
      title: 'API kalitni qayta yaratish',
      message: 'Eski API kalit o\'chiriladi va yangi kalit yaratiladi. Bu o\'zgarish tizim integratsiyalariga ta\'sir qilishi mumkin. Davom etasizmi?',
      onConfirm: () => {
        const newKey = 'sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        setApiKey(newKey);
        setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
        setSnackbar({ open: true, message: 'Yangi API kalit yaratildi', severity: 'success' });
      },
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh', width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: colors.textPrimary, mb: 1 }}>
          Sozlamalar
        </Typography>
        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
          Tizim sozlamalarini boshqaring
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          borderBottom: `1px solid ${colors.border}`,
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, color: colors.textSecondary, minHeight: 48 },
          '& .Mui-selected': { color: colors.blue },
          '& .MuiTabs-indicator': { bgcolor: colors.blue },
        }}
      >
        {tabs.map((tab, idx) => (
          <Tab key={tab.id} icon={tab.icon} iconPosition="start" label={tab.label} />
        ))}
      </Tabs>

      {/* General Settings Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Language & Theme */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiGlobe size={20} /> Til va Ko'rinish
                </Typography>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel sx={{ color: colors.textSecondary }}>Til</InputLabel>
                  <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    label="Til"
                    sx={{ bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 1 }}
                  >
                    {languages.map(lang => (
                      <MenuItem key={lang.code} value={lang.code}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{lang.flag}</span> {lang.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography variant="subtitle2" sx={{ color: colors.textPrimary, mb: 1 }}>Ko'rinish rejimi</Typography>
                <RadioGroup row value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
                  {themeOptions.map(opt => (
                    <FormControlLabel
                      key={opt.id}
                      value={opt.id}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {opt.icon}
                          <Typography variant="body2">{opt.name}</Typography>
                        </Box>
                      }
                      sx={{ color: colors.textPrimary }}
                    />
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </Grid>

          {/* Data Update Settings */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiRefreshCw size={20} /> Ma'lumot Yangilanishi
                </Typography>
                <FormControlLabel
                  control={<Switch checked={autoUpdate} onChange={(e) => setAutoUpdate(e.target.checked)} />}
                  label="Avtomatik yangilanish"
                  sx={{ mb: 2, display: 'block' }}
                />
                {autoUpdate && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>Yangilanish oralig'i (soniya)</Typography>
                    <Slider
                      value={updateInterval}
                      onChange={(e, val) => setUpdateInterval(val)}
                      min={10}
                      max={300}
                      step={10}
                      marks={[
                        { value: 10, label: '10s' },
                        { value: 60, label: '1m' },
                        { value: 300, label: '5m' },
                      ]}
                      sx={{ color: colors.blue }}
                    />
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                      Hozirgi: {updateInterval} soniyada bir marta
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Export/Import */}
          <Grid size={{ xs: 12 }}>
            <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiDatabase size={20} /> Ma'lumotlarni Eksport/Import
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" startIcon={<FiDownload />} sx={{ textTransform: 'none' }}>Eksport qilish</Button>
                  <Button variant="outlined" startIcon={<FiUpload />} sx={{ textTransform: 'none' }}>Import qilish</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Risk Settings Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {riskParameters.map((param) => (
            <Grid key={param.id} size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Avatar sx={{ bgcolor: alpha(param.color, 0.15), color: param.color, width: 40, height: 40 }}>
                      {param.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>{param.name}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>{param.description}</Typography>
                  <Typography variant="body2" sx={{ color: colors.textPrimary, mb: 1 }}>Ball: {riskValues[param.id]} {param.unit}</Typography>
                  <Slider
                    value={riskValues[param.id]}
                    onChange={(e, val) => handleRiskChange(param.id, val)}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    marks={[
                      { value: param.min, label: `${param.min}` },
                      { value: param.max, label: `${param.max}` },
                    ]}
                    sx={{ color: param.color }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Chip size="small" label={`Min: ${param.min}`} sx={{ bgcolor: alpha(param.color, 0.1), color: param.color }} />
                    <Chip size="small" label={`Default: ${param.default}`} sx={{ bgcolor: alpha(colors.textSecondary, 0.1) }} />
                    <Chip size="small" label={`Max: ${param.max}`} sx={{ bgcolor: alpha(param.color, 0.1), color: param.color }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid size={{ xs: 12 }}>
            <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2 }}>Risk Hisoblash Namunasi</Typography>
                <Box sx={{ p: 2, bgcolor: alpha(colors.blue, 0.05), borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                    <strong>Misol:</strong> Tender summasi bozor narxidan 2.5x yuqori (+{riskValues.priceAnomaly} ball), 
                    kompaniya 2 oy oldin tashkil etilgan (+{riskValues.newCompany} ball),
                    ishtirokchilar bir xil manzilda (+{riskValues.addressMatch} ball)
                  </Typography>
                  <Divider sx={{ my: 2, borderColor: colors.border }} />
                  <Typography variant="body1" sx={{ fontWeight: 700, color: colors.blue }}>
                    Jami risk ball: {riskValues.priceAnomaly + riskValues.newCompany + riskValues.addressMatch} / 120
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Notifications Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiBell size={20} /> Bildirishnoma Kanallari
                </Typography>
                {notificationChannels.map(channel => (
                  <Box key={channel.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, borderBottom: `1px solid ${colors.border}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: alpha(colors.blue, 0.1), color: colors.blue }}>{channel.icon}</Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>{channel.name}</Typography>
                        <Typography variant="caption" sx={{ color: colors.textSecondary }}>{channel.description}</Typography>
                      </Box>
                    </Box>
                    <Switch checked={notificationChannelsState[channel.id]} onChange={() => handleNotificationChannelChange(channel.id)} />
                  </Box>
                ))}
                {notificationChannelsState.telegram && (
                  <TextField
                    fullWidth
                    size="small"
                    label="Telegram Bot Token"
                    placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                    sx={{ mt: 2 }}
                    InputProps={{ sx: { bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 1 } }}
                  />
                )}
                {notificationChannelsState.sms && (
                  <TextField
                    fullWidth
                    size="small"
                    label="Telefon raqam"
                    placeholder="+998 90 123 45 67"
                    sx={{ mt: 2 }}
                    InputProps={{ sx: { bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 1 } }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiAlertTriangle size={20} /> Bildirishnoma Turlari
                </Typography>
                {notificationTypes.map(type => (
                  <Box key={type.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, borderBottom: `1px solid ${colors.border}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: type.color }} />
                      <Typography variant="body2" sx={{ color: colors.textPrimary }}>{type.name}</Typography>
                    </Box>
                    <Switch checked={notificationTypesState[type.id]} onChange={() => handleNotificationTypeChange(type.id)} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Integrations Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiDatabase size={20} /> API Sozlamalari
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="API Kalit"
                  value={apiKey}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Qayta yaratish">
                          <IconButton size="small" onClick={handleApiKeyRegenerate} edge="end">
                            <FiRefreshCw size={16} />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                    sx: { bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 1, fontFamily: 'monospace' }
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Webhook URL"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  InputProps={{ sx: { bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 1 } }}
                  sx={{ mb: 2 }}
                />
                <Button variant="outlined" startIcon={<FiCheckCircle />} sx={{ textTransform: 'none' }}>Ulanishni test qilish</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaRobot size={20} /> Tashqi Xizmatlar
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, borderBottom: `1px solid ${colors.border}` }}>
                  <Box><Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>xarid.uz API</Typography><Typography variant="caption" sx={{ color: colors.textSecondary }}>Davlat xaridlari ma'lumotlari</Typography></Box>
                  <Switch defaultChecked />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, borderBottom: `1px solid ${colors.border}` }}>
                  <Box><Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>Google Analytics</Typography><Typography variant="caption" sx={{ color: colors.textSecondary }}>Tahlil ma'lumotlari</Typography></Box>
                  <Switch />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
                  <Box><Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>Telegram Bot</Typography><Typography variant="caption" sx={{ color: colors.textSecondary }}>Avtomatik xabarlar</Typography></Box>
                  <Switch defaultChecked />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Security Tab */}
      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiLock size={20} /> Xavfsizlik Sozlamalari
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="Hozirgi parol"
                  type="password"
                  sx={{ mb: 2 }}
                  InputProps={{ sx: { bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 1 } }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Yangi parol"
                  type="password"
                  sx={{ mb: 2 }}
                  InputProps={{ sx: { bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 1 } }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Yangi parolni tasdiqlang"
                  type="password"
                  sx={{ mb: 2 }}
                  InputProps={{ sx: { bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 1 } }}
                />
                <Button variant="contained" sx={{ bgcolor: colors.blue, textTransform: 'none' }}>Parolni yangilash</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiShield size={20} /> Ikki Faktorli Autentifikatsiya
                </Typography>
                <FormControlLabel control={<Switch />} label="2FA ni faollashtirish" sx={{ mb: 2, display: 'block' }} />
                <Alert severity="info" sx={{ mb: 2, borderRadius: 1 }}>
                  2FA faollashtirilganda, tizimga kirishda SMS yoki Authenticator orqali kod talab qilinadi.
                </Alert>
                <Button variant="outlined" startIcon={<FiHelpCircle />} sx={{ textTransform: 'none' }}>2FA sozlamalari</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiTrash2 size={20} /> Xavfli Zona
                </Typography>
                <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
                  Ushbu amallar qaytarib bo'lmaydigan o'zgarishlarga olib kelishi mumkin.
                </Alert>
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" color="error" startIcon={<FiTrash2 />} sx={{ textTransform: 'none' }}>Barcha ma'lumotlarni o'chirish</Button>
                  <Button variant="outlined" color="error" startIcon={<FiXCircle />} sx={{ textTransform: 'none' }}>Hisobni o'chirish</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Profile Tab */}
      {activeTab === 5 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiUser size={20} /> Shaxsiy Ma'lumotlar
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="To'liq ism"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  sx={{ mb: 2 }}
                  InputProps={{ sx: { bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 1 } }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  sx={{ mb: 2 }}
                  InputProps={{ sx: { bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 1 } }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Telefon"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  sx={{ mb: 2 }}
                  InputProps={{ sx: { bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 1 } }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Kompaniya"
                  value={profileData.company}
                  onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                  sx={{ mb: 2 }}
                  InputProps={{ sx: { bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 1 } }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Lavozim"
                  value={profileData.position}
                  onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                  sx={{ mb: 2 }}
                  InputProps={{ sx: { bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 1 } }}
                />
                <Button variant="contained" startIcon={<FiSave />} onClick={handleProfileUpdate} sx={{ bgcolor: colors.blue, textTransform: 'none' }}>Saqlash</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: colors.blue, fontSize: 36 }}>AS</Avatar>
                <Typography variant="h6" sx={{ color: colors.textPrimary }}>{profileData.name}</Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>{profileData.email}</Typography>
                <Button variant="outlined" startIcon={<FiEdit />} sx={{ textTransform: 'none' }}>Rasmni o'zgartirish</Button>
                <Divider sx={{ my: 3, borderColor: colors.border }} />
                <Typography variant="subtitle2" sx={{ color: colors.textPrimary, mb: 1 }}>Aktivlik statistikasi</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                  <Box><Typography variant="h6" sx={{ fontWeight: 700, color: colors.blue }}>247</Typography><Typography variant="caption">Ko'rilgan tenderlar</Typography></Box>
                  <Box><Typography variant="h6" sx={{ fontWeight: 700, color: colors.orange }}>42</Typography><Typography variant="caption">Bayroq qo'yilgan</Typography></Box>
                  <Box><Typography variant="h6" sx={{ fontWeight: 700, color: colors.green }}>12</Typography><Typography variant="caption">Hisobotlar</Typography></Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 2, borderTop: `1px solid ${colors.border}` }}>
        <Button variant="outlined" startIcon={<FiRotateCcw />} onClick={handleReset} sx={{ textTransform: 'none' }}>Standartga qaytarish</Button>
        <Button variant="contained" startIcon={isLoading ? <CircularProgress size={20} /> : <FiSave />} onClick={handleSave} disabled={isLoading} sx={{ bgcolor: colors.blue, textTransform: 'none' }}>Saqlash</Button>
      </Box>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 1 }}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}>
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent><Typography>{confirmDialog.message}</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>Bekor qilish</Button>
          <Button onClick={confirmDialog.onConfirm} color="error" variant="contained">Davom etish</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Settings;
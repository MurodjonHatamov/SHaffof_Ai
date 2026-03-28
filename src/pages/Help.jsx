import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Avatar,
  Divider,
  Link,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Rating,
  TextareaAutosize,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  FiSearch,
  FiHelpCircle,
  FiBookOpen,
  FiVideo,
  FiDownload,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
  FiExternalLink,
  FiChevronRight,
  FiChevronDown,
  FiPlay,
  FiFileText,
  FiLifeBuoy,
  FiAward,
  FiZap,
  FiShield,
  FiTrendingUp,
  FiAlertTriangle,
  FiInfo,
  FiStar,
  FiSend,
  FiUser,
  FiSettings,
  FiBell,
  FiDatabase,
  FiLock,
  FiRefreshCw,
  FiSave,
} from 'react-icons/fi';
import {
  MdWarning,
  MdLocationOn,
  MdBusiness,
  MdAttachMoney,
  MdSchool,
  MdVideoLibrary,
  MdArticle,
} from 'react-icons/md';
import { FaRobot, FaChartLine, FaNetworkWired, FaQuestionCircle } from 'react-icons/fa';

// FAQ Data
const faqCategories = [
  {
    id: 'getting-started',
    name: 'Boshlash',
    icon: <FiZap size={18} />,
    color: '#5c9eff',
    questions: [
      {
        q: 'ShafofAI nima va u qanday ishlaydi?',
        a: 'ShafofAI - davlat xaridlarini monitoring qilish va shubhali tenderlarni aniqlash uchun sun\'iy intellekt asosida ishlaydigan tizim. Tizim xarid.uz platformasidan ma\'lumotlarni yig\'adi, ularni tahlil qiladi va risk bali asosida tenderlarni baholaydi.',
      },
      {
        q: 'Tizimdan qanday foydalanishni boshlash mumkin?',
        a: 'Tizimga kirgandan so\'ng Dashboard sahifasida umumiy statistikalarni ko\'rishingiz mumkin. Shubhali tenderlarni "Shubhali Tenderlar" bo\'limida ko\'rib chiqishingiz, har bir tender haqida batafsil ma\'lumot olish uchun ustiga bosishingiz mumkin.',
      },
      {
        q: 'Tizim qanday tezlikda yangilanadi?',
        a: 'Tizim ma\'lumotlari har 30 soniyada avtomatik ravishda yangilanadi. Sozlamalar bo\'limida yangilanish oralig\'ini o\'zgartirishingiz mumkin.',
      },
    ],
  },
  {
    id: 'risk-analysis',
    name: 'Risk Tahlili',
    icon: <FiTrendingUp size={18} />,
    color: '#ff7043',
    questions: [
      {
        q: 'Risk bali qanday hisoblanadi?',
        a: 'Risk bali uch asosiy mezon asosida hisoblanadi: 1) Narx anomaliyasi - tender summasi bozor narxidan qancha yuqori bo\'lsa, shuncha ball (+40 gacha); 2) Yangi kompaniya - g\'olib kompaniya 6 oydan kam oldin tashkil etilgan bo\'lsa (+30 ball); 3) Manzil moslik - ishtirokchilar bir xil manzilda ro\'yxatdan o\'tgan bo\'lsa (+50 ball).',
      },
      {
        q: 'Risk darajalari nimani anglatadi?',
        a: 'Risk darajalari: Kritik (80-120 ball) - zudlik bilan tekshiruv talab qiladi; Yuqori (60-79 ball) - jiddiy e\'tibor kerak; O\'rtacha (40-59 ball) - kuzatuvda bo\'lishi kerak; Past (0-39 ball) - normal tenderlar.',
      },
      {
        q: 'Narx anomaliyasi qanday aniqlanadi?',
        a: 'Tizim har bir tender uchun bozor o\'rtacha narxini hisoblaydi. Agar tender summasi bozor narxidan 2 barobar yoki undan yuqori bo\'lsa, narx anomaliyasi sifatida belgilanadi va risk baliga qo\'shiladi.',
      },
    ],
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: <FiBookOpen size={18} />,
    color: '#4caf50',
    questions: [
      {
        q: 'Dashboardda qanday ma\'lumotlarni ko\'rishim mumkin?',
        a: 'Dashboardda umumiy statistika (yuqori, o\'rtacha, past xavfli tenderlar soni, jami summa), oylik xavf dinamikasi grafigi, risk taqsimoti, hududlar kesimida risk va eng xavfli shartnomalar ro\'yxatini ko\'rishingiz mumkin.',
      },
      {
        q: 'Grafiklarni filtrlash mumkinmi?',
        a: 'Ha, "Oylik Xavf Dinamikasi" grafigida 12 oy, 6 oy va 3 oy filtrlari mavjud. Shuningdek, "Risk Taqsimoti" donut grafigidagi segmentlarga bosib, o\'rtadagi raqamni o\'zgartirishingiz mumkin.',
      },
    ],
  },
  {
    id: 'tenders',
    name: 'Tenderlar',
    icon: <MdArticle size={18} />,
    color: '#ab47bc',
    questions: [
      {
        q: 'Tenderlarni qanday qidirish va filtrlash mumkin?',
        a: 'Tenderlar sahifasida ID, tashkilot nomi yoki tender nomi bo\'yicha qidirish mumkin. Shuningdek, xavf darajasi, viloyat, soha va sana oralig\'i bo\'yicha filtrlash imkoniyati mavjud.',
      },
      {
        q: 'Tender haqida batafsil ma\'lumotni qayerdan ko\'rish mumkin?',
        a: 'Jadvaldagi istalgan tender ustiga bosib, batafsil ma\'lumot sahifasiga o\'tishingiz mumkin. U yerda tender ma\'lumotlari, risk omillari, AI izohi, ishtirokchilar aloqalar xaritasi va harakat xronologiyasini ko\'rishingiz mumkin.',
      },
    ],
  },
  {
    id: 'notifications',
    name: 'Bildirishnomalar',
    icon: <FiBell size={18} />,
    color: '#f44336',
    questions: [
      {
        q: 'Qanday bildirishnomalar keladi?',
        a: 'Yuqori xavfli tenderlar aniqlanganda, narx anomaliyasi, yangi kompaniya yoki manzil moslik kabi xavf omillari topilganda, tizim yangilanishlari haqida bildirishnomalar olasiz.',
      },
      {
        q: 'Bildirishnoma sozlamalarini qayerdan o\'zgartirish mumkin?',
        a: 'Sozlamalar sahifasidagi "Bildirishnomalar" bo\'limida kanallar (Email, Telegram, SMS, Push) va bildirishnoma turlarini sozlashingiz mumkin.',
      },
    ],
  },
  {
    id: 'settings',
    name: 'Sozlamalar',
    icon: <FiSettings size={18} />,
    color: '#5c9eff',
    questions: [
      {
        q: 'Risk parametrlarini o\'zgartirish mumkinmi?',
        a: 'Ha, Sozlamalar -> Risk Sozlamalari bo\'limida har bir risk mezonining ball qiymatini o\'zgartirishingiz mumkin. Slayder yordamida 0 dan maksimalgacha sozlash imkoniyati mavjud.',
      },
      {
        q: 'Profil ma\'lumotlarini qanday yangilash mumkin?',
        a: 'Sozlamalar -> Profil bo\'limida ism, email, telefon, kompaniya va lavozim ma\'lumotlarini tahrirlab, "Saqlash" tugmasini bosishingiz mumkin.',
      },
    ],
  },
];

// Video Tutorials
const videoTutorials = [
  {
    id: 1,
    title: 'ShafofAI bilan tanishuv',
    duration: '3:45',
    icon: <FaRobot size={24} />,
    color: '#5c9eff',
    description: 'Tizimning asosiy funksiyalari va imkoniyatlari haqida qisqacha ma\'lumot',
  },
  {
    id: 2,
    title: 'Dashboarddan foydalanish',
    duration: '5:20',
    icon: <FiBookOpen size={24} />,
    color: '#4caf50',
    description: 'Dashboarddagi statistika va grafiklar bilan ishlash',
  },
  {
    id: 3,
    title: 'Tenderlarni tahlil qilish',
    duration: '8:15',
    icon: <FiTrendingUp size={24} />,
    color: '#ff7043',
    description: 'Shubhali tenderlarni aniqlash va tahlil qilish',
  },
  {
    id: 4,
    title: 'Bildirishnomalarni sozlash',
    duration: '4:30',
    icon: <FiBell size={24} />,
    color: '#f44336',
    description: 'Bildirishnoma kanallari va turlarini sozlash',
  },
];

// Support Contacts
const supportContacts = [
  { type: 'email', name: 'Email', value: 'support@shafof.uz', icon: <FiMail size={20} />, action: 'mailto:support@shafof.uz' },
  { type: 'telegram', name: 'Telegram', value: '@shafof_support', icon: <FiMessageSquare size={20} />, action: 'https://t.me/shafof_support' },
  { type: 'phone', name: 'Telefon', value: '+998 71 123 45 67', icon: <FiPhone size={20} />, action: 'tel:+998711234567' },
  { type: 'schedule', name: 'Ish vaqti', value: 'Du-Shan 09:00 - 18:00', icon: <FiClock size={20} />, action: null },
];

// Quick Links
const quickLinks = [
  { name: 'Boshlang\'ich qo\'llanma', icon: <FiZap size={18} />, link: '#getting-started' },
  { name: 'Risk tahlili haqida', icon: <FiTrendingUp size={18} />, link: '#risk-analysis' },
  { name: 'API hujjatlari', icon: <FiDatabase size={18} />, link: '/docs/api' },
  { name: 'Tez-tez beriladigan savollar', icon: <FaQuestionCircle size={18} />, link: '#faq' },
  { name: 'Video darsliklar', icon: <FiVideo size={18} />, link: '#videos' },
  { name: 'Aloqa', icon: <FiMail size={18} />, link: '#contact' },
];

function Help({ darkMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [feedbackDialog, setFeedbackDialog] = useState(false);

  const colors = {
    bgCard: darkMode ? '#182040' : '#ffffff',
    bgElevated: darkMode ? '#141d35' : '#f1f5f9',
    textPrimary: darkMode ? '#e8eaf6' : '#0f172a',
    textSecondary: darkMode ? '#8892b0' : '#475569',
    border: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    blue: darkMode ? '#5c9eff' : '#168aad',
    red: '#f44336',
    orange: '#ff7043',
    green: '#4caf50',
    purple: '#ab47bc',
  };

  const handleFaqToggle = (panel) => {
    setExpandedFaq(expandedFaq === panel ? null : panel);
  };

  const handleSendFeedback = () => {
    if (!feedbackMessage.trim()) {
      setSnackbar({ open: true, message: 'Iltimos, xabaringizni yozing', severity: 'warning' });
      return;
    }
    setSnackbar({ open: true, message: 'Fikr-mulohazangiz uchun rahmat!', severity: 'success' });
    setFeedbackMessage('');
    setFeedbackRating(5);
    setFeedbackDialog(false);
  };

  const filteredFaqs = faqCategories.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh', width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: colors.textPrimary, mb: 2 }}>
          Qanday yordam bera olamiz?
        </Typography>
        <Typography variant="body1" sx={{ color: colors.textSecondary, maxWidth: 600, mx: 'auto', mb: 3 }}>
          Savollaringizga javob toping, video darsliklarni ko'ring yoki biz bilan bog'lanishingiz mumkin.
        </Typography>
        <TextField
          placeholder="Savolingizni yozing..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ maxWidth: 500, width: '100%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch size={20} style={{ color: colors.textSecondary }} />
              </InputAdornment>
            ),
            sx: { bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 2 }
          }}
        />
      </Box>

      {/* Quick Links */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {quickLinks.map((link, idx) => (
          <Grid key={idx} size={{ xs: 6, sm: 4, md: 2 }}>
            <Card 
              sx={{ 
                borderRadius: 2, 
                bgcolor: colors.bgCard, 
                border: `1px solid ${colors.border}`,
                textAlign: 'center',
                py: 2,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 8px 24px ${alpha(colors.blue, 0.15)}` }
              }}
              onClick={() => {
                if (link.link.startsWith('#')) {
                  document.getElementById(link.link.substring(1))?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.open(link.link, '_blank');
                }
              }}
            >
              <Avatar sx={{ width: 48, height: 48, mx: 'auto', mb: 1, bgcolor: alpha(colors.blue, 0.1), color: colors.blue }}>
                {link.icon}
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 500, color: colors.textPrimary }}>{link.name}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        sx={{
          mb: 3,
          borderBottom: `1px solid ${colors.border}`,
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, color: colors.textSecondary },
          '& .Mui-selected': { color: colors.blue },
          '& .MuiTabs-indicator': { bgcolor: colors.blue },
        }}
      >
        <Tab icon={<FaQuestionCircle size={18} />} iconPosition="start" label="Ko'p so'raladigan savollar" />
        <Tab icon={<FiVideo size={18} />} iconPosition="start" label="Video darsliklar" />
        <Tab icon={<FiLifeBuoy size={18} />} iconPosition="start" label="Qo'llanmalar" />
        <Tab icon={<FiMessageSquare size={18} />} iconPosition="start" label="Aloqa" />
      </Tabs>

      {/* FAQ Tab */}
      {activeTab === 0 && (
        <Box id="faq">
          {filteredFaqs.length === 0 ? (
            <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}`, p: 4, textAlign: 'center' }}>
              <FiSearch size={48} style={{ color: colors.textSecondary, opacity: 0.5, marginBottom: 16 }} />
              <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 1 }}>Hech narsa topilmadi</Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>Boshqa so'zlar bilan qidirib ko'ring</Typography>
            </Card>
          ) : (
            filteredFaqs.map((category, catIdx) => (
              <Box key={category.id} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha(category.color, 0.15), color: category.color, width: 32, height: 32 }}>
                    {category.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>{category.name}</Typography>
                </Box>
                <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
                  {category.questions.map((item, idx) => (
                    <Accordion
                      key={idx}
                      expanded={expandedFaq === `${category.id}-${idx}`}
                      onChange={() => handleFaqToggle(`${category.id}-${idx}`)}
                      sx={{ bgcolor: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }}
                    >
                      <AccordionSummary
                        expandIcon={<FiChevronDown size={20} style={{ color: colors.textSecondary }} />}
                        sx={{ borderBottom: idx < category.questions.length - 1 && expandedFaq !== `${category.id}-${idx}` ? `1px solid ${colors.border}` : 'none' }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 500, color: colors.textPrimary }}>{item.q}</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ borderBottom: idx < category.questions.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                        <Typography variant="body2" sx={{ color: colors.textSecondary, lineHeight: 1.7 }}>{item.a}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Card>
              </Box>
            ))
          )}
        </Box>
      )}

      {/* Video Tutorials Tab */}
      {activeTab === 1 && (
        <Box id="videos">
          <Grid container spacing={3}>
            {videoTutorials.map((video) => (
              <Grid key={video.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}`, cursor: 'pointer', transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <Box sx={{ position: 'relative', p: 2, textAlign: 'center', bgcolor: alpha(video.color, 0.05), borderBottom: `1px solid ${colors.border}` }}>
                    <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 1, bgcolor: alpha(video.color, 0.15), color: video.color }}>
                      {video.icon}
                    </Avatar>
                    <Box sx={{ position: 'absolute', bottom: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', px: 1, py: 0.5, borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ color: 'white' }}>{video.duration}</Typography>
                    </Box>
                  </Box>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.textPrimary, mb: 1 }}>{video.title}</Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>{video.description}</Typography>
                    <Button size="small" startIcon={<FiPlay size={14} />} sx={{ color: video.color, textTransform: 'none' }}>Ko'rish</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Guides Tab */}
      {activeTab === 2 && (
        <Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: alpha(colors.blue, 0.15), color: colors.blue }}><FiZap size={24} /></Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>Boshlang'ich qo'llanma</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                    ShafofAI tizimidan foydalanishni boshlash uchun 5 daqiqalik qo'llanma.
                  </Typography>
                  <Button variant="outlined" startIcon={<FiDownload />} sx={{ textTransform: 'none' }}>PDF yuklab olish</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: alpha(colors.orange, 0.15), color: colors.orange }}><FiTrendingUp size={24} /></Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>Risk tahlili bo'yicha qo'llanma</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                    Risk omillari va ularni tahlil qilish haqida batafsil ma'lumot.
                  </Typography>
                  <Button variant="outlined" startIcon={<FiDownload />} sx={{ textTransform: 'none' }}>PDF yuklab olish</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: alpha(colors.purple, 0.15), color: colors.purple }}><FiDatabase size={24} /></Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>API hujjatlari</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                    API orqali tizimga ulanish va ma'lumotlarni olish bo'yicha qo'llanma.
                  </Typography>
                  <Button variant="outlined" startIcon={<FiExternalLink />} sx={{ textTransform: 'none' }}>Ko'rish</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: alpha(colors.green, 0.15), color: colors.green }}><FiSettings size={24} /></Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>Sozlamalar qo'llanmasi</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                    Tizim sozlamalarini o'zgartirish va shaxsiylashtirish bo'yicha qo'llanma.
                  </Typography>
                  <Button variant="outlined" startIcon={<FiDownload />} sx={{ textTransform: 'none' }}>PDF yuklab olish</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Contact Tab */}
      {activeTab === 3 && (
        <Box id="contact">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2 }}>Biz bilan bog'lanish</Typography>
                  {supportContacts.map((contact, idx) => (
                    <Box key={contact.type} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, borderBottom: idx < supportContacts.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                      <Avatar sx={{ bgcolor: alpha(colors.blue, 0.1), color: colors.blue }}>{contact.icon}</Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>{contact.name}</Typography>
                        {contact.action ? (
                          <Link href={contact.action} sx={{ color: colors.blue, textDecoration: 'none', fontSize: 14 }}>{contact.value}</Link>
                        ) : (
                          <Typography variant="body2" sx={{ color: colors.textSecondary }}>{contact.value}</Typography>
                        )}
                      </Box>
                      {contact.action && (
                        <IconButton href={contact.action} size="small" sx={{ color: colors.blue }}>
                          <FiExternalLink size={16} />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2 }}>Fikr-mulohaza qoldirish</Typography>
                  <Rating
                    value={feedbackRating}
                    onChange={(e, v) => setFeedbackRating(v || 5)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Xabaringizni yozing..."
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{ sx: { bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 1 } }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<FiSend />}
                    onClick={handleSendFeedback}
                    sx={{ bgcolor: colors.blue, textTransform: 'none' }}
                  >
                    Yuborish
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 1 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default Help;
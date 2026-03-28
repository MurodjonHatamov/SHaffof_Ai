import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Tooltip,
  Paper,
  Zoom,
  Grow,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  FiTrendingUp,
  FiSearch,
  FiBell,
  FiRefreshCw,
  FiChevronRight,
  FiBarChart2,
  FiMap,
} from 'react-icons/fi';
import { MdWarning, MdLocationOn, MdBusiness, MdErrorOutline } from 'react-icons/md';
import { FaRobot } from 'react-icons/fa';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

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

// Recharts tooltip style based on mode
const getTooltipStyle = (darkMode) => ({
  backgroundColor: darkMode ? '#141d35' : '#ffffff',
  borderRadius: 8,
  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  color: darkMode ? '#e8eaf6' : '#0f172a',
});

const AnimatedNumber = ({ value, color }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '2.5rem', color, mb: 0.5 }}>{displayValue.toLocaleString()}</Typography>;
};

const Sparkline = ({ data, color }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 100;
    const height = canvas.height = 44;
    ctx.clearRect(0, 0, width, height);
    const step = width / (data.length - 1);
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    ctx.beginPath();
    ctx.moveTo(0, height - ((data[0] - min) / range) * height);
    for (let i = 1; i < data.length; i++) {
      const x = i * step;
      const y = height - ((data[i] - min) / range) * height;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color + '60');
    gradient.addColorStop(1, 'transparent');
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fillStyle = gradient;
    ctx.fill();
  }, [data, color]);
  return <canvas ref={canvasRef} style={{ width: 100, height: 44 }} />;
};

const sparkData = {
  high: [18, 22, 19, 28, 35, 31, 40, 38, 44, 52, 60, 67],
  medium: [80, 88, 95, 102, 98, 110, 120, 115, 130, 142, 155, 162],
  low: [520, 580, 610, 650, 700, 680, 720, 760, 800, 840, 890, 930],
  total: [1.8, 1.9, 2.0, 2.1, 2.0, 2.1, 2.2, 2.2, 2.3, 2.3, 2.4, 2.4],
};

const riskTrendData = [
  { month: 'Yan', high: 18, medium: 80, low: 520 },
  { month: 'Fev', high: 22, medium: 88, low: 580 },
  { month: 'Mar', high: 19, medium: 95, low: 610 },
  { month: 'Apr', high: 28, medium: 102, low: 650 },
  { month: 'May', high: 35, medium: 98, low: 700 },
  { month: 'Iyn', high: 31, medium: 110, low: 680 },
  { month: 'Iyl', high: 40, medium: 120, low: 720 },
  { month: 'Avg', high: 38, medium: 115, low: 760 },
  { month: 'Sen', high: 44, medium: 130, low: 800 },
  { month: 'Okt', high: 52, medium: 142, low: 840 },
  { month: 'Noy', high: 60, medium: 155, low: 890 },
  { month: 'Dek', high: 67, medium: 162, low: 930 },
];

const regionChartData = [
  { name: "Toshkent", value: 85, fill: '#f44336' },
  { name: "Samarqand", value: 42, fill: '#ff7043' },
  { name: "Farg'ona", value: 38, fill: '#ffb74d' },
  { name: "Namangan", value: 29, fill: '#66bb6a' },
  { name: "Buxoro", value: 22, fill: '#4caf50' },
  { name: "Andijon", value: 18, fill: '#2e7d32' },
  { name: "Qashqadaryo", value: 13, fill: '#1b5e20' },
  { name: "Sirdaryo", value: 10, fill: '#33691e' },
  { name: "Jizzax", value: 9, fill: '#558b2f' },
  { name: "Navoiy", value: 8, fill: '#689f38' },
  { name: "Surxondaryo", value: 7, fill: '#7cb342' },
  { name: "Xorazm", value: 6, fill: '#9ccc65' },
];
const topRiskyContracts = [
  { id: 'TG-2024-0005', org: 'Jizzax viloyat Suv Ta\'minoti', amount: 993600000, score: 120, rank: 1, change: '+12%' },
  { id: 'TG-2024-0033', org: 'Qashqadaryo viloyat Energetika Boshqarmasi', amount: 156800000, score: 120, rank: 2, change: '+8%' },
  { id: 'TG-2024-0080', org: 'Toshkent viloyat Arxitektura', amount: 554400000, score: 120, rank: 3, change: '+15%' },
  { id: 'TG-2024-0003', org: 'Jizzax viloyat Suv Ta\'minoti', amount: 480000000, score: 90, rank: 4, change: '+5%' },
  { id: 'TG-2024-0008', org: 'Toshkent viloyat Arxitektura', amount: 963200000, score: 90, rank: 5, change: '+7%' },
];

const riskScoreDistribution = [
  { range: '0-10', count: 1200, color: '#d9ed92' },
  { range: '11-20', count: 980, color: '#b5e48c' },
  { range: '21-30', count: 1450, color: '#99d98c' },
  { range: '31-40', count: 2200, color: '#76c893' },
  { range: '41-50', count: 850, color: '#52b69a' },
  { range: '51-60', count: 620, color: '#34a0a4' },
  { range: '61-70', count: 480, color: '#168aad' },
  { range: '71-80', count: 390, color: '#1a759f' },
  { range: '81-90', count: 180, color: '#1e6091' },
  { range: '91-100', count: 120, color: '#184e77' },
  { range: '101-110', count: 80, color: '#184e77' },
  { range: '111-120', count: 67, color: '#1e6091' },
];

const aiInsights = (colors) => [
  { icon: <FiTrendingUp size={24} />, title: 'Narx Anomaliyasi', count: 84, desc: 'tender bozor narxidan 2x dan yuqori', color: colors.red },
  { icon: <MdBusiness size={24} />, title: 'Yangi Kompaniya', count: 63, desc: 'firma 6 oydan kam muddatda ochilgan', color: colors.orange },
  { icon: <MdLocationOn size={24} />, title: 'Manzil Moslik', count: 37, desc: 'ishtirokchilar bir xil manzilda', color: '#34a0a4' },
  { icon: <FaRobot size={24} />, title: 'AI Aniqlagan', count: 19, desc: 'barcha uch mezon bir vaqtda', color: colors.green },
];

function Dashboard({ darkMode }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [centerValue, setCenterValue] = useState(8712);
  const [centerLabel, setCenterLabel] = useState('Past Xavf');

  const colors = darkMode ? darkColors : lightColors;
  const insights = aiInsights(colors);

  const riskData = {
    high: { value: 247, label: 'Yuqori Xavf', color: colors.red, percent: 2.5 },
    medium: { value: 1043, label: "O'rtacha Xavf", color: colors.orange, percent: 10.4 },
    low: { value: 8712, label: 'Past Xavf', color: colors.green, percent: 87.1 },
  };

  const formatMoney = (amount) => {
    if (amount >= 1e9) return `${(amount / 1e9).toFixed(1)}mlrd so'm`;
    if (amount >= 1e6) return `${(amount / 1e6).toFixed(1)}mln so'm`;
    return `${amount.toLocaleString()} so'm`;
  };

  const handleRiskClick = (riskType) => {
    setSelectedRisk(riskType);
    setCenterValue(riskData[riskType].value);
    setCenterLabel(riskData[riskType].label);
  };

  const statCards = [
    { value: 247, label: 'Yuqori Xavfli', change: '+18%', color: colors.red, sparkData: sparkData.high, onClick: () => navigate('/tenders?risk=high') },
    { value: 1043, label: "O'rtacha Xavfli", change: '+7%', color: colors.orange, sparkData: sparkData.medium, onClick: () => navigate('/tenders?risk=medium') },
    { value: 8712, label: 'Past Xavfli', change: '+3%', color: colors.green, sparkData: sparkData.low, onClick: () => navigate('/tenders?risk=low') },
    { value: '2.4T', label: 'Jami Summa', change: '+24%', color: colors.blue, sparkData: sparkData.total, isCurrency: true },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: colors.bgBase, minHeight: '100vh', width: '100%' }}>
  
      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: '16px', mb: '20px' }}>
        {statCards.map((stat, idx) => (
          <Box 
            key={idx} 
            onClick={stat.onClick} 
            sx={{ 
              background: colors.bgCard, 
              borderRadius: '20px', 
              padding: '20px', 
              border: `1px solid ${colors.border}`, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '14px', 
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', 
              position: 'relative', 
              overflow: 'hidden', 
              cursor: stat.onClick ? 'pointer' : 'default',
              '&:hover': stat.onClick && { transform: 'translateY(-2px)', boxShadow: darkMode ? `0 8px 40px rgba(0, 0, 0, 0.4)` : `0 8px 24px rgba(0, 0, 0, 0.1)` },
              '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${stat.color}, transparent)` },
              '&:focus': { outline: 'none' }
            }}
          >
            <Box sx={{ flex: 1 }}>
              {typeof stat.value === 'number' ? <AnimatedNumber value={stat.value} color={stat.color} /> : <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '2.5rem', color: stat.color, mb: 0.5 }}>{stat.value}</Typography>}
              <Typography variant="body2" sx={{ color: colors.textSecondary, fontWeight: 500 }}>{stat.label}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5 }}><FiTrendingUp size={12} style={{ color: stat.color }} /><Typography variant="caption" sx={{ color: stat.color, fontWeight: 600 }}>{stat.change} bu oyda</Typography></Box>
            </Box>
            <Sparkline data={stat.sparkData} color={stat.color} />
          </Box>
        ))}
      </Box>

      {/* Trend Chart + Donut */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: '16px', mb: '20px' }}>
        {/* Risk Trend Chart */}
        <Box sx={{ background: colors.bgCard, borderRadius: '20px', padding: '20px', border: `1px solid ${colors.border}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box><Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>Oylik Xavf Dinamikasi</Typography><Typography variant="body2" sx={{ color: colors.textSecondary }}>So'nggi 12 oy bo'yicha tendensiya</Typography></Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" sx={{ textTransform: 'none', borderRadius: '8px', color: colors.textSecondary, borderColor: colors.border, '&:hover': { borderColor: colors.blue, color: colors.blue }, '&:focus': { outline: 'none' } }} variant="outlined">12 oy</Button>
              <Button size="small" sx={{ textTransform: 'none', borderRadius: '8px', color: colors.textSecondary, borderColor: colors.border, '&:hover': { borderColor: colors.blue, color: colors.blue }, '&:focus': { outline: 'none' } }} variant="outlined">6 oy</Button>
              <Button size="small" sx={{ textTransform: 'none', borderRadius: '8px', color: colors.textSecondary, borderColor: colors.border, '&:hover': { borderColor: colors.blue, color: colors.blue }, '&:focus': { outline: 'none' } }} variant="outlined">3 oy</Button>
            </Box>
          </Box>
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={riskTrendData}>
              <defs>
                <linearGradient id="highGradient"><stop offset="5%" stopColor={colors.red} stopOpacity={0.3} /><stop offset="95%" stopColor={colors.red} stopOpacity={0} /></linearGradient>
                <linearGradient id="mediumGradient"><stop offset="5%" stopColor={colors.orange} stopOpacity={0.3} /><stop offset="95%" stopColor={colors.orange} stopOpacity={0} /></linearGradient>
                <linearGradient id="lowGradient"><stop offset="5%" stopColor={colors.green} stopOpacity={0.3} /><stop offset="95%" stopColor={colors.green} stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="month" stroke={colors.textSecondary} />
              <YAxis stroke={colors.textSecondary} />
              <RechartsTooltip contentStyle={getTooltipStyle(darkMode)} />
              <Legend wrapperStyle={{ color: colors.textSecondary }} />
              <Area type="monotone" dataKey="high" stroke={colors.red} fill="url(#highGradient)" name="Yuqori Xavf" strokeWidth={2} />
              <Area type="monotone" dataKey="medium" stroke={colors.orange} fill="url(#mediumGradient)" name="O'rtacha Xavf" strokeWidth={2} />
              <Area type="monotone" dataKey="low" stroke={colors.green} fill="url(#lowGradient)" name="Past Xavf" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>

        {/* Risk Distribution Donut */}
        <Box sx={{ background: colors.bgCard, borderRadius: '20px', padding: '20px', border: `1px solid ${colors.border}` }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 1 }}>Risk Taqsimoti</Typography>
          <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>Joriy oy • {selectedRisk === 'all' ? 'Umumiy' : riskData[selectedRisk]?.label}</Typography>
          <Box sx={{ position: 'relative', height: 220, mb: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={[{ name: 'Yuqori', value: 247, color: colors.red }, { name: "O'rtacha", value: 1043, color: colors.orange }, { name: 'Past', value: 8712, color: colors.green }]} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={65} 
                  outerRadius={90} 
                  paddingAngle={4} 
                  dataKey="value" 
                  onClick={(data) => handleRiskClick(data.name === 'Yuqori' ? 'high' : data.name === "O'rtacha" ? 'medium' : 'low')} 
                  cursor="pointer"
                  style={{ outline: 'none' }}
                >
                  {[colors.red, colors.orange, colors.green].map((color, idx) => (<Cell key={`cell-${idx}`} fill={color} stroke={colors.bgCard} strokeWidth={2} style={{ outline: 'none' }} />))}
                </Pie>
                <RechartsTooltip contentStyle={getTooltipStyle(darkMode)} />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
              <Zoom in><Box><Typography variant="h3" sx={{ fontWeight: 800, fontSize: '2rem', color: selectedRisk === 'all' ? colors.textPrimary : riskData[selectedRisk]?.color, fontFamily: 'monospace' }}>{selectedRisk === 'all' ? '10,002' : centerValue.toLocaleString()}</Typography><Typography variant="caption" sx={{ color: colors.textSecondary }}>{selectedRisk === 'all' ? 'Jami tenderlar' : centerLabel}</Typography></Box></Zoom>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            {Object.entries(riskData).map(([key, data]) => (
              <Box key={key} onClick={() => handleRiskClick(key)} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', p: 0.5, borderRadius: 2, bgcolor: selectedRisk === key ? alpha(data.color, darkMode ? 0.1 : 0.08) : 'transparent', '&:focus': { outline: 'none' } }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: data.color }} />
                <Typography variant="caption" sx={{ fontWeight: selectedRisk === key ? 700 : 500, color: colors.textPrimary }}>{data.label}</Typography>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>({data.value.toLocaleString()})</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Region + Top Tenders */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '16px', mb: '20px' }}>
      {/* Region Chart */}
<Box sx={{ background: colors.bgCard, borderRadius: '20px', padding: '20px', border: `1px solid ${colors.border}` }}>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
    <FiMap size={20} style={{ color: colors.blue }} />
    <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>Hududlar Kesimida Risk</Typography>
  </Box>
  <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>
    Viloyatlar bo'yicha yuqori xavfli tenderlar
  </Typography>
  <ResponsiveContainer width="100%" height={520}>
    <BarChart 
      data={regionChartData} 
      layout="vertical" 
      margin={{ left: 10, right: 30, top: 0, bottom: 0 }}
      barCategoryGap={6}
    >
      <CartesianGrid strokeDasharray="3 3" stroke={colors.border} horizontal={false} />
      <XAxis 
        type="number" 
        stroke={colors.textSecondary}
        tick={{ fontSize: 12, fill: colors.textSecondary }}
        axisLine={{ stroke: colors.border }}
        tickLine={{ stroke: colors.border }}
      />
      <YAxis 
        type="category" 
        dataKey="name" 
        stroke={colors.textSecondary}
        width={110}
        tick={{ fontSize: 13, fill: colors.textSecondary, fontWeight: 500 }}
        axisLine={{ stroke: colors.border }}
        tickLine={{ stroke: colors.border }}
      />
      <RechartsTooltip 
        contentStyle={getTooltipStyle(darkMode)} 
        formatter={(value) => [`${value} ta tender`, 'Yuqori xavfli']}
        cursor={{ fill: alpha(colors.blue, 0.1) }}
      />
      <Bar 
        dataKey="value" 
        radius={[0, 8, 8, 0]}
        maxBarSize={35}
        barSize={28}
      >
        {regionChartData.map((entry, idx) => (
          <Cell key={`cell-${idx}`} fill={entry.fill} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</Box>

        {/* Top Risky Contracts */}
        <Box sx={{ background: colors.bgCard, borderRadius: '20px', padding: '20px', border: `1px solid ${colors.border}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FiBarChart2 size={20} style={{ color: colors.blue }} /><Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>Eng Xavfli Shartnomalar</Typography></Box>
            <Button endIcon={<FiChevronRight />} onClick={() => navigate('/tenders')} sx={{ textTransform: 'none', color: colors.blue, '&:focus': { outline: 'none' } }}>Barchasi</Button>
          </Box>
          <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>Risk bali bo'yicha reyting • Jami 247 ta yuqori xavfli tender</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {topRiskyContracts.map((contract, idx) => (
              <Paper 
                key={contract.id} 
                elevation={0} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  p: 2, 
                  borderRadius: '12px', 
                  cursor: 'pointer', 
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', 
                  bgcolor: colors.bgElevated, 
                  border: `1px solid ${colors.border}`,
                  '&:hover': { bgcolor: colors.bgCardHover, transform: 'translateX(8px)' },
                  '&:focus': { outline: 'none' }
                }} 
                onClick={() => navigate(`/tender/${contract.id}`)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: `linear-gradient(135deg, ${alpha(colors.red, 0.2)}, ${alpha(colors.red, 0.05)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: colors.red }}>{contract.rank}</Box>
                  <Box><Typography variant="body1" sx={{ fontWeight: 700, color: colors.textPrimary }}>{contract.org}</Typography><Typography variant="caption" sx={{ color: colors.textSecondary }}>{contract.id} • {formatMoney(contract.amount)}</Typography></Box>
                </Box>
                <Chip label={contract.score} size="medium" sx={{ bgcolor: alpha(colors.red, darkMode ? 0.15 : 0.1), color: colors.red, fontWeight: 800, minWidth: 55, borderRadius: '8px' }} />
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Risk Score Distribution */}
      <Box sx={{ background: colors.bgCard, borderRadius: '20px', padding: '20px', border: `1px solid ${colors.border}`, mb: '20px' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 1 }}>Risk Ball Taqsimoti</Typography>
        <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>Barcha tenderlar bo'yicha ball spektri</Typography>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={riskScoreDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis dataKey="range" stroke={colors.textSecondary} />
            <YAxis stroke={colors.textSecondary} />
            <RechartsTooltip contentStyle={getTooltipStyle(darkMode)} formatter={(value) => [`${value.toLocaleString()} ta tender`, 'Tenderlar soni']} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {riskScoreDistribution.map((entry, idx) => (<Cell key={`cell-${idx}`} fill={entry.color} />))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* AI Insights */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: '16px', mb: '20px' }}>
        {insights.map((insight, idx) => (
          <Grow in timeout={300 + idx * 100} key={idx}>
            <Box sx={{ background: colors.bgCard, borderRadius: '20px', padding: '20px', border: `1px solid ${alpha(insight.color, 0.3)}`, transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { transform: 'translateY(-4px)', boxShadow: darkMode ? `0 8px 40px rgba(0, 0, 0, 0.4)` : `0 8px 24px rgba(0, 0, 0, 0.1)` } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '12px', bgcolor: alpha(insight.color, darkMode ? 0.12 : 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', color: insight.color }}>{insight.icon}</Box>
                <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '2rem', color: insight.color }}>{insight.count}</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 0.5 }}>{insight.title}</Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>{insight.desc}</Typography>
            </Box>
          </Grow>
        ))}
      </Box>

      {/* AI Summary & Notifications */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '16px' }}>
        <Box sx={{ background: alpha(colors.blue, darkMode ? 0.03 : 0.02), borderRadius: '20px', padding: '20px', border: `1px solid ${alpha(colors.blue, 0.2)}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: alpha(colors.blue, darkMode ? 0.15 : 0.1), color: colors.blue }}><FaRobot size={20} /></Avatar>
            <Box><Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>AI Tahlil Xulosasi</Typography><Typography variant="caption" sx={{ color: colors.textSecondary }}>Oxirgi 24 soatlik tahlil natijalari</Typography></Box>
          </Box>
          <Typography variant="body2" sx={{ mb: 2, color: colors.textSecondary }}>Oxirgi 7 kun ichida <strong style={{ color: colors.blue }}>12 ta tender</strong> yuqori xavf guruhiga kiritildi. Eng ko'p takrorlanuvchi xavf omillari:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip label="Yangi tashkil etilgan firmalar" size="small" sx={{ bgcolor: alpha(colors.blue, darkMode ? 0.1 : 0.05), color: colors.blue }} />
            <Chip label="Narx anomaliyasi" size="small" sx={{ bgcolor: alpha(colors.orange, darkMode ? 0.1 : 0.05), color: colors.orange }} />
            <Chip label="Bir xil manzil" size="small" sx={{ bgcolor: alpha(colors.green, darkMode ? 0.1 : 0.05), color: colors.green }} />
            <Chip label="Bir xil rahbarlar" size="small" sx={{ bgcolor: alpha(colors.purple, darkMode ? 0.1 : 0.05), color: colors.purple }} />
          </Box>
        </Box>

        <Box sx={{ background: alpha(colors.orange, darkMode ? 0.03 : 0.02), borderRadius: '20px', padding: '20px', border: `1px solid ${alpha(colors.orange, 0.2)}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: alpha(colors.orange, darkMode ? 0.15 : 0.1), color: colors.orange }}><FiBell size={20} /></Avatar>
            <Box><Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>Tezkor Bildirishnomalar</Typography><Typography variant="caption" sx={{ color: colors.textSecondary }}>Real vaqtda yangilanadi</Typography></Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: '12px', '&:hover': { bgcolor: alpha(colors.red, darkMode ? 0.05 : 0.03) } }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(colors.red, darkMode ? 0.12 : 0.08), color: colors.red }}><MdErrorOutline /></Avatar>
              <Box sx={{ flex: 1 }}><Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>O'zbekiston Energetika Vazirligi</Typography><Typography variant="caption" sx={{ color: colors.textSecondary }}>Yuqori xavf aniqlandi - 85 ball</Typography></Box>
              <Chip label="Yangi" size="small" sx={{ bgcolor: colors.red, color: 'white', height: 22 }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: '12px', '&:hover': { bgcolor: alpha(colors.orange, darkMode ? 0.05 : 0.03) } }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(colors.orange, darkMode ? 0.12 : 0.08), color: colors.orange }}><MdLocationOn /></Avatar>
              <Box sx={{ flex: 1 }}><Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>Yo'l Harakati Xavfsizligi</Typography><Typography variant="caption" sx={{ color: colors.textSecondary }}>Shubhali ishtirokchilar aniqlandi</Typography></Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: '12px', '&:hover': { bgcolor: alpha(colors.green, darkMode ? 0.05 : 0.03) } }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(colors.green, darkMode ? 0.12 : 0.08), color: colors.green }}><FiTrendingUp /></Avatar>
              <Box sx={{ flex: 1 }}><Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>Qurilish Materiallari AJ</Typography><Typography variant="caption" sx={{ color: colors.textSecondary }}>Narx anomaliyasi - 3.2x bozor narxidan yuqori</Typography></Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        *:focus {
          outline: none;
        }
      `}</style>
    </Box>
  );
}

export default Dashboard;
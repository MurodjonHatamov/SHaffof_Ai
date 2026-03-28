import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Divider,
  Avatar,
  Tooltip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiDownload,
  FiRefreshCw,
  FiInfo,
  FiBarChart2,
  FiPieChart,
  FiMap,
  FiShare2,
  FiChevronRight,
} from 'react-icons/fi';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell, // Added missing Cell import
} from 'recharts';
import { FaChartLine, FaRobot } from 'react-icons/fa';

// Mock data
const monthlyData = [
  { month: 'Yan', high: 18, medium: 80, low: 520, total: 618, anomaly: 12, avgPrice: 1.2 },
  { month: 'Fev', high: 22, medium: 88, low: 580, total: 690, anomaly: 15, avgPrice: 1.3 },
  { month: 'Mar', high: 19, medium: 95, low: 610, total: 724, anomaly: 14, avgPrice: 1.4 },
  { month: 'Apr', high: 28, medium: 102, low: 650, total: 780, anomaly: 18, avgPrice: 1.5 },
  { month: 'May', high: 35, medium: 98, low: 700, total: 833, anomaly: 22, avgPrice: 1.6 },
  { month: 'Iyn', high: 31, medium: 110, low: 680, total: 821, anomaly: 20, avgPrice: 1.5 },
  { month: 'Iyl', high: 40, medium: 120, low: 720, total: 880, anomaly: 25, avgPrice: 1.7 },
  { month: 'Avg', high: 38, medium: 115, low: 760, total: 913, anomaly: 23, avgPrice: 1.6 },
  { month: 'Sen', high: 44, medium: 130, low: 800, total: 974, anomaly: 28, avgPrice: 1.8 },
  { month: 'Okt', high: 52, medium: 142, low: 840, total: 1034, anomaly: 32, avgPrice: 1.9 },
  { month: 'Noy', high: 60, medium: 155, low: 890, total: 1105, anomaly: 35, avgPrice: 2.0 },
  { month: 'Dek', high: 67, medium: 162, low: 930, total: 1159, anomaly: 38, avgPrice: 2.1 },
];

const sectorData = [
  { name: 'Qurilish', high: 85, medium: 280, low: 1200, total: 1565, anomaly: 42 },
  { name: 'Tibbiyot', high: 42, medium: 180, low: 850, total: 1072, anomaly: 28 },
  { name: 'IT', high: 18, medium: 120, low: 420, total: 558, anomaly: 15 },
  { name: "Ta'lim", high: 31, medium: 210, low: 980, total: 1221, anomaly: 23 },
  { name: 'Transport', high: 24, medium: 140, low: 620, total: 784, anomaly: 18 },
  { name: 'Energetika', high: 29, medium: 160, low: 710, total: 899, anomaly: 22 },
  { name: "Qishloq xo'jaligi", high: 18, medium: 95, low: 380, total: 493, anomaly: 14 },
];

const regionGrowthData = [
  { name: 'Toshkent', growth: 18.5, value: 85, trend: 'up' },
  { name: 'Samarqand', growth: 12.3, value: 42, trend: 'up' },
  { name: "Farg'ona", growth: 8.7, value: 38, trend: 'up' },
  { name: 'Namangan', growth: 5.2, value: 29, trend: 'up' },
  { name: 'Buxoro', growth: -2.1, value: 22, trend: 'down' },
  { name: 'Andijon', growth: -1.5, value: 18, trend: 'down' },
];

const forecastData = [
  { month: 'Yan', actual: 618, forecast: 620 },
  { month: 'Fev', actual: 690, forecast: 685 },
  { month: 'Mar', actual: 724, forecast: 730 },
  { month: 'Apr', actual: 780, forecast: 785 },
  { month: 'May', actual: 833, forecast: 840 },
  { month: 'Iyn', actual: 821, forecast: 835 },
  { month: 'Iyl', actual: 880, forecast: 890 },
  { month: 'Avg', actual: 913, forecast: 920 },
  { month: 'Sen', actual: 974, forecast: 980 },
  { month: 'Okt', actual: 1034, forecast: 1040 },
  { month: 'Noy', actual: 1105, forecast: 1110 },
  { month: 'Dek', actual: 1159, forecast: 1165 },
  { month: 'Yan(2025)', actual: null, forecast: 1220 },
  { month: 'Fev(2025)', actual: null, forecast: 1280 },
];

function AdvancedAnalytics({ darkMode }) {
  const [timeRange, setTimeRange] = useState('12m');
  const [selectedSector, setSelectedSector] = useState('all');

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

  const getTooltipStyle = () => ({
    backgroundColor: darkMode ? '#141d35' : '#ffffff',
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    color: colors.textPrimary,
  });

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: colors.textPrimary, mb: 1 }}>
            Kengaytirilgan Tahlil
          </Typography>
          <Typography variant="body2" sx={{ color: colors.textSecondary }}>
            Chuqur statistika, trendlar va prognozlar
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: colors.textSecondary }}>Vaqt oralig'i</InputLabel>
            <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} label="Vaqt oralig'i">
              <MenuItem value="12m">12 oy</MenuItem>
              <MenuItem value="6m">6 oy</MenuItem>
              <MenuItem value="3m">3 oy</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<FiDownload />} sx={{ textTransform: 'none' }}>Eksport</Button>
        </Box>
      </Box>

      {/* Trend + Forecast Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2 }}>Tenderlar soni dinamikasi va prognoz</Typography>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis dataKey="month" stroke={colors.textSecondary} angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke={colors.textSecondary} />
                  <RechartsTooltip contentStyle={getTooltipStyle()} />
                  <Legend />
                  <Area type="monotone" dataKey="actual" stroke={colors.blue} fill={alpha(colors.blue, 0.2)} name="Haqiqiy" />
                  <Line type="monotone" dataKey="forecast" stroke={colors.orange} strokeDasharray="5 5" name="Prognoz" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2 }}>AI Prognoz xulosasi</Typography>
              <Box sx={{ p: 2, bgcolor: alpha(colors.blue, 0.05), borderRadius: 2, mb: 2 }}>
                <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                  <strong>2025 yil prognozi:</strong> Tenderlar soni 15-20% ga oshishi kutilmoqda.
                  Yuqori xavfli tenderlar ulushi 8.5% dan 12% gacha ko'tarilishi mumkin.
                </Typography>
              </Box>
              <Divider sx={{ my: 2, borderColor: colors.border }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box><Typography variant="caption" sx={{ color: colors.textSecondary }}>O'rtacha xavf indeksi</Typography><Typography variant="h4" sx={{ fontWeight: 800, color: colors.orange }}>47.3</Typography></Box>
                <Box><Typography variant="caption" sx={{ color: colors.textSecondary }}>O'sish</Typography><Typography variant="h4" sx={{ fontWeight: 800, color: colors.green }}>+12.4%</Typography></Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Anomaly Detection */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaRobot size={18} /> Anomaliya aniqlash
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid stroke={colors.border} />
                  <XAxis dataKey="month" name="Oy" stroke={colors.textSecondary} />
                  <YAxis dataKey="anomaly" name="Anomaliya soni" stroke={colors.textSecondary} />
                  <ZAxis dataKey="total" range={[60, 400]} name="Jami tenderlar" />
                  <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={getTooltipStyle()} />
                  <Scatter data={monthlyData} fill={colors.red} />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Correlation Analysis */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2 }}>Soha bo'yicha risk taqsimoti</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectorData} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis type="number" stroke={colors.textSecondary} />
                  <YAxis type="category" dataKey="name" stroke={colors.textSecondary} width={80} />
                  <RechartsTooltip contentStyle={getTooltipStyle()} />
                  <Bar dataKey="high" stackId="a" fill={colors.red} name="Yuqori xavf" />
                  <Bar dataKey="medium" stackId="a" fill={colors.orange} name="O'rtacha xavf" />
                  <Bar dataKey="low" stackId="a" fill={colors.green} name="Past xavf" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2 }}>Hududlar o'sish dinamikasi</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionGrowthData} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis type="number" stroke={colors.textSecondary} />
                  <YAxis type="category" dataKey="name" stroke={colors.textSecondary} width={80} />
                  <RechartsTooltip contentStyle={getTooltipStyle()} formatter={(value) => [`${value}%`, "O'sish"]} />
                  <Bar dataKey="growth" radius={[0, 8, 8, 0]}>
                    {regionGrowthData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.trend === 'up' ? colors.green : colors.red} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdvancedAnalytics;
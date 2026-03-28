import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Avatar,
  Tooltip,
  Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDownload,
  FiInfo,
  FiPieChart,
  FiBarChart2,
} from 'react-icons/fi';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const riskData = [
  { name: '0-20', value: 1200, color: '#d9ed92' },
  { name: '21-40', value: 2430, color: '#b5e48c' },
  { name: '41-60', value: 1470, color: '#99d98c' },
  { name: '61-80', value: 870, color: '#76c893' },
  { name: '81-100', value: 300, color: '#52b69a' },
  { name: '101-120', value: 147, color: '#34a0a4' },
];

const riskBySector = [
  { sector: 'Qurilish', high: 85, medium: 280, low: 1200 },
  { sector: 'Tibbiyot', high: 42, medium: 180, low: 850 },
  { sector: 'IT', high: 18, medium: 120, low: 420 },
  { sector: "Ta'lim", high: 31, medium: 210, low: 980 },
  { sector: 'Transport', high: 24, medium: 140, low: 620 },
];

function RiskDistribution({ darkMode }) {
  const [riskThreshold, setRiskThreshold] = useState(40);
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
  };

  const highRiskTenders = riskData.filter(d => parseInt(d.name.split('-')[0]) >= riskThreshold).reduce((sum, d) => sum + d.value, 0);
  const lowRiskTenders = riskData.filter(d => parseInt(d.name.split('-')[0]) < riskThreshold).reduce((sum, d) => sum + d.value, 0);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh', width: '100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: colors.textPrimary, mb: 1 }}>Risk Taqsimoti</Typography>
      <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 4 }}>Risk bali bo'yicha tenderlar taqsimoti</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2 }}>Risk ball taqsimoti</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {riskData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: darkMode ? '#141d35' : '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2 }}>Risk chegarasi</Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>Risk bali {riskThreshold} dan yuqori tenderlar yuqori xavfli hisoblanadi</Typography>
              <Slider value={riskThreshold} onChange={(e, v) => setRiskThreshold(v)} min={0} max={120} step={10} marks={[{ value: 0, label: '0' }, { value: 40, label: '40' }, { value: 80, label: '80' }, { value: 120, label: '120' }]} sx={{ color: colors.blue }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Chip label={`Yuqori xavfli: ${highRiskTenders.toLocaleString()}`} sx={{ bgcolor: alpha(colors.red, 0.1), color: colors.red }} />
                <Chip label={`Past xavfli: ${lowRiskTenders.toLocaleString()}`} sx={{ bgcolor: alpha(colors.green, 0.1), color: colors.green }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RiskDistribution;
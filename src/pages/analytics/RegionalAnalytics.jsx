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
  Chip,
  Button,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  FiMap,
  FiTrendingUp,
  FiTrendingDown,
  FiDownload,
  FiInfo,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';

const regionData = [
  { name: 'Toshkent', value: 85, growth: 18.5, color: '#f44336', share: 28 },
  { name: 'Samarqand', value: 42, growth: 12.3, color: '#ff7043', share: 14 },
  { name: "Farg'ona", value: 38, growth: 8.7, color: '#ffb74d', share: 13 },
  { name: 'Namangan', value: 29, growth: 5.2, color: '#66bb6a', share: 10 },
  { name: 'Buxoro', value: 22, growth: -2.1, color: '#4caf50', share: 7 },
  { name: 'Andijon', value: 18, growth: -1.5, color: '#2e7d32', share: 6 },
  { name: 'Qashqadaryo', value: 13, growth: 3.2, color: '#1b5e20', share: 4 },
];

function RegionalAnalytics({ darkMode }) {
  const [selectedRegion, setSelectedRegion] = useState('all');

  const colors = {
    bgCard: darkMode ? '#182040' : '#ffffff',
    textPrimary: darkMode ? '#e8eaf6' : '#0f172a',
    textSecondary: darkMode ? '#8892b0' : '#475569',
    border: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    blue: darkMode ? '#5c9eff' : '#168aad',
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh', width: '100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: colors.textPrimary, mb: 1 }}>Hududiy Tahlil</Typography>
      <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 4 }}>Viloyatlar kesimida risk tahlili</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2 }}>Viloyatlar bo'yicha risk</Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={regionData} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis type="number" stroke={colors.textSecondary} />
                  <YAxis type="category" dataKey="name" stroke={colors.textSecondary} width={80} />
                  <RechartsTooltip contentStyle={{ backgroundColor: darkMode ? '#141d35' : '#fff' }} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {regionData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2 }}>Hududlar ulushi</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={regionData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="share" label>
                    {regionData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {regionData.map((region) => (
          <Grid key={region.name} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ borderRadius: 2, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.textPrimary }}>{region.name}</Typography>
                  <Chip label={`${region.value} ta`} size="small" sx={{ bgcolor: alpha(region.color, 0.15), color: region.color }} />
                </Box>
                <LinearProgress variant="determinate" value={(region.value / 85) * 100} sx={{ height: 8, borderRadius: 4, bgcolor: alpha(region.color, 0.2), '& .MuiLinearProgress-bar': { bgcolor: region.color } }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="caption" sx={{ color: colors.textSecondary }}>Ulush: {region.share}%</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {region.growth > 0 ? <FiTrendingUp size={12} style={{ color: colors.green }} /> : <FiTrendingDown size={12} style={{ color: colors.red }} />}
                    <Typography variant="caption" sx={{ color: region.growth > 0 ? colors.green : colors.red }}>{Math.abs(region.growth)}%</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RegionalAnalytics;
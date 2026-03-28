import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Tooltip,
  Popover,
  Stack,
  Divider,
  Badge,
  Collapse,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiAlertTriangle,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiInfo,
  FiRefreshCw,
} from 'react-icons/fi';
import {
  MdWarning,
  MdLocationOn,
  MdBusiness,
  MdAttachMoney,
  MdErrorOutline,
} from 'react-icons/md';

const API_BASE_URL = 'https://shaffofai-production.up.railway.app/api';

// Helper functions
const formatAmount = (amount) => {
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(1)}mlrd so'm`;
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(1)}mln so'm`;
  return `${amount.toLocaleString()} so'm`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Region mapping for Uzbek names
const regionMapping = {
  'Ташкентская область': 'Toshkent viloyati',
  'Тошкент шахри': 'Toshkent shahri',
  'Самаркандская область': 'Samarqand',
  'Ферганская область': "Farg'ona",
  'Наманганская область': 'Namangan',
  'Бухарская область': 'Buxoro',
  'Андижанская область': 'Andijon',
  'Кашкадарьинская область': 'Qashqadaryo',
  'Сурхандарьинская область': 'Surxondaryo',
  'Хорезмская область': 'Xorazm',
  'Сырдарьинская область': 'Sirdaryo',
  'Джизакская область': 'Jizzax',
  'Навоийская область': 'Navoiy',
  'Республика Каракалпакстан': 'Qoraqalpog\'iston',
};

const getRegionName = (region) => {
  if (!region) return 'Noma\'lum';
  return regionMapping[region] || region;
};

// Sector mapping for Uzbek names
const sectorMapping = {
  'Оборудование компьютерное, электронное и оптическое': 'IT va elektronika',
  'Продукция и услуги сельского хозяйства и охоты': 'Qishloq xo\'jaligi',
  'Средства лекарственные и материалы, применяемые в медицинских целях': 'Tibbiyot',
  'Текстиль и изделия текстильные': 'To\'qimachilik',
  'Вещества химические и продукты химические': 'Kimyo',
  'Средства автотранспортные, прицепы и полуприцепы': 'Transport',
  'Изделия металлические готовые, кроме машин и оборудования': 'Metall buyumlar',
  'Продукты минеральные неметаллические прочие': 'Mineral mahsulotlar',
  'Бумага и изделия из бумаги': 'Qog\'oz',
  'Машины и оборудование, не включенные в другие группировки': 'Mashina va uskunalar',
  'Мебель': 'Mebel',
  'Работы строительные специализированные': 'Qurilish ishlari',
  'Продукты пищевые': 'Oziq-ovqat',
  'Услуги издательские': 'Nashriyot xizmatlari',
};

const getSectorName = (sector) => {
  if (!sector) return 'Noma\'lum';
  return sectorMapping[sector] || sector.split(' ').slice(0, 2).join(' ');
};

// Risk levels mapping
const riskLevels = {
  critical: { label: 'Kritik', color: '#f44336', bg: 'rgba(244, 67, 54, 0.12)', icon: <MdErrorOutline /> },
  high: { label: 'Yuqori', color: '#ff7043', bg: 'rgba(255, 112, 67, 0.12)', icon: <MdWarning /> },
  medium: { label: "O'rtacha", color: '#ffb74d', bg: 'rgba(255, 183, 77, 0.12)', icon: <FiAlertTriangle /> },
  low: { label: 'Past', color: '#4caf50', bg: 'rgba(76, 175, 80, 0.12)', icon: <FiCheckCircle /> },
};

// Risk factors mapping
const riskFactorsMap = {
  priceAnomaly: { label: 'Narx', color: '#f44336', icon: <MdAttachMoney size={14} />, tooltip: 'Narx anomaliyasi' },
  newCompany: { label: 'Yangi', color: '#ff7043', icon: <MdBusiness size={14} />, tooltip: 'Yangi kompaniya' },
  addressMatch: { label: 'Manzil', color: '#ab47bc', icon: <MdLocationOn size={14} />, tooltip: 'Manzil moslik' },
};

// Transform API data to component format
const transformTender = (apiTender) => {
  const riskLevel = apiTender.riskLevel || 'low';
  const riskFactors = [];
  
  if (apiTender.factors?.priceAnomaly?.triggered) riskFactors.push('priceAnomaly');
  if (apiTender.factors?.newCompany?.triggered) riskFactors.push('newCompany');
  if (apiTender.factors?.addressMatch?.triggered) riskFactors.push('addressMatch');
  
  return {
    id: apiTender.id,
    organization: apiTender.org || 'Noma\'lum tashkilot',
    name: apiTender.name || 'Noma\'lum tender',
    amount: apiTender.amount || 0,
    date: apiTender.date || new Date().toISOString().split('T')[0],
    region: getRegionName(apiTender.region),
    sector: getSectorName(apiTender.sector),
    riskScore: apiTender.score || 0,
    riskLevel: riskLevel,
    riskFactors: riskFactors,
    participants: apiTender.participants || [],
    marketAvg: apiTender.marketAvg || apiTender.amount || 0,
    companyAgeMonths: apiTender.companyAgeMonths || 12,
    factors: apiTender.factors || {},
  };
};

function Tenders({ darkMode }) {
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [selectedSector, setSelectedSector] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [expandedRow, setExpandedRow] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  // Fetch tenders from API
  const fetchTenders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tenders/`);
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      const data = await response.json();
      const transformedData = data.map(transformTender);
      setTenders(transformedData);
      setApiError(false);
    } catch (error) {
      console.error('Error fetching tenders:', error);
      setApiError(true);
      // Fallback to mock data (from previous implementation)
      const mockData = generateMockTenders();
      setTenders(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock tenders for fallback
  const generateMockTenders = () => {
    const mock = [];
    for (let i = 1; i <= 50; i++) {
      const riskScore = Math.random() > 0.7 ? Math.floor(Math.random() * 60 + 60) : Math.floor(Math.random() * 60);
      const riskLevel = riskScore >= 80 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
      const factors = [];
      if (riskScore >= 80) {
        if (Math.random() > 0.5) factors.push('priceAnomaly');
        if (Math.random() > 0.6) factors.push('newCompany');
        if (Math.random() > 0.7) factors.push('addressMatch');
      } else if (riskScore >= 40) {
        if (Math.random() > 0.6) factors.push('priceAnomaly');
      }
      mock.push({
        id: `TG-2024-${String(i).padStart(4, '0')}`,
        organization: `Tashkilot ${i}`,
        name: `Tender nomi ${i}`,
        amount: Math.floor(Math.random() * 500000000 + 1000000),
        date: `2024-${Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`,
        region: ['Toshkent', 'Samarqand', "Farg'ona", 'Namangan', 'Buxoro'][Math.floor(Math.random() * 5)],
        sector: ['Qurilish', 'Tibbiyot', 'IT', "Ta'lim", 'Transport'][Math.floor(Math.random() * 5)],
        riskScore: riskScore,
        riskLevel: riskLevel,
        riskFactors: factors,
        marketAvg: Math.floor(Math.random() * 300000000 + 500000),
      });
    }
    return mock;
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  // Filter options
  const regions = useMemo(() => [...new Set(tenders.map(t => t.region).filter(Boolean))], [tenders]);
  const sectors = useMemo(() => [...new Set(tenders.map(t => t.sector).filter(Boolean))], [tenders]);
  const riskOptions = ['critical', 'high', 'medium', 'low'];

  // Filter and sort tenders
  const filteredTenders = useMemo(() => {
    let filtered = [...tenders];

    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRisk.length > 0) {
      filtered = filtered.filter(t => selectedRisk.includes(t.riskLevel));
    }

    if (selectedRegion.length > 0) {
      filtered = filtered.filter(t => selectedRegion.includes(t.region));
    }

    if (selectedSector.length > 0) {
      filtered = filtered.filter(t => selectedSector.includes(t.sector));
    }

    if (dateRange.start) {
      filtered = filtered.filter(t => t.date >= dateRange.start);
    }
    if (dateRange.end) {
      filtered = filtered.filter(t => t.date <= dateRange.end);
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === 'amount') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    return filtered;
  }, [tenders, searchQuery, selectedRisk, selectedRegion, selectedSector, dateRange, sortBy, sortOrder]);

  const paginatedTenders = filteredTenders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalCount = filteredTenders.length;

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleFilterClick = (event) => setFilterAnchorEl(event.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRisk([]);
    setSelectedRegion([]);
    setSelectedSector([]);
    setDateRange({ start: '', end: '' });
    setPage(0);
  };

  const activeFiltersCount = 
    selectedRisk.length + selectedRegion.length + selectedSector.length + 
    (dateRange.start ? 1 : 0) + (dateRange.end ? 1 : 0) + (searchQuery ? 1 : 0);

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: colors.blue }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh', width: '100%' }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: colors.textPrimary }}>
            Shubhali Tenderlar
          </Typography>
          <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
            Jami {totalCount} ta tender • {filteredTenders.filter(t => t.riskScore >= 80).length} ta yuqori xavfli
          </Typography>
        </Box>
        {apiError && (
          <Chip 
            icon={<FiInfo size={14} />} 
            label="API ulanmadi, demo ma'lumotlar ko'rsatilmoqda" 
            size="small" 
            sx={{ bgcolor: alpha(colors.orange, 0.1), color: colors.orange }} 
          />
        )}
      </Box>

      {/* Search and Filters Bar */}
      <Card sx={{ borderRadius: 1, mb: 3, bgcolor: colors.bgCard }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Tender ID, tashkilot yoki nom bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 2, minWidth: 280 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiSearch size={18} style={{ color: colors.textSecondary }} />
                    </InputAdornment>
                  ),
                  sx: { bgcolor: alpha(colors.textPrimary, 0.03), borderRadius: 2 }
                }
              }}
            />
            <TextField
              size="small"
              type="date"
              label="Boshlanish"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              sx={{ width: 140 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              size="small"
              type="date"
              label="Tugash"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              sx={{ width: 140 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Button
              variant="outlined"
              startIcon={<FiFilter />}
              onClick={handleFilterClick}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Filtr
              {activeFiltersCount > 0 && (
                <Badge badgeContent={activeFiltersCount} color="error" sx={{ ml: 1 }} />
              )}
            </Button>
            <Button
              variant="contained"
              startIcon={<FiDownload />}
              sx={{ borderRadius: 2, textTransform: 'none', bgcolor: colors.blue }}
            >
              Eksport
            </Button>
            <Button
              variant="outlined"
              startIcon={<FiRefreshCw />}
              onClick={fetchTenders}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Yangilash
            </Button>
            {activeFiltersCount > 0 && (
              <Button onClick={clearFilters} sx={{ textTransform: 'none', color: colors.textSecondary }}>
                Tozalash
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        slotProps={{ paper: { sx: { width: 280, p: 2, bgcolor: colors.bgCard } } }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: colors.textPrimary }}>Xavf darajasi</Typography>
        <Box sx={{ mb: 2 }}>
          {riskOptions.map(risk => (
            <Box key={risk} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Checkbox
                size="small"
                checked={selectedRisk.includes(risk)}
                onChange={() => {
                  if (selectedRisk.includes(risk)) {
                    setSelectedRisk(selectedRisk.filter(r => r !== risk));
                  } else {
                    setSelectedRisk([...selectedRisk, risk]);
                  }
                }}
                sx={{ color: colors.textSecondary }}
              />
              <Chip 
                label={riskLevels[risk]?.label || risk} 
                size="small" 
                sx={{ bgcolor: riskLevels[risk]?.bg || alpha(colors.textSecondary, 0.1), color: riskLevels[risk]?.color || colors.textSecondary }} 
              />
            </Box>
          ))}
        </Box>
        <Divider sx={{ my: 1.5, borderColor: colors.border }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: colors.textPrimary }}>Viloyat</Typography>
        <FormControl size="small" fullWidth sx={{ mb: 2 }}>
          <Select
            multiple
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map(v => <Chip key={v} label={v} size="small" />)}
              </Box>
            )}
            sx={{ color: colors.textPrimary }}
          >
            {regions.map(region => (
              <MenuItem key={region} value={region}>
                <Checkbox checked={selectedRegion.includes(region)} size="small" />
                {region}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: colors.textPrimary }}>Soha</Typography>
        <FormControl size="small" fullWidth>
          <Select
            multiple
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map(v => <Chip key={v} label={v} size="small" />)}
              </Box>
            )}
            sx={{ color: colors.textPrimary }}
          >
            {sectors.map(sector => (
              <MenuItem key={sector} value={sector}>
                <Checkbox checked={selectedSector.includes(sector)} size="small" />
                {sector}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Menu>

      {/* Tenders Table */}
      <Card sx={{ borderRadius: 1, bgcolor: colors.bgCard, overflow: 'hidden' }}>
        <TableContainer sx={{ overflowX: 'auto', width: '100%' }}>
          <Table sx={{ minWidth: 1100, width: '100%' }}>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(colors.textPrimary, 0.03) }}>
                <TableCell sx={{ width: 40 }}>#</TableCell>
                <TableCell sx={{ minWidth: 110 }}>Tender ID</TableCell>
                <TableCell sx={{ minWidth: 220 }}>Tashkilot / Nom</TableCell>
                <TableCell sx={{ minWidth: 130 }}>Summa / Bozor</TableCell>
                <TableCell sx={{ width: 90 }}>Sana</TableCell>
                <TableCell sx={{ width: 100 }}>Viloyat</TableCell>
                <TableCell sx={{ width: 100 }}>Soha</TableCell>
                <TableCell sx={{ width: 90 }}>Risk</TableCell>
                <TableCell sx={{ width: 110 }}>Sabablar</TableCell>
                <TableCell sx={{ width: 80 }} align="center">Amal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTenders.map((tender, idx) => {
                const riskLevel = riskLevels[tender.riskLevel] || riskLevels.low;
                const isExpanded = expandedRow === tender.id;
                
                return (
                  <React.Fragment key={tender.id}>
                    <TableRow
                      hover
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { bgcolor: alpha(colors.textPrimary, 0.03) },
                      }}
                      onClick={() => navigate(`/tender/${tender.id}`)}
                    >
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExpandRow(tender.id);
                          }}
                          sx={{ color: colors.textSecondary }}
                        >
                          {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary, fontFamily: 'monospace' }}>
                          {tender.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: colors.textPrimary }}>
                          {tender.organization?.length > 40 ? `${tender.organization.substring(0, 40)}...` : tender.organization}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'block' }}>
                          {tender.name?.length > 50 ? `${tender.name.substring(0, 50)}...` : tender.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                          {formatAmount(tender.amount)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                          Bozor: {formatAmount(tender.marketAvg)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: colors.textPrimary }}>
                          {formatDate(tender.date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                          {tender.region}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tender.sector}
                          size="small"
                          sx={{ bgcolor: alpha(colors.blue, 0.1), color: colors.blue, fontSize: '0.7rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Chip
                            label={tender.riskScore}
                            size="small"
                            sx={{
                              bgcolor: alpha(riskLevel.color, 0.15),
                              color: riskLevel.color,
                              fontWeight: 700,
                              minWidth: 45,
                            }}
                          />
                          <Chip
                            label={riskLevel.label}
                            size="small"
                            sx={{ bgcolor: riskLevel.bg, color: riskLevel.color, fontSize: '0.65rem', height: 22 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {tender.riskFactors.map(factor => (
                            <Tooltip key={factor} title={riskFactorsMap[factor]?.tooltip || factor}>
                              <Box
                                sx={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: '50%',
                                  bgcolor: alpha(riskFactorsMap[factor]?.color || colors.textSecondary, 0.15),
                                  color: riskFactorsMap[factor]?.color || colors.textSecondary,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {riskFactorsMap[factor]?.icon || <FiInfo size={14} />}
                              </Box>
                            </Tooltip>
                          ))}
                          {tender.riskFactors.length === 0 && (
                            <Typography variant="caption" sx={{ color: colors.textSecondary }}>—</Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Batafsil ko'rish">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/tender/${tender.id}`);
                            }}
                            sx={{ color: colors.blue }}
                          >
                            <FiEye size={18} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Row */}
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={10} sx={{ p: 0, borderBottom: 'none' }}>
                          <Collapse in={isExpanded} timeout="auto">
                            <Box sx={{ p: 3, bgcolor: alpha(colors.textPrimary, 0.02), borderTop: `1px solid ${colors.border}` }}>
                              <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.textPrimary, mb: 2 }}>
                                    Risk omillari tahlili
                                  </Typography>
                                  <Stack spacing={2}>
                                    {tender.riskFactors.length > 0 ? tender.riskFactors.map(factor => {
                                      const factorInfo = riskFactorsMap[factor];
                                      return (
                                        <Box
                                          key={factor}
                                          sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: alpha(factorInfo?.color || colors.textSecondary, 0.08),
                                            borderLeft: `3px solid ${factorInfo?.color || colors.textSecondary}`,
                                          }}
                                        >
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            {factorInfo?.icon}
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: factorInfo?.color || colors.textSecondary }}>
                                              {factorInfo?.label} anomaliyasi
                                            </Typography>
                                          </Box>
                                          <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                            {factor === 'priceAnomaly' && `Tender summasi bozor narxidan ${(tender.amount / tender.marketAvg).toFixed(1)}x yuqori (+40 ball)`}
                                            {factor === 'newCompany' && `G'olib kompaniya 6 oydan kam oldin tashkil etilgan (+30 ball)`}
                                            {factor === 'addressMatch' && `Ishtirokchilar bir xil manzilda ro'yxatdan o'tgan (+50 ball)`}
                                          </Typography>
                                        </Box>
                                      );
                                    }) : (
                                      <Typography variant="body2" sx={{ color: colors.green }}>
                                        Hech qanday xavf omili aniqlanmadi
                                      </Typography>
                                    )}
                                  </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.textPrimary, mb: 2 }}>
                                    AI tavsiyasi
                                  </Typography>
                                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(colors.blue, 0.05), border: `1px solid ${alpha(colors.blue, 0.2)}` }}>
                                    <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
                                      {tender.riskScore >= 80 ? (
                                        <><strong>⚠️ Yuqori xavfli tender</strong> — ushbu tender bir nechta xavf mezonlariga mos keladi. Qo'shimcha tekshiruv tavsiya etiladi.</>
                                      ) : tender.riskScore >= 40 ? (
                                        <><strong>⚠️ O'rtacha xavfli tender</strong> — tenderda ba'zi xavf omillari mavjud. Kuzatuvda bo'lishi kerak.</>
                                      ) : (
                                        <><strong>✓ Past xavfli tender</strong> — tender normal holatda. Hech qanday xavf omili aniqlanmadi.</>
                                      )}
                                    </Typography>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      onClick={() => navigate(`/tender/${tender.id}`)}
                                      sx={{ mt: 1, textTransform: 'none' }}
                                    >
                                      Batafsil tahlil
                                    </Button>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[10, 15, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ borderTop: `1px solid ${colors.border}`, color: colors.textSecondary }}
        />
      </Card>
    </Box>
  );
}

export default Tenders;
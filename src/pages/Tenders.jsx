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
  Avatar,
  Tooltip,
  Popover,
  Stack,
  Divider,
  Badge,
  Collapse,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
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
} from 'react-icons/fi';
import {
  MdWarning,
  MdLocationOn,
  MdBusiness,
  MdAttachMoney,
  MdErrorOutline,
} from 'react-icons/md';

// Extended mock tender data with more entries
const mockTenders = [
  { id: 'TG-2024-0075', organization: "Buxoro viloyat Yo'l Xo'jaligi", name: 'IT infratuzilma modernizatsiyasi', amount: 130200000, date: '2024-07-05', region: 'Namangan', sector: 'Tibbiyot', riskScore: 120, riskLevel: 'critical', riskFactors: ['price', 'newCompany', 'address'], participants: [], marketAvg: 62000000 },
  { id: 'TG-2024-0046', organization: "Buxoro viloyat Yo'l Xo'jaligi", name: 'Poliklinika jihozlash', amount: 252800000, date: '2024-05-18', region: 'Buxoro', sector: 'Energetika', riskScore: 120, riskLevel: 'critical', riskFactors: ['price', 'newCompany', 'address'], participants: [], marketAvg: 79000000 },
  { id: 'TG-2024-0041', organization: "Samarqand viloyat Sog'liqni Saqlash Departamenti", name: 'Gaz tarmog\'i kengaytirish', amount: 182400000, date: '2024-02-11', region: 'Buxoro', sector: 'Energetika', riskScore: 120, riskLevel: 'critical', riskFactors: ['price', 'newCompany', 'address'], participants: [], marketAvg: 57000000 },
  { id: 'TG-2024-0033', organization: "Termiz shahar Uy-joy Xo'jaligi", name: 'Ko\'prik ta\'mirlash', amount: 399000000, date: '2024-05-06', region: 'Buxoro', sector: 'Qishloq xo\'jaligi', riskScore: 120, riskLevel: 'critical', riskFactors: ['price', 'newCompany', 'address'], participants: [], marketAvg: 190000000 },
  { id: 'TG-2024-0029', organization: "Qarshi shahar Sanitariya", name: 'Server uskunalari xaridi', amount: 1400000000, date: '2024-06-11', region: 'Toshkent shahri', sector: 'Qishloq xo\'jaligi', riskScore: 120, riskLevel: 'critical', riskFactors: ['price', 'newCompany', 'address'], participants: [], marketAvg: 485000000 },
  { id: 'TG-2024-0021', organization: "Termiz shahar Uy-joy Xo'jaligi", name: 'Sug\'orish tizimi', amount: 1400000000, date: '2024-06-26', region: 'Namangan', sector: 'Tibbiyot', riskScore: 120, riskLevel: 'critical', riskFactors: ['price', 'newCompany', 'address'], participants: [], marketAvg: 441000000 },
  { id: 'TG-2024-0020', organization: "Qarshi shahar Sanitariya", name: 'Sug\'orish tizimi', amount: 1100000000, date: '2024-02-02', region: 'Buxoro', sector: 'Energetika', riskScore: 120, riskLevel: 'critical', riskFactors: ['price', 'newCompany', 'address'], participants: [], marketAvg: 464000000 },
  { id: 'TG-2024-0010', organization: "Namangan shahar hokimligi", name: 'Sport majmuasi qurilishi', amount: 451200000, date: '2024-07-04', region: 'Farg\'ona', sector: 'Transport', riskScore: 120, riskLevel: 'critical', riskFactors: ['price', 'newCompany', 'address'], participants: [], marketAvg: 141000000 },
  { id: 'TG-2024-0079', organization: "Termiz shahar Uy-joy Xo'jaligi", name: 'Sug\'orish tizimi', amount: 854700000, date: '2024-02-27', region: 'Xorazm', sector: 'Transport', riskScore: 90, riskLevel: 'high', riskFactors: ['price', 'address'], participants: [], marketAvg: 407000000 },
  { id: 'TG-2024-0066', organization: "Xorazm viloyat Qishloq Xo'jaligi", name: 'Elektr tarmog\'i yangilash', amount: 297600000, date: '2024-04-03', region: 'Toshkent shahri', sector: 'Ta\'lim', riskScore: 90, riskLevel: 'high', riskFactors: ['price', 'address'], participants: [], marketAvg: 93000000 },
  { id: 'TG-2024-0061', organization: "Sirdaryo viloyat Transport Boshqarmasi", name: 'Ko\'cha chiroqlari o\'rnatish', amount: 709800000, date: '2024-10-24', region: 'Namangan', sector: 'Energetika', riskScore: 90, riskLevel: 'high', riskFactors: ['price', 'address'], participants: [], marketAvg: 338000000 },
  { id: 'TG-2024-0060', organization: "Xorazm viloyat Qishloq Xo'jaligi", name: 'Suv ta\'minoti tizimi', amount: 203700000, date: '2024-04-06', region: 'Surxondaryo', sector: 'Ta\'lim', riskScore: 90, riskLevel: 'high', riskFactors: ['price', 'address'], participants: [], marketAvg: 97000000 },
];

// Risk level configuration
const riskLevels = {
  critical: { label: 'Kritik', color: '#f44336', bg: 'rgba(244, 67, 54, 0.12)', icon: <MdErrorOutline /> },
  high: { label: 'Yuqori', color: '#ff7043', bg: 'rgba(255, 112, 67, 0.12)', icon: <MdWarning /> },
  medium: { label: "O'rtacha", color: '#ffb74d', bg: 'rgba(255, 183, 77, 0.12)', icon: <FiAlertTriangle /> },
  low: { label: 'Past', color: '#4caf50', bg: 'rgba(76, 175, 80, 0.12)', icon: <FiCheckCircle /> },
};

// Risk factors mapping
const riskFactorsMap = {
  price: { label: 'Narx', color: '#f44336', icon: <MdAttachMoney size={14} />, tooltip: 'Narx anomaliyasi' },
  newCompany: { label: 'Yangi', color: '#ff7043', icon: <MdBusiness size={14} />, tooltip: 'Yangi kompaniya' },
  address: { label: 'Manzil', color: '#ab47bc', icon: <MdLocationOn size={14} />, tooltip: 'Manzil moslik' },
};

const formatAmount = (amount) => {
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(1)}mlrd so'm`;
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(1)}mln so'm`;
  return `${amount.toLocaleString()} so'm`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' });
};

function Tenders({ darkMode }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State
  const [tenders] = useState(mockTenders);
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

  // Filter options
  const regions = [...new Set(tenders.map(t => t.region))];
  const sectors = [...new Set(tenders.map(t => t.sector))];
  const riskOptions = ['critical', 'high', 'medium', 'low'];

  // Filter and sort tenders
  const filteredTenders = useMemo(() => {
    let filtered = [...tenders];

    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
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
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh', width: '100%' }}>
      {/* Page Header */}


      {/* Search and Filters Bar */}
      <Card sx={{ borderRadius: 1, mb: 2, bgcolor: colors.bgCard,  }}>
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
            {activeFiltersCount > 0 && (
              <Button onClick={clearFilters} sx={{ textTransform: 'none' }}>
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
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Xavf darajasi</Typography>
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
              />
              <Chip label={riskLevels[risk].label} size="small" sx={{ bgcolor: riskLevels[risk].bg, color: riskLevels[risk].color }} />
            </Box>
          ))}
        </Box>
        <Divider sx={{ my: 1.5 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Viloyat</Typography>
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
          >
            {regions.map(region => (
              <MenuItem key={region} value={region}>
                <Checkbox checked={selectedRegion.includes(region)} size="small" />
                {region}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Soha</Typography>
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

      {/* Tenders Table - Full width and expanded */}
      <Card sx={{ borderRadius: 1, bgcolor: colors.bgCard,  overflow: 'hidden' }}>
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
                const riskLevel = riskLevels[tender.riskLevel];
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
                          {tender.organization}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'block' }}>
                          {tender.name}
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
                            <Tooltip key={factor} title={riskFactorsMap[factor].tooltip}>
                              <Box
                                sx={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: '50%',
                                  bgcolor: alpha(riskFactorsMap[factor].color, 0.15),
                                  color: riskFactorsMap[factor].color,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {riskFactorsMap[factor].icon}
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
                    
                    {/* Expanded Row - Risk Details */}
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={10} sx={{ p: 0, borderBottom: 'none' }}>
                          <Collapse in={isExpanded} timeout="auto">
                            <Box sx={{ p: 3, bgcolor: alpha(colors.textPrimary, 0.02), borderTop: `1px solid ${colors.border}` }}>
                              <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                                    Risk omillari tahlili
                                  </Typography>
                                  <Stack spacing={2}>
                                    {tender.riskFactors.map(factor => (
                                      <Box
                                        key={factor}
                                        sx={{
                                          p: 2,
                                          borderRadius: 2,
                                          bgcolor: alpha(riskFactorsMap[factor].color, 0.08),
                                          borderLeft: `3px solid ${riskFactorsMap[factor].color}`,
                                        }}
                                      >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                          {riskFactorsMap[factor].icon}
                                          <Typography variant="body2" sx={{ fontWeight: 600, color: riskFactorsMap[factor].color }}>
                                            {riskFactorsMap[factor].label} anomaliyasi
                                          </Typography>
                                        </Box>
                                        <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                          {factor === 'price' && `Tender summasi bozor narxidan ${(tender.amount / tender.marketAvg).toFixed(1)}x yuqori (+40 ball)`}
                                          {factor === 'newCompany' && `G'olib kompaniya 6 oydan kam oldin tashkil etilgan (+30 ball)`}
                                          {factor === 'address' && `Ishtirokchilar bir xil manzilda ro'yxatdan o'tgan (+50 ball)`}
                                        </Typography>
                                      </Box>
                                    ))}
                                    {tender.riskFactors.length === 0 && (
                                      <Typography variant="body2" sx={{ color: colors.green }}>
                                        Hech qanday xavf omili aniqlanmadi
                                      </Typography>
                                    )}
                                  </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                                    AI tavsiyasi
                                  </Typography>
                                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(colors.blue, 0.05), border: `1px solid ${alpha(colors.blue, 0.2)}` }}>
                                    <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
                                      <strong>⚠️ Yuqori xavfli tender</strong> — ushbu tender barcha uchta xavf mezoniga mos keladi.
                                      Tender summasi bozor narxidan haddan tashqari yuqori, g'olib kompaniya yangi tashkil etilgan va
                                      ishtirokchilar bir xil manzilda ro'yxatdan o'tgan. Qo'shimcha tekshiruv tavsiya etiladi.
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
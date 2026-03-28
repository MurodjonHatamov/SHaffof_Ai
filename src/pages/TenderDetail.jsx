import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Avatar,
  Grid,
  Alert,
  Snackbar,
  Breadcrumbs,
  Link,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton as MuiIconButton,
  Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  FiArrowLeft,
  FiDownload,
  FiFlag,
  FiInfo,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiMaximize2,
  FiMinimize2,
  FiZoomIn,
} from 'react-icons/fi';
import {
  MdWarning,
  MdLocationOn,
  MdBusiness,
  MdAttachMoney,
} from 'react-icons/md';
import { FaRobot, FaChartLine, FaNetworkWired } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import * as d3 from 'd3';

// Mock tender data
const mockTenderData = {
  id: 'TG-2024-0074',
  organization: "Buxoro viloyat Yo'l Xo'jaligi",
  name: 'Server uskunalari xaridi',
  amount: 212800000,
  date: '2024-09-27',
  region: 'Surxondaryo',
  sector: 'Transport',
  riskScore: 90,
  riskLevel: 'high',
  riskLevelText: 'Yuqori Xavf',
  riskColor: '#ff7043',
  factors: {
    priceAnomaly: {
      triggered: true,
      points: 40,
      maxPoints: 40,
      desc: 'Tender summasi (212.8mln so\'m) bozor o\'rtachasidan (76.0mln so\'m) 2.8x yuqori',
      multiplier: 2.8,
    },
    newCompany: {
      triggered: false,
      points: 0,
      maxPoints: 30,
      desc: 'Kompaniya 25 oy oldin tashkil etilgan — mezon bajarilmadi',
      ageMonths: 25,
    },
    addressMatch: {
      triggered: true,
      points: 50,
      maxPoints: 50,
      desc: 'Ishtirokchilardan kamida ikkitasi bir xil yuridik manzilda ro\'yxatdan o\'tgan',
    },
  },
  marketAvg: 76000000,
  companyAgeMonths: 25,
  participants: [
    { name: 'YuksakSifat MChJ', type: 'company', role: "G'olib", director: 'Mirzayev A.', address: 'Toshkent sh., Yunusobod t., A. Qodiriy ko\'chasi, 1-uy', founded: '2022-08-15', ageMonths: 25, id: 'comp1' },
    { name: 'GlobalTender AJ', type: 'company', role: 'Qatnashchi', director: 'Xoliqov M.', address: 'Toshkent sh., Yunusobod t., A. Qodiriy ko\'chasi, 1-uy', founded: '2023-01-20', ageMonths: 20, id: 'comp2' },
    { name: 'PrimeStar MChJ', type: 'company', role: 'Qatnashchi', director: 'Hasanov J.', address: 'Samarqand sh., 45-kvartira', founded: '2019-11-10', ageMonths: 58, id: 'comp3' },
  ],
  timeline: [
    { date: '2024-09-17', title: 'Tender e\'lon qilindi', desc: 'xarid.uz platformasida tender e\'lon qilindi. Boshlang\'ich summa: 212.8mln so\'m', type: 'info', icon: 'upload' },
    { date: '2024-09-22', title: 'Ariza topshirish boshlandi', desc: '3 ta kompaniya ariza topshirdi', type: 'info', icon: 'file' },
    { date: '2024-09-24', title: 'Manzil moslik topildi', desc: 'Ishtirokchilardan ikki yoki undan ko\'proqning manzili mos keladi', type: 'warning', icon: 'location' },
    { date: '2024-09-27', title: "G'olib aniqlandi", desc: 'YuksakSifat MChJ g\'olib deb e\'lon qilindi', type: 'success', icon: 'trophy' },
    { date: '2024-09-28', title: 'Narx anomaliyasi bayroq qo\'yildi', desc: 'Shartnoma summasi bozor narxidan 2.8x yuqori', type: 'danger', icon: 'warning' },
  ],
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

const getRiskGaugeColor = (score) => {
  if (score >= 80) return '#f44336';
  if (score >= 40) return '#ff7043';
  return '#4caf50';
};

// Risk Gauge Component
const RiskGauge = ({ score }) => {
  const percentage = Math.min((score / 120) * 100, 100);
  const color = getRiskGaugeColor(score);
  const angle = (percentage / 100) * Math.PI - Math.PI;
  const needleX = 100 + 70 * Math.cos(angle);
  const needleY = 100 + 70 * Math.sin(angle);
  const circumference = 251.2;
  const dashLength = (percentage / 100) * circumference;

  return (
    <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ position: 'relative', width: 200, height: 120 }}>
        <svg width="200" height="120" viewBox="0 0 200 120">
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" strokeLinecap="round" />
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${dashLength} ${circumference}`} />
          <line x1="100" y1="100" x2={needleX} y2={needleY} stroke={color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="8" fill={color} />
        </svg>
        <Box sx={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color }}>{score}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Risk Bali</Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Network Graph Component with D3.js drag and zoom
const NetworkGraph = ({ tender, onZoom }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [simulation, setSimulation] = useState(null);
  const [zoomTransform, setZoomTransform] = useState({ x: 0, y: 0, k: 1 });

  useEffect(() => {
    if (!tender || !tender.participants || !svgRef.current) return;

    const width = containerRef.current?.offsetWidth || 700;
    const height = 380;

    // Prepare nodes
    const nodes = [
      { id: 'tender', label: tender.id, type: 'tender', icon: '⚠', fixed: true, fx: width / 2, fy: 50 },
      ...tender.participants.map((p, idx) => ({
        id: p.id || `comp${idx}`,
        label: p.name.substring(0, 15),
        type: 'company',
        icon: '🏢',
        role: p.role,
        details: p,
        x: width / 2 + (idx - 1) * 150,
        y: 150,
      })),
      ...tender.participants.map((p, idx) => ({
        id: `person${idx}`,
        label: p.director,
        type: 'person',
        icon: '👤',
        details: p,
        x: width / 2 + (idx - 1) * 150,
        y: 250,
      })),
    ];

    // Prepare links
    const links = [
      ...tender.participants.map((p, idx) => ({ source: p.id || `comp${idx}`, target: 'tender', label: p.role === "G'olib" ? "G'olib" : 'Qatnashchi', color: p.role === "G'olib" ? '#4caf50' : '#8892b0' })),
      ...tender.participants.map((p, idx) => ({ source: `person${idx}`, target: p.id || `comp${idx}`, label: 'Direktor', color: '#8892b0' })),
    ];

    // Add suspicious connections for same address
    if (tender.participants[0]?.address === tender.participants[1]?.address) {
      links.push({ source: tender.participants[0].id || 'comp0', target: tender.participants[1].id || 'comp1', label: 'Bir manzil!', color: '#f44336', dashed: true });
    }

    // Clear previous SVG
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('background', 'transparent')
      .style('cursor', 'grab');

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform);
        setZoomTransform({ x: event.transform.x, y: event.transform.y, k: event.transform.k });
      });

    svg.call(zoom);

    // Create group for all elements
    const g = svg.append('g');

    // Add arrow markers
    const defs = svg.append('defs');
    ['arrow-normal', 'arrow-suspicious'].forEach(id => {
      defs.append('marker')
        .attr('id', id)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 22)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', id === 'arrow-suspicious' ? '#f44336' : 'rgba(136,146,176,0.4)');
    });

    // Create simulation
    const newSimulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // Draw links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', d => d.color || (d.dashed ? '#f44336' : 'rgba(136,146,176,0.4)'))
      .attr('stroke-width', d => d.dashed ? 2 : 1.5)
      .attr('stroke-dasharray', d => d.dashed ? '5,5' : 'none')
      .attr('marker-end', d => `url(#${d.dashed ? 'arrow-suspicious' : 'arrow-normal'})`);

    // Draw link labels
    const linkLabel = g.append('g')
      .selectAll('text')
      .data(links)
      .enter()
      .append('text')
      .attr('font-size', '9px')
      .attr('fill', d => d.color || (d.dashed ? '#f44336' : 'rgba(136,146,176,0.6)'))
      .attr('text-anchor', 'middle')
      .text(d => d.label);

    // Draw nodes
    const nodeGroup = g.append('g')
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) newSimulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) newSimulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    const nodeColors = { tender: '#f44336', company: '#5c9eff', person: '#ff7043' };

    nodeGroup.append('circle')
      .attr('r', d => d.type === 'tender' ? 28 : d.type === 'company' ? 24 : 20)
      .attr('fill', d => alpha(nodeColors[d.type], 0.15))
      .attr('stroke', d => nodeColors[d.type])
      .attr('stroke-width', 2);

    nodeGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', d => d.type === 'tender' ? 20 : d.type === 'company' ? 18 : 14)
      .attr('fill', d => nodeColors[d.type])
      .text(d => d.icon);

    nodeGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', d => (d.type === 'tender' ? 40 : 32))
      .attr('font-size', '10px')
      .attr('fill', '#8892b0')
      .text(d => d.label);

    if (nodes.some(n => n.role)) {
      nodeGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', d => (d.type === 'tender' ? 52 : 44))
        .attr('font-size', '9px')
        .attr('fill', d => d.role === "G'olib" ? '#4caf50' : '#8892b0')
        .text(d => d.role || '');
    }

    // Risk Breakdown Chart Component with Chart.js
const RiskBreakdownChart = ({ factors }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !factors) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    const labels = ['Narx Anomaliyasi', 'Yangi Kompaniya', 'Manzil Moslik'];
    const data = [
      factors.priceAnomaly?.points || 0,
      factors.newCompany?.points || 0,
      factors.addressMatch?.points || 0,
    ];
    const maxData = [40, 30, 50];
    const colors = ['#f44336', '#ff7043', '#ab47bc'];

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Berilgan ball',
            data: data,
            backgroundColor: colors.map(c => c + 'cc'),
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.6,
            categoryPercentage: 0.8,
          },
          {
            label: 'Maksimal ball',
            data: maxData,
            backgroundColor: colors.map(c => c + '20'),
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.6,
            categoryPercentage: 0.8,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'top',
            labels: { 
              padding: 16, 
              usePointStyle: true,
              color: '#8892b0',
              font: { family: 'Inter', size: 12 }
            } 
          },
          tooltip: {
            backgroundColor: '#141d35',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleColor: '#e8eaf6',
            bodyColor: '#8892b0',
            padding: 10,
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${context.raw} ball`;
              }
            }
          }
        },
        scales: {
          x: { 
            grid: { display: false }, 
            ticks: { 
              color: '#8892b0',
              font: { family: 'Inter', size: 12 }
            } 
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { 
              color: '#8892b0',
              font: { family: 'Inter', size: 11 },
              stepSize: 10,
              callback: (value) => `${value} ball`
            },
            max: 55,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Ball',
              color: '#8892b0',
              font: { family: 'Inter', size: 11 }
            }
          }
        },
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [factors]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', maxHeight: 280 }} />;
};
    // Tooltip
    const tooltip = d3.select('body').append('div')
      .style('position', 'absolute')
      .style('background', '#141d35')
      .style('border', '1px solid rgba(255,255,255,0.1)')
      .style('border-radius', '8px')
      .style('padding', '10px 14px')
      .style('font-size', '12px')
      .style('color', '#e8eaf6')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 100)
      .style('max-width', '250px');

    nodeGroup.on('mouseover', function(event, d) {
      let html = `<strong>${d.label}</strong><br>`;
      html += `Turi: ${d.type === 'company' ? 'Kompaniya' : d.type === 'person' ? 'Shaxs' : 'Tender'}<br>`;
      if (d.details) {
        html += `Direktor: ${d.details.director}<br>`;
        html += `Yoshi: ${d.details.ageMonths} oy<br>`;
        html += `Manzil: ${d.details.address}`;
        if (d.details.ageMonths < 6) html += `<br><span style="color:#ff7043">⚠ Yangi kompaniya!</span>`;
      }
      tooltip.html(html)
        .style('opacity', 1)
        .style('left', (event.pageX + 12) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    }).on('mouseout', () => tooltip.style('opacity', 0));

    // Update positions
    newSimulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      linkLabel
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2 - 4);

      nodeGroup.attr('transform', d => `translate(${d.x}, ${d.y})`);
    });

    setSimulation(newSimulation);

    return () => {
      if (newSimulation) newSimulation.stop();
      tooltip.remove();
    };
  }, [tender]);

  const handleResetZoom = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(500).call(d3.zoom().transform, d3.zoomIdentity);
    }
  };

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%', height: 380 }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%', background: 'transparent' }} />
      <Box sx={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 1, zIndex: 10 }}>
        <Tooltip title="Kattalashtirish">
          <IconButton size="small" onClick={() => onZoom?.()} sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}>
            <FiZoomIn size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Asl holatga qaytarish">
          <IconButton size="small" onClick={handleResetZoom} sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}>
            <FiMinimize2 size={16} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

// Timeline Component
const Timeline = ({ items }) => {
  if (!items) return null;
  
  const getIcon = (type) => {
    switch(type) {
      case 'upload': return <FiDownload size={14} />;
      case 'file': return <FiCheckCircle size={14} />;
      case 'location': return <MdLocationOn size={14} />;
      case 'trophy': return <FiCheckCircle size={14} />;
      case 'warning': return <FiAlertTriangle size={14} />;
      default: return <FiInfo size={14} />;
    }
  };

  const getColor = (type) => {
    switch(type) {
      case 'upload': return '#5c9eff';
      case 'file': return '#5c9eff';
      case 'location': return '#ff7043';
      case 'trophy': return '#4caf50';
      case 'warning': return '#f44336';
      default: return '#8892b0';
    }
  };

  return (
    <Box sx={{ maxHeight: 360, overflowY: 'auto', pr: 1 }}>
      {items.map((item, idx) => (
        <Box key={idx} sx={{ display: 'flex', gap: 2, pb: 2, position: 'relative' }}>
          {idx < items.length - 1 && <Box sx={{ position: 'absolute', left: 15, top: 32, bottom: 0, width: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />}
          <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(getColor(item.type), 0.15), color: getColor(item.type), zIndex: 1 }}>{getIcon(item.type)}</Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{formatDate(item.date)}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mt: 0.5 }}>{item.title}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>{item.desc}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

function TenderDetail({ darkMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tender] = useState(mockTenderData);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [modalOpen, setModalOpen] = useState(false);

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

  const riskChartData = [
    { name: 'Narx Anomaliyasi', value: tender.factors.priceAnomaly.points, max: tender.factors.priceAnomaly.maxPoints, color: colors.red },
    { name: 'Yangi Kompaniya', value: tender.factors.newCompany.points, max: tender.factors.newCompany.maxPoints, color: colors.textSecondary },
    { name: 'Manzil Moslik', value: tender.factors.addressMatch.points, max: tender.factors.addressMatch.maxPoints, color: colors.purple },
  ];

  const handleReport = () => {
    setSnackbar({ open: true, message: 'Hisobot yuklanmoqda...', severity: 'info' });
    setTimeout(() => setSnackbar({ open: true, message: 'Hisobot tayyor', severity: 'success' }), 1500);
  };

  const handleFlag = () => {
    setSnackbar({ open: true, message: 'Tender bayroq qo\'yildi', severity: 'success' });
  };

  const handleZoomGraph = () => {
    setModalOpen(true);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh', width: '100%' }}>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer', color: colors.textSecondary }}>Asosiy</Link>
        <Link underline="hover" color="inherit" onClick={() => navigate('/tenders')} sx={{ cursor: 'pointer', color: colors.textSecondary }}>Shubhali Tenderlar</Link>
        <Typography color={colors.textPrimary}>{tender.id}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <IconButton onClick={() => navigate('/tenders')} sx={{ color: colors.textSecondary }}><FiArrowLeft size={20} /></IconButton>
            <Typography variant="h4" sx={{ fontWeight: 800, color: colors.textPrimary }}>{tender.organization}</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: colors.textSecondary }}>Tender № {tender.id} • {tender.name}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<FiDownload />} onClick={handleReport} sx={{ textTransform: 'none', borderRadius: 1 }}>Hisobot</Button>
          <Button variant="outlined" startIcon={<FiFlag />} onClick={handleFlag} sx={{ textTransform: 'none', borderRadius: 1, color: colors.red, borderColor: colors.red }}>Bayroq qo'yish</Button>
        </Box>
      </Box>

      {/* First Row: Risk Score + Tender Info */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 1, bgcolor: colors.bgCard, border: `1px solid ${colors.border}`, height: '100%', textAlign: 'center', p: 3 }}>
            <RiskGauge score={tender.riskScore} />
            <Chip label={tender.riskLevelText} sx={{ mt: 2, bgcolor: alpha(tender.riskColor, 0.15), color: tender.riskColor, fontWeight: 600, fontSize: '1rem', py: 2, px: 3, borderRadius: 1 }} />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 1, bgcolor: colors.bgCard, border: `1px solid ${colors.border}`, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FiInfo size={18} /> Tender Ma'lumotlari
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 4 }}><Typography variant="caption" sx={{ color: colors.textSecondary }}>Tender ID</Typography><Typography variant="body2" sx={{ fontWeight: 500, color: colors.textPrimary }}>{tender.id}</Typography></Grid>
                <Grid size={{ xs: 6, sm: 4 }}><Typography variant="caption" sx={{ color: colors.textSecondary }}>Sana</Typography><Typography variant="body2" sx={{ fontWeight: 500, color: colors.textPrimary }}>{formatDate(tender.date)}</Typography></Grid>
                <Grid size={{ xs: 6, sm: 4 }}><Typography variant="caption" sx={{ color: colors.textSecondary }}>Summa</Typography><Typography variant="body2" sx={{ fontWeight: 600, color: colors.red }}>{formatAmount(tender.amount)}</Typography></Grid>
                <Grid size={{ xs: 6, sm: 4 }}><Typography variant="caption" sx={{ color: colors.textSecondary }}>Bozor O'rtachasi</Typography><Typography variant="body2" sx={{ color: colors.textPrimary }}>{formatAmount(tender.marketAvg)}</Typography></Grid>
                <Grid size={{ xs: 6, sm: 4 }}><Typography variant="caption" sx={{ color: colors.textSecondary }}>Viloyat</Typography><Typography variant="body2" sx={{ color: colors.textPrimary }}>{tender.region}</Typography></Grid>
                <Grid size={{ xs: 6, sm: 4 }}><Typography variant="caption" sx={{ color: colors.textSecondary }}>Soha</Typography><Typography variant="body2" sx={{ color: colors.textPrimary }}>{tender.sector}</Typography></Grid>
                <Grid size={{ xs: 6, sm: 4 }}><Typography variant="caption" sx={{ color: colors.textSecondary }}>Kompaniya Yoshi</Typography><Typography variant="body2" sx={{ color: tender.factors.newCompany.triggered ? colors.orange : colors.textPrimary }}>{tender.companyAgeMonths} oy</Typography></Grid>
                <Grid size={{ xs: 6, sm: 4 }}><Typography variant="caption" sx={{ color: colors.textSecondary }}>Risk Bali</Typography><Typography variant="body2" sx={{ fontWeight: 600, color: tender.riskColor }}>{tender.riskScore} / 120</Typography></Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Explanation - Full Width */}
      <Card sx={{ borderRadius: 1, bgcolor: colors.bgCard, border: `1px solid ${colors.border}`, mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: alpha(colors.blue, 0.15), color: colors.blue }}><FaRobot size={20} /></Avatar>
            <Box><Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>AI Izohi</Typography><Typography variant="caption" sx={{ color: colors.textSecondary }}>Nima uchun shubhali deb topildi?</Typography></Box>
          </Box>
          <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
            <strong>{tender.id}</strong> raqamli tender bizning AI monitoring tizimimiz tomonidan <strong style={{ color: tender.riskColor }}>"{tender.riskLevelText}"</strong> sifatida belgilandi. Jami risk bali: <strong style={{ color: tender.riskColor }}>{tender.riskScore}/120</strong>.
          </Typography>
          {(tender.factors.priceAnomaly.triggered || tender.factors.addressMatch.triggered) && (
            <Alert severity="warning" sx={{ mb: 2, bgcolor: alpha(colors.orange, 0.1), '& .MuiAlert-icon': { color: colors.orange }, borderRadius: 1 }}>
              AI tizimi quyidagi anormal naqshlarni aniqladi: {tender.factors.priceAnomaly.triggered && 'narx 2.8x bozor narxidan yuqori; '}{tender.factors.addressMatch.triggered && 'bir necha ishtirokchi bir xil manzilda ro\'yxatdan o\'tgan.'}
            </Alert>
          )}
          <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
            <strong>Narx Tahlili:</strong> Tender summasi ({formatAmount(tender.amount)}) bozor o'rtachasidan ({formatAmount(tender.marketAvg)}) {tender.factors.priceAnomaly.multiplier}x yuqori. Bu holat davlat mablag'larini sarf-xarajat qilishda potensial haddan tashqari to'lov xavfini ko'rsatadi.
          </Typography>
          <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
            <strong>Kompaniya Tahlili:</strong> {!tender.factors.newCompany.triggered && `G'olib kompaniya etarli tajribaga ega (${tender.companyAgeMonths} oy).`}
          </Typography>
          {tender.factors.addressMatch.triggered && (
            <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
              <strong>Manzil Tahlili:</strong> {tender.factors.addressMatch.desc}. Bu potensial "kartochka" kompaniyalari yoki koordinatsiyalangan taklif berish (bid-rigging) naqshiga ishora qilishi mumkin.
            </Typography>
          )}
          <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'block', mt: 2, pt: 2, borderTop: `1px solid ${colors.border}` }}>
            <em>Ushbu tahlil avtomatlashtirilgan risk-baholash tizimi tomonidan yaratilgan. Yakuniy qaror uchun qo'shimcha ekspert tekshiruvi tavsiya etiladi.</em>
          </Typography>
        </CardContent>
      </Card>

      {/* Risk Factors Breakdown */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ borderRadius: 1, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaChartLine size={18} /> Risk Omillari Tahlili
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 2, borderRadius: 1, bgcolor: alpha(colors.red, 0.08), borderLeft: `3px solid ${colors.red}` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><MdAttachMoney size={18} style={{ color: colors.red }} /><Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.red }}>Narx Anomaliyasi</Typography><Chip label="Faol!" size="small" sx={{ bgcolor: colors.red, color: 'white', height: 20, fontSize: '0.65rem', borderRadius: 1 }} /></Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: colors.red }}>+{tender.factors.priceAnomaly.points}/{tender.factors.priceAnomaly.maxPoints}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>{tender.factors.priceAnomaly.desc}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 2, borderRadius: 1, bgcolor: alpha(colors.textSecondary, 0.05) }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><MdBusiness size={18} style={{ color: colors.textSecondary }} /><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Yangi Kompaniya</Typography></Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: colors.textSecondary }}>+{tender.factors.newCompany.points}/{tender.factors.newCompany.maxPoints}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>{tender.factors.newCompany.desc}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 2, borderRadius: 1, bgcolor: alpha(colors.purple, 0.08), borderLeft: `3px solid ${colors.purple}` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><MdLocationOn size={18} style={{ color: colors.purple }} /><Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.purple }}>Manzil Moslik</Typography><Chip label="Faol!" size="small" sx={{ bgcolor: colors.purple, color: 'white', height: 20, fontSize: '0.65rem', borderRadius: 1 }} /></Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: colors.purple }}>+{tender.factors.addressMatch.points}/{tender.factors.addressMatch.maxPoints}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>{tender.factors.addressMatch.desc}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Chart - Vertical Bar Chart */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ borderRadius: 1, bgcolor: colors.bgCard, border: `1px solid ${colors.border}`, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2 }}>Ball Taqsimoti</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={riskChartData} layout="vertical" margin={{ left: 100, right: 20, top: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} horizontal={true} />
                  <XAxis type="number" domain={[0, 55]} stroke={colors.textSecondary} />
                  <YAxis type="category" dataKey="name" stroke={colors.textSecondary} width={100} tick={{ fontSize: 11 }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: colors.bgElevated, borderRadius: 8, border: `1px solid ${colors.border}` }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {riskChartData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <Divider sx={{ my: 2, borderColor: colors.border }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Box><Typography variant="caption" sx={{ color: colors.textSecondary }}>Berilgan ball</Typography><Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>{tender.riskScore} / 120</Typography></Box>
                <Box><Typography variant="caption" sx={{ color: colors.textSecondary }}>Maksimal ball</Typography><Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>120</Typography></Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Network Graph + Timeline */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ borderRadius: 1, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaNetworkWired size={18} /> Ishtirokchilar Aloqalar Xaritasi
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#5c9eff' }} /><Typography variant="caption">Kompaniya</Typography></Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ff7043' }} /><Typography variant="caption">Shaxs</Typography></Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f44336' }} /><Typography variant="caption">Tender</Typography></Box>
                  <Tooltip title="Kattaroq ko'rinishda ochish">
                    <IconButton size="small" onClick={handleZoomGraph} sx={{ color: colors.textSecondary }}>
                      <FiMaximize2 size={14} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <NetworkGraph tender={tender} onZoom={handleZoomGraph} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ borderRadius: 1, bgcolor: colors.bgCard, border: `1px solid ${colors.border}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FiClock size={18} /> Harakat Xronologiyasi
              </Typography>
              <Timeline items={tender.timeline} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modal for Full Screen Network Graph */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: colors.bgCard,
            borderRadius: 2,
            height: '80vh',
            maxHeight: '80vh',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.border}` }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>
            <FaNetworkWired size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Ishtirokchilar Aloqalar Xaritasi
          </Typography>
          <MuiIconButton onClick={() => setModalOpen(false)} sx={{ color: colors.textSecondary }}>
            <FiMinimize2 size={20} />
          </MuiIconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2, overflow: 'hidden' }}>
          <Box sx={{ width: '100%', height: '100%', minHeight: 500 }}>
            <NetworkGraph tender={tender} />
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 1 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default TenderDetail;    
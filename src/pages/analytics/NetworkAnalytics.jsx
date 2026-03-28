import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  FiShare2,
  FiMaximize2,
  FiMinimize2,
  FiZoomIn,
  FiZoomOut,
  FiRefreshCw,
  FiLink,
} from 'react-icons/fi';
import * as d3 from 'd3';

const mockNetworkData = {
  nodes: [
    { id: 'tender1', label: 'TG-2024-0001', type: 'tender', group: 1 },
    { id: 'tender2', label: 'TG-2024-0003', type: 'tender', group: 1 },
    { id: 'tender3', label: 'TG-2024-0007', type: 'tender', group: 1 },
    { id: 'company1', label: 'EnergoGroup', type: 'company', group: 2 },
    { id: 'company2', label: 'TechEnergy', type: 'company', group: 2 },
    { id: 'company3', label: 'PowerBuild', type: 'company', group: 2 },
    { id: 'company4', label: 'YuksakSifat', type: 'company', group: 2 },
    { id: 'person1', label: 'Mirzayev A.', type: 'person', group: 3 },
    { id: 'person2', label: 'Xoliqov M.', type: 'person', group: 3 },
    { id: 'person3', label: 'Hasanov J.', type: 'person', group: 3 },
    { id: 'person4', label: 'Karimov S.', type: 'person', group: 3 },
  ],
  links: [
    { source: 'company1', target: 'tender1', value: 1 },
    { source: 'company2', target: 'tender1', value: 1 },
    { source: 'company3', target: 'tender2', value: 1 },
    { source: 'company1', target: 'tender2', value: 1 },
    { source: 'company4', target: 'tender3', value: 1 },
    { source: 'person1', target: 'company1', value: 1 },
    { source: 'person2', target: 'company2', value: 1 },
    { source: 'person3', target: 'company3', value: 1 },
    { source: 'person4', target: 'company4', value: 1 },
    { source: 'company1', target: 'company2', value: 2, suspicious: true },
  ],
};

function NetworkAnalytics({ darkMode }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const gRef = useRef(null);
  const zoomRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const themeColors = {
    bgCard: darkMode ? '#182040' : '#ffffff',
    textPrimary: darkMode ? '#e8eaf6' : '#0f172a',
    textSecondary: darkMode ? '#8892b0' : '#475569',
    border: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    tender: '#f44336',
    company: '#5c9eff',
    person: '#ff7043',
    red: '#f44336',
  };

  const getColorWithOpacity = (color, opacity) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Initialize graph
  const initGraph = (container, isModal = false) => {
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = 450;

    // Clear previous
    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('background', 'transparent');

    // Create group for zoom
    const g = svg.append('g');

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        if (!isModal) {
          setZoomLevel(event.transform.k);
        }
      });

    svg.call(zoom);
    zoomRef.current = zoom;
    gRef.current = g;

    // Create simulation
    const simulation = d3.forceSimulation(mockNetworkData.nodes)
      .force('link', d3.forceLink(mockNetworkData.links).id(d => d.id).distance(120).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Draw links
    const link = g.append('g')
      .selectAll('line')
      .data(mockNetworkData.links)
      .enter()
      .append('line')
      .attr('stroke', d => d.suspicious ? themeColors.red : 'rgba(136,146,176,0.5)')
      .attr('stroke-width', d => d.suspicious ? 2.5 : 1.5)
      .attr('stroke-dasharray', d => d.suspicious ? '5,5' : 'none');

    // Draw link labels
    const linkLabel = g.append('g')
      .selectAll('text')
      .data(mockNetworkData.links.filter(l => l.suspicious))
      .enter()
      .append('text')
      .attr('font-size', '9px')
      .attr('fill', themeColors.red)
      .attr('text-anchor', 'middle')
      .text(d => d.suspicious ? 'Bir manzil!' : '');

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(mockNetworkData.nodes)
      .enter()
      .append('g')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Node circles
    node.append('circle')
      .attr('r', d => d.type === 'tender' ? 28 : d.type === 'company' ? 24 : 20)
      .attr('fill', d => {
        const color = d.type === 'tender' ? themeColors.tender : d.type === 'company' ? themeColors.company : themeColors.person;
        return getColorWithOpacity(color, 0.15);
      })
      .attr('stroke', d => d.type === 'tender' ? themeColors.tender : d.type === 'company' ? themeColors.company : themeColors.person)
      .attr('stroke-width', 2);

    // Node icons
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', d => d.type === 'tender' ? 20 : d.type === 'company' ? 18 : 14)
      .attr('fill', d => d.type === 'tender' ? themeColors.tender : d.type === 'company' ? themeColors.company : themeColors.person)
      .text(d => d.type === 'tender' ? '⚠' : d.type === 'company' ? '🏢' : '👤');

    // Node labels
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', d => (d.type === 'tender' ? 40 : 32))
      .attr('font-size', '10px')
      .attr('fill', themeColors.textSecondary)
      .text(d => d.label);

    // Tooltip
    const tooltip = d3.select('body').append('div')
      .style('position', 'absolute')
      .style('background', darkMode ? '#141d35' : '#ffffff')
      .style('border', `1px solid ${themeColors.border}`)
      .style('border-radius', '8px')
      .style('padding', '8px 12px')
      .style('font-size', '12px')
      .style('color', themeColors.textPrimary)
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 100)
      .style('box-shadow', '0 2px 8px rgba(0,0,0,0.15)');

    node.on('mouseover', function(event, d) {
      let html = `<strong>${d.label}</strong><br>`;
      html += `Turi: ${d.type === 'tender' ? 'Tender' : d.type === 'company' ? 'Kompaniya' : 'Shaxs'}`;
      if (d.type === 'company') {
        html += `<br>Direktor: ${d.id === 'company1' ? 'Mirzayev A.' : d.id === 'company2' ? 'Xoliqov M.' : d.id === 'company3' ? 'Hasanov J.' : 'Karimov S.'}`;
      }
      tooltip.html(html)
        .style('opacity', 1)
        .style('left', (event.pageX + 12) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    }).on('mouseout', () => tooltip.style('opacity', 0));

    // Update positions
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      linkLabel
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2 - 4);

      node.attr('transform', d => `translate(${d.x}, ${d.y})`);
    });

    return () => {
      simulation.stop();
      tooltip.remove();
    };
  };

  // Handle zoom in
  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      const svg = d3.select(svgRef.current);
      const currentTransform = d3.zoomTransform(svgRef.current);
      const newScale = currentTransform.k * 1.3;
      svg.transition().duration(300).call(zoomRef.current.scaleTo, newScale);
    }
  };

  // Handle zoom out
  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      const svg = d3.select(svgRef.current);
      const currentTransform = d3.zoomTransform(svgRef.current);
      const newScale = currentTransform.k / 1.3;
      svg.transition().duration(300).call(zoomRef.current.scaleTo, newScale);
    }
  };

  // Handle reset zoom
  const handleResetZoom = () => {
    if (svgRef.current && zoomRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  // Initialize graph on mount and when modal opens
  useEffect(() => {
    if (containerRef.current) {
      const cleanup = initGraph(containerRef.current, false);
      return cleanup;
    }
  }, [darkMode]);

  useEffect(() => {
    if (modalOpen && svgRef.current) {
      const modalContainer = svgRef.current.parentElement;
      if (modalContainer) {
        const cleanup = initGraph(modalContainer, true);
        return cleanup;
      }
    }
  }, [modalOpen, darkMode]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh', width: '100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: themeColors.textPrimary, mb: 1 }}>Tarmoq Aloqalari</Typography>
      <Typography variant="body2" sx={{ color: themeColors.textSecondary, mb: 4 }}>Ishtirokchilar o'rtasidagi aloqalar xaritasi</Typography>

      <Card sx={{ borderRadius: 2, bgcolor: themeColors.bgCard, border: `1px solid ${themeColors.border}` }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: themeColors.textPrimary, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FiShare2 size={18} /> Aloqalar grafi
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: themeColors.tender }} />
                  <Typography variant="caption" sx={{ color: themeColors.textSecondary }}>Tender</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: themeColors.company }} />
                  <Typography variant="caption" sx={{ color: themeColors.textSecondary }}>Kompaniya</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: themeColors.person }} />
                  <Typography variant="caption" sx={{ color: themeColors.textSecondary }}>Shaxs</Typography>
                </Box>
              </Box>
              <Tooltip title="Kichraytirish">
                <IconButton size="small" onClick={handleZoomOut} sx={{ color: themeColors.textSecondary }}>
                  <FiZoomOut size={16} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Kattalashtirish">
                <IconButton size="small" onClick={handleZoomIn} sx={{ color: themeColors.textSecondary }}>
                  <FiZoomIn size={16} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Asl holat">
                <IconButton size="small" onClick={handleResetZoom} sx={{ color: themeColors.textSecondary }}>
                  <FiRefreshCw size={14} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Kattaroq ko'rinish">
                <IconButton size="small" onClick={() => setModalOpen(true)} sx={{ color: themeColors.textSecondary }}>
                  <FiMaximize2 size={14} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box 
            ref={containerRef} 
            sx={{ 
              width: '100%', 
              height: 450, 
              position: 'relative',
              bgcolor: 'transparent',
              borderRadius: 1,
              overflow: 'hidden',
              border: `1px solid ${themeColors.border}`,
            }} 
          />
          <Box sx={{ mt: 2, p: 2, bgcolor: `rgba(244, 67, 54, 0.05)`, borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: themeColors.textSecondary, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FiLink size={14} /> <strong>Shubhali aloqalar:</strong> EnergoGroup va TechEnergy kompaniyalari o'rtasida bir xil manzil aloqasi aniqlangan.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Modal for full screen */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        maxWidth="xl" 
        fullWidth
        PaperProps={{ 
          sx: { 
            bgcolor: themeColors.bgCard, 
            height: '85vh',
            maxHeight: '85vh',
            borderRadius: 2,
          } 
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: `1px solid ${themeColors.border}`,
          py: 1.5,
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: themeColors.textPrimary, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FiShare2 size={20} /> Tarmoq Aloqalari - Kengaytirilgan ko'rinish
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Kichraytirish">
              <IconButton onClick={() => {
                if (zoomRef.current && svgRef.current) {
                  const svg = d3.select(svgRef.current.parentElement?.querySelector('svg'));
                  const currentTransform = d3.zoomTransform(svgRef.current.parentElement?.querySelector('svg'));
                  const newScale = currentTransform.k / 1.3;
                  svg.transition().duration(300).call(zoomRef.current.scaleTo, newScale);
                }
              }} sx={{ color: themeColors.textSecondary }}>
                <FiZoomOut size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Kattalashtirish">
              <IconButton onClick={() => {
                if (zoomRef.current && svgRef.current) {
                  const svg = d3.select(svgRef.current.parentElement?.querySelector('svg'));
                  const currentTransform = d3.zoomTransform(svgRef.current.parentElement?.querySelector('svg'));
                  const newScale = currentTransform.k * 1.3;
                  svg.transition().duration(300).call(zoomRef.current.scaleTo, newScale);
                }
              }} sx={{ color: themeColors.textSecondary }}>
                <FiZoomIn size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Asl holat">
              <IconButton onClick={() => {
                if (zoomRef.current && svgRef.current) {
                  const svg = d3.select(svgRef.current.parentElement?.querySelector('svg'));
                  svg.transition().duration(300).call(zoomRef.current.transform, d3.zoomIdentity);
                }
              }} sx={{ color: themeColors.textSecondary }}>
                <FiRefreshCw size={16} />
              </IconButton>
            </Tooltip>
            <IconButton onClick={() => setModalOpen(false)} sx={{ color: themeColors.textSecondary }}>
              <FiMinimize2 size={20} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 2, overflow: 'hidden' }}>
          <Box 
            ref={svgRef} 
            sx={{ 
              width: '100%', 
              height: '100%', 
              minHeight: 500,
              bgcolor: 'transparent',
              borderRadius: 1,
              overflow: 'hidden',
            }} 
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default NetworkAnalytics;
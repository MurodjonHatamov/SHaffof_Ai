import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Tenders from './pages/Tenders';
import Notifications from './pages/Notifications';
import TenderDetail from './pages/TenderDetail';
import Settings from './pages/Settings';
import Help from './pages/Help';

// Light mode theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#168aad' },
    secondary: { main: '#ff7043' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#475569' },
  },
  typography: { fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif' },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600, borderRadius: 12 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 20 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiAppBar: { styleOverrides: { root: { boxShadow: 'none' } } },
  },
});

// Dark mode theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#5c9eff' },
    secondary: { main: '#ff7043' },
    background: { default: '#0a0e1a', paper: '#182040' },
    text: { primary: '#e8eaf6', secondary: '#8892b0' },
  },
  typography: { fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif' },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600, borderRadius: 12 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 20 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiAppBar: { styleOverrides: { root: { boxShadow: 'none' } } },
  },
});

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const theme = darkMode ? darkTheme : lightTheme;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
          />
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Navbar 
              darkMode={darkMode} 
              setDarkMode={setDarkMode} 
              toggleSidebar={toggleSidebar} 
              isSidebarOpen={sidebarOpen}
            />
            <Box sx={{ height: 64 }} />
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, overflowX: 'auto' }}>
              <Routes>
                <Route path="/" element={<Dashboard darkMode={darkMode} />} />
                <Route path="/tenders" element={<Tenders darkMode={darkMode} />} />
                <Route path="/notifications" element={<Notifications darkMode={darkMode} />} />
                <Route path="/tender/:id" element={<TenderDetail darkMode={darkMode} />} />
                <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
                <Route path="/help" element={<Help darkMode={darkMode} />} />

                {/* ... other routes ... */}
              </Routes>
            </Box>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
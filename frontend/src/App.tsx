import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import PredefinedProtocols from './pages/PredefinedProtocols';
import { StudyList, CreateStudy, EditStudy, ExecuteStudy } from './pages/Studies';
import StudyStatistics from './pages/StudyStatistics';
import ProtocolCreator from './pages/ProtocolCreator';
import NotFound from './pages/NotFound';

// Tema Material-UI
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />
            

            
            {/* Predefined Protocols */}
            <Route path="/protocols/predefined" element={<PredefinedProtocols />} />
            
            {/* Protocol Creator */}
            <Route path="/protocol-creator" element={<ProtocolCreator />} />
            <Route path="/create-protocol" element={<ProtocolCreator />} />
            
            {/* Studies */}
            <Route path="/studies" element={<StudyList />} />
            <Route path="/studies/create" element={<CreateStudy />} />
            <Route path="/studies/:id/execute" element={<ExecuteStudy />} />
            <Route path="/studies/:id/edit" element={<EditStudy />} />
            <Route path="/studies/:id/statistics" element={<StudyStatistics />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
    </ThemeProvider>
  );
};

export default App;

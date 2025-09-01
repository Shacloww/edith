import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab,
  Paper,
  Typography
} from '@mui/material';
import {
  Analytics,
  Assessment,
  Timeline,
  TableChart,
  Refresh
} from '@mui/icons-material';
import { useStudyStatistics } from './hooks/useStudyStatistics';
import { StatisticsHeader } from './components/StatisticsHeader';
import { OverviewCards } from './components/OverviewCards';
import { QuestionAnalysisComponent } from './components/QuestionAnalysisComponent';

// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`statistics-tabpanel-${index}`}
      aria-labelledby={`statistics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const StudyStatistics: React.FC = () => {
  const { id: studyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const {
    study,
    responses,
    statisticsData,
    questionAnalyses,
    correlations,
    loading,
    error,
    refreshData,
    exportData
  } = useStudyStatistics(studyId || '');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBack = () => {
    navigate(`/studies/${studyId}`);
  };

  const handleExport = (format: 'csv' | 'xlsx' | 'pdf') => {
    exportData(format);
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={60} color="primary" />
        <Typography variant="h6" color="text.secondary">
          Analizowanie danych statystycznych...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          To może potrwać kilka sekund
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          onClick={refreshData} 
          variant="contained" 
          startIcon={<Refresh />}
        >
          Spróbuj ponownie
        </Button>
      </Box>
    );
  }

  // No study found
  if (!study) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Alert severity="warning">
          Nie znaleziono badania o podanym identyfikatorze.
        </Alert>
      </Box>
    );
  }

  const questionsCount = study.researchSchema?.questions?.length || 0;
  const hasResponses = responses.length > 0;

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header */}
      <StatisticsHeader
        study={study}
        onBack={handleBack}
        onRefresh={refreshData}
        onExport={handleExport}
        loading={loading}
      />

      {/* Overview Cards */}
      {statisticsData && (
        <OverviewCards
          data={statisticsData}
          questionsCount={questionsCount}
        />
      )}

      {/* Main Content */}
      {hasResponses ? (
        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              icon={<Analytics />} 
              label="Analiza pytań" 
              iconPosition="start"
            />
            <Tab 
              icon={<Assessment />} 
              label="Korelacje" 
              iconPosition="start"
            />
            <Tab 
              icon={<Timeline />} 
              label="Trendy czasowe" 
              iconPosition="start"
            />
            <Tab 
              icon={<TableChart />} 
              label="Raport szczegółowy" 
              iconPosition="start"
            />
          </Tabs>

          {/* Panel 1: Analiza pytań */}
          <TabPanel value={activeTab} index={0}>
            <QuestionAnalysisComponent analyses={questionAnalyses} />
          </TabPanel>

          {/* Panel 2: Korelacje */}
          <TabPanel value={activeTab} index={1}>
            <Typography variant="h6" gutterBottom>
              Analiza korelacji między pytaniami
            </Typography>
            {correlations.length > 0 ? (
              <Alert severity="info">
                Znaleziono {correlations.length} korelacji. 
                Szczegółowa analiza korelacji będzie dostępna wkrótce.
              </Alert>
            ) : (
              <Alert severity="info">
                Brak wystarczających danych numerycznych do analizy korelacji.
              </Alert>
            )}
          </TabPanel>

          {/* Panel 3: Trendy czasowe */}
          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" gutterBottom>
              Analiza trendów czasowych
            </Typography>
            <Alert severity="info">
              Wykresy trendów czasowych będą dostępne wkrótce.
            </Alert>
          </TabPanel>

          {/* Panel 4: Raport szczegółowy */}
          <TabPanel value={activeTab} index={3}>
            <Typography variant="h6" gutterBottom>
              Raport szczegółowy
            </Typography>
            <Alert severity="info">
              Szczegółowy raport statystyczny będzie dostępny wkrótce.
            </Alert>
          </TabPanel>
        </Paper>
      ) : (
        // No responses message
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Brak odpowiedzi w badaniu
          </Typography>
          <Typography>
            To badanie nie otrzymało jeszcze żadnych odpowiedzi. 
            Statystyki będą dostępne po otrzymaniu pierwszych odpowiedzi od uczestników.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button 
              onClick={refreshData}
              variant="outlined"
              startIcon={<Refresh />}
            >
              Sprawdź ponownie
            </Button>
          </Box>
        </Alert>
      )}
    </Box>
  );
};

export default StudyStatistics;

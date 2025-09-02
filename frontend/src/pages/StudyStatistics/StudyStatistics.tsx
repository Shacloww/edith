import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Chip,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Print,
  Share,
  Refresh,
  Assessment,
  Timeline,
  BarChart,
  ShowChart
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { StatisticsOverview } from './components';
import { Study, StudySession, StudyResult, StudyStatus } from '../../types';

interface StudyStatisticsProps {
  studyId?: string;
}

interface StudyData {
  study: Study;
  sessions: StudySession[];
  results: StudyResult[];
  status: StudyStatus;
}

const StudyStatistics: React.FC<StudyStatisticsProps> = ({ studyId: propStudyId }) => {
  console.log('StudyStatistics component rendered');
  const { id: paramStudyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const studyId = propStudyId || paramStudyId;

  const [studyData, setStudyData] = useState<StudyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (studyId) {
      loadStudyData();
    }
  }, [studyId]);

  const loadStudyData = async () => {
    try {
      setLoading(true);
      setError(null);

      // W rzeczywistej aplikacji tutaj byłoby API call
      // const response = await api.get(`/studies/${studyId}/statistics`);
      // setStudyData(response.data);

      // Tymczasowe dane demonstracyjne
      const mockStudyData: StudyData = {
        study: {
          id: studyId!,
          title: 'Badanie Wytrzymałości Materiału XYZ',
          name: 'Badanie Wytrzymałości Materiału XYZ',
          description: 'Kompleksowe badanie właściwości mechanicznych nowego materiału kompozytowego',
          protocolId: 'protocol-123',
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z',
          createdBy: 'Jan Kowalski',
          status: StudyStatus.COMPLETED
        },
        sessions: [
          {
            id: 'session-1',
            studyId: studyId!,
            sampleId: 'Próbka A1',
            operator: 'Maria Nowak',
            equipment: 'Maszyna Wytrzymałościowa MTS-100',
            startTime: new Date('2024-01-15T09:00:00'),
            endTime: new Date('2024-01-15T09:30:00'),
            data: {
              maxForce: 15420,
              tensileStrength: 245.8,
              yieldStrength: 198.2,
              elongation: 12.5,
              modulusOfElasticity: 68500
            },
            conditions: {
              temperature: 23.2,
              humidity: 45.8,
              pressure: 1013.25
            }
          },
          {
            id: 'session-2',
            studyId: studyId!,
            sampleId: 'Próbka A2',
            operator: 'Maria Nowak',
            equipment: 'Maszyna Wytrzymałościowa MTS-100',
            startTime: new Date('2024-01-15T10:00:00'),
            endTime: new Date('2024-01-15T10:30:00'),
            data: {
              maxForce: 15890,
              tensileStrength: 251.2,
              yieldStrength: 201.5,
              elongation: 13.1,
              modulusOfElasticity: 69200
            },
            conditions: {
              temperature: 23.5,
              humidity: 46.2,
              pressure: 1013.18
            }
          },
          {
            id: 'session-3',
            studyId: studyId!,
            sampleId: 'Próbka A3',
            operator: 'Piotr Wiśniewski',
            equipment: 'Maszyna Wytrzymałościowa MTS-100',
            startTime: new Date('2024-01-16T09:00:00'),
            endTime: new Date('2024-01-16T09:30:00'),
            data: {
              maxForce: 15210,
              tensileStrength: 240.5,
              yieldStrength: 195.8,
              elongation: 12.2,
              modulusOfElasticity: 67800
            },
            conditions: {
              temperature: 22.8,
              humidity: 44.5,
              pressure: 1013.42
            }
          }
        ],
        results: [],
        status: StudyStatus.COMPLETED
      };

      setStudyData(mockStudyData);
    } catch (err) {
      setError('Błąd podczas ładowania danych badania');
      console.error('Error loading study data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Implementacja eksportu danych
    console.log('Eksport danych...');
  };

  const handlePrint = () => {
    // Implementacja drukowania
    window.print();
  };

  const handleShare = () => {
    // Implementacja udostępniania
    console.log('Udostępnianie raportu...');
  };

  const getStatusColor = (status: StudyStatus) => {
    switch (status) {
      case StudyStatus.COMPLETED:
        return 'success';
      case StudyStatus.ACTIVE:
        return 'primary';
      case StudyStatus.DRAFT:
        return 'default';
      case StudyStatus.PAUSED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: StudyStatus) => {
    switch (status) {
      case StudyStatus.COMPLETED:
        return 'Zakończone';
      case StudyStatus.ACTIVE:
        return 'W trakcie';
      case StudyStatus.DRAFT:
        return 'Projekt';
      case StudyStatus.PAUSED:
        return 'Wstrzymane';
      default:
        return 'Nieznany';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={loadStudyData} startIcon={<Refresh />}>
          Spróbuj ponownie
        </Button>
      </Container>
    );
  }

  if (!studyData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          Nie znaleziono danych badania
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/studies')}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          Badania
        </Link>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate(`/studies/${studyId}`)}
        >
          {studyData.study.name}
        </Link>
        <Typography color="text.primary">Statystyki</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <IconButton
                onClick={() => navigate(`/studies/${studyId}`)}
                sx={{ mr: 1 }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" component="h1">
                Analiza Statystyczna
              </Typography>
              <Chip
                label={getStatusLabel(studyData.status)}
                color={getStatusColor(studyData.status)}
                size="small"
              />
            </Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {studyData.study.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {studyData.study.description}
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Odśwież dane">
              <IconButton onClick={loadStudyData}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eksportuj raport">
              <IconButton onClick={handleExport}>
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Drukuj">
              <IconButton onClick={handlePrint}>
                <Print />
              </IconButton>
            </Tooltip>
            <Tooltip title="Udostępnij">
              <IconButton onClick={handleShare}>
                <Share />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Assessment color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">{studyData.sessions.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Liczba sesji
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Timeline color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">
                  {Math.round((new Date(studyData.study.updatedAt).getTime() - 
                    new Date(studyData.study.createdAt).getTime()) / (1000 * 60 * 60 * 24))} dni
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Czas trwania
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <BarChart color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">
                  {Object.keys(studyData.sessions[0]?.data || {}).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Parametry
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <ShowChart color="info" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">100%</Typography>
                <Typography variant="body2" color="text.secondary">
                  Kompletność danych
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Overview */}
      <StatisticsOverview 
        studyId={studyData.study.id}
        studyName={studyData.study.name || (studyData.study as any).title || 'Badanie'}
        data={studyData.sessions}
      />
    </Container>
  );
};

export default StudyStatistics;

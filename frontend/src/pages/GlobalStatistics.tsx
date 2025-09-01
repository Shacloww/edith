import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  Refresh,
  TrendingUp,
  Assessment,
  People,
  QuestionAnswer,
  Visibility,
  Download
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { studiesApi, responsesApi } from '../services/api';
import { Study, StudyStatus, StudyStatistics } from '../types';

interface StudyWithStats extends Study {
  statistics?: StudyStatistics;
}

interface ComparisonData {
  name: string;
  responses: number;
  responseRate: number;
  questionsCount: number;
  status: StudyStatus;
}

const GlobalStatistics: React.FC = () => {
  const navigate = useNavigate();
  
  const [studies, setStudies] = useState<StudyWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Pobierz wszystkie badania
      const studiesResponse = await studiesApi.getAll();
      
      if (studiesResponse.success && studiesResponse.data) {
        const studiesWithStats: StudyWithStats[] = [];
        
        // Dla każdego badania pobierz statystyki
        for (const study of studiesResponse.data) {
          try {
            const statsResponse = await responsesApi.getStatistics(study.id);
            studiesWithStats.push({
              ...study,
              statistics: statsResponse.success ? statsResponse.data : undefined
            });
          } catch (error) {
            console.warn(`Nie udało się pobrać statystyk dla badania ${study.id}:`, error);
            studiesWithStats.push(study);
          }
        }
        
        setStudies(studiesWithStats);
      }
    } catch (error) {
      console.error('Error fetching studies and statistics:', error);
      setError('Nie udało się załadować danych');
      toast.error('Błąd podczas ładowania danych');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredStudies = () => {
    let filtered = studies;

    // Filtruj według statusu
    if (statusFilter !== 'all') {
      filtered = filtered.filter(study => study.status === statusFilter);
    }

    // Filtruj według czasu (opcjonalnie można dodać logikę dat)
    if (timeRange !== 'all') {
      const now = new Date();
      const daysAgo = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : timeRange === '90days' ? 90 : 0;
      
      if (daysAgo > 0) {
        const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(study => new Date(study.createdAt) >= cutoffDate);
      }
    }

    return filtered;
  };

  const getComparisonData = (): ComparisonData[] => {
    return getFilteredStudies().map(study => ({
      name: study.title.length > 20 ? study.title.substring(0, 20) + '...' : study.title,
      responses: study.statistics?.totalResponses || 0,
      responseRate: study.statistics ? 
        (Object.values(study.statistics.questionStats).reduce((sum, stat) => 
          sum + parseFloat(stat.responseRate), 0) / Math.max(Object.values(study.statistics.questionStats).length, 1)) : 0,
      questionsCount: study.statistics ? Object.keys(study.statistics.questionStats).length : 
        (study.researchSchema?.questions?.length || 0),
      status: study.status
    }));
  };

  const getTotalStats = () => {
    const filtered = getFilteredStudies();
    const totalResponses = filtered.reduce((sum, study) => sum + (study.statistics?.totalResponses || 0), 0);
    const totalStudies = filtered.length;
    const activeStudies = filtered.filter(study => study.status === 'ACTIVE').length;
    const avgResponsesPerStudy = totalStudies > 0 ? totalResponses / totalStudies : 0;

    return {
      totalResponses,
      totalStudies,
      activeStudies,
      avgResponsesPerStudy: Math.round(avgResponsesPerStudy * 10) / 10
    };
  };

  const getStatusDistribution = () => {
    const filtered = getFilteredStudies();
    const distribution: Record<string, number> = {};
    
    filtered.forEach(study => {
      distribution[study.status] = (distribution[study.status] || 0) + 1;
    });

    return Object.entries(distribution).map(([status, count]) => ({
      name: status === 'ACTIVE' ? 'Aktywne' : 
            status === 'COMPLETED' ? 'Zakończone' : 
            status === 'DRAFT' ? 'Szkice' : 
            status === 'PAUSED' ? 'Wstrzymane' : status,
      value: count,
      color: status === 'ACTIVE' ? '#4caf50' : 
             status === 'COMPLETED' ? '#2196f3' : 
             status === 'DRAFT' ? '#ff9800' : 
             status === 'PAUSED' ? '#f44336' : '#757575'
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchData}>
          Spróbuj ponownie
        </Button>
      </Box>
    );
  }

  const totalStats = getTotalStats();
  const comparisonData = getComparisonData();
  const statusDistribution = getStatusDistribution();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Statystyki porównawcze badań
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Analiza i porównanie wszystkich badań w systemie
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Odśwież dane">
            <IconButton onClick={fetchData}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eksportuj raport">
            <IconButton>
              <Download />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Filtry */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Okres czasu</InputLabel>
            <Select
              value={timeRange}
              label="Okres czasu"
              onChange={(e: SelectChangeEvent) => setTimeRange(e.target.value)}
            >
              <MenuItem value="all">Wszystkie</MenuItem>
              <MenuItem value="7days">Ostatnie 7 dni</MenuItem>
              <MenuItem value="30days">Ostatnie 30 dni</MenuItem>
              <MenuItem value="90days">Ostatnie 90 dni</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Status badania</InputLabel>
            <Select
              value={statusFilter}
              label="Status badania"
              onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Wszystkie</MenuItem>
              <MenuItem value="ACTIVE">Aktywne</MenuItem>
              <MenuItem value="COMPLETED">Zakończone</MenuItem>
              <MenuItem value="DRAFT">Szkice</MenuItem>
              <MenuItem value="PAUSED">Wstrzymane</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Podsumowanie ogólne */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assessment sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Liczba badań
                  </Typography>
                  <Typography variant="h4">
                    {totalStats.totalStudies}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Łączne odpowiedzi
                  </Typography>
                  <Typography variant="h4">
                    {totalStats.totalResponses}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Aktywne badania
                  </Typography>
                  <Typography variant="h4">
                    {totalStats.activeStudies}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <QuestionAnswer sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Średnio odpowiedzi/badanie
                  </Typography>
                  <Typography variant="h4">
                    {totalStats.avgResponsesPerStudy}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Wykresy porównawcze */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Wykres porównania odpowiedzi */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Porównanie liczby odpowiedzi
              </Typography>
              <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Porównanie badań (liczba odpowiedzi)
                </Typography>
                {comparisonData.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ minWidth: 200 }}>
                      <Typography variant="body2" noWrap>
                        {item.name}
                      </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, height: 20, bgcolor: 'grey.100', borderRadius: 1, position: 'relative' }}>
                      <Box
                        sx={{
                          width: `${(item.responses / Math.max(...comparisonData.map(d => d.responses))) * 100}%`,
                          height: '100%',
                          bgcolor: '#8884d8',
                          borderRadius: 1
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ minWidth: 50 }}>
                      {item.responses}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Rozkład statusów badań */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rozkład statusów badań
              </Typography>
              <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Rozkład statusów badań
                </Typography>
                {statusDistribution.map((entry, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ minWidth: 120 }}>
                      <Typography variant="body2">
                        {entry.name}
                      </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, height: 20, bgcolor: 'grey.100', borderRadius: 1, position: 'relative' }}>
                      <Box
                        sx={{
                          width: `${(entry.value / statusDistribution.reduce((sum, item) => sum + item.value, 0)) * 100}%`,
                          height: '100%',
                          bgcolor: entry.color,
                          borderRadius: 1
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ minWidth: 40 }}>
                      {entry.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 50 }}>
                      {((entry.value / statusDistribution.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabela szczegółowa */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Szczegółowe porównanie badań
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nazwa badania</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Liczba pytań</TableCell>
                  <TableCell align="center">Odpowiedzi</TableCell>
                  <TableCell align="center">Średni wskaźnik odpowiedzi</TableCell>
                  <TableCell align="center">Data utworzenia</TableCell>
                  <TableCell align="center">Akcje</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredStudies().map((study) => (
                  <TableRow key={study.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {study.title}
                      </Typography>
                      {study.description && (
                        <Typography variant="caption" color="text.secondary">
                          {study.description.substring(0, 100)}...
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={study.status}
                        color={
                          study.status === 'ACTIVE' ? 'success' :
                          study.status === 'COMPLETED' ? 'primary' :
                          study.status === 'DRAFT' ? 'warning' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {study.statistics ? 
                        Object.keys(study.statistics.questionStats).length : 
                        (study.researchSchema?.questions?.length || 0)}
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="medium">
                        {study.statistics?.totalResponses || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {study.statistics ? (
                        <Typography variant="body2">
                          {Object.values(study.statistics.questionStats).length > 0 ?
                            (Object.values(study.statistics.questionStats)
                              .reduce((sum, stat) => sum + parseFloat(stat.responseRate), 0) / 
                              Object.values(study.statistics.questionStats).length).toFixed(1) : '0'}%
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {new Date(study.createdAt).toLocaleDateString('pl-PL')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Zobacz szczegóły">
                        <IconButton 
                          size="small"
                          onClick={() => navigate(`/studies/${study.id}`)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Zobacz statystyki">
                        <IconButton 
                          size="small"
                          onClick={() => navigate(`/studies/${study.id}/statistics`)}
                        >
                          <Assessment />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {studies.length === 0 && (
        <Box sx={{ mt: 4 }}>
          <Alert severity="info">
            Nie ma jeszcze żadnych badań w systemie. Utwórz pierwsze badanie, aby zobaczyć statystyki.
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default GlobalStatistics;

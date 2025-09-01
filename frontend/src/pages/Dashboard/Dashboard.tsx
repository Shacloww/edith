import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Science as ScienceIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { researchSchemasApi, studiesApi } from '../../services/api';
import { ResearchSchema, Study } from '../../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    schemasCount: 0,
    studiesCount: 0,
    activeStudiesCount: 0,
    totalResponses: 0,
  });
  const [recentSchemas, setRecentSchemas] = useState<ResearchSchema[]>([]);
  const [recentStudies, setRecentStudies] = useState<Study[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Pobierz schematy i badania
      const [schemasResponse, studiesResponse] = await Promise.all([
        researchSchemasApi.getAll(),
        studiesApi.getAll(),
      ]);

      if (schemasResponse.success && studiesResponse.success) {
        const schemas = schemasResponse.data || [];
        const studies = studiesResponse.data || [];

        // Oblicz statystyki
        const activeStudies = studies.filter(study => study.status === 'ACTIVE');
        const totalResponses = studies.reduce((sum, study) => sum + (study._count?.responses || 0), 0);

        setStats({
          schemasCount: schemas.length,
          studiesCount: studies.length,
          activeStudiesCount: activeStudies.length,
          totalResponses,
        });

        // Ustaw ostatnie schematy i badania
        setRecentSchemas(schemas.slice(0, 3));
        setRecentStudies(studies.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'COMPLETED':
        return 'info';
      case 'PAUSED':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Aktywne';
      case 'COMPLETED':
        return 'Zakończone';
      case 'PAUSED':
        return 'Wstrzymane';
      case 'DRAFT':
        return 'Projekt';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ScienceIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.schemasCount}
                  </Typography>
                  <Typography color="text.secondary">
                    Schematy badawcze
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AssignmentIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.studiesCount}
                  </Typography>
                  <Typography color="text.secondary">
                    Wszystkie badania
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.activeStudiesCount}
                  </Typography>
                  <Typography color="text.secondary">
                    Aktywne badania
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.totalResponses}
                  </Typography>
                  <Typography color="text.secondary">
                    Odpowiedzi
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Szybkie akcje
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/schemas/create')}
                >
                  Nowy schemat badawczy
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/studies/create')}
                >
                  Nowe badanie
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Najnowsze schematy badawcze
              </Typography>
              {recentSchemas.length === 0 ? (
                <Typography color="text.secondary">
                  Brak schematów badawczych
                </Typography>
              ) : (
                recentSchemas.map((schema) => (
                  <Box
                    key={schema.id}
                    sx={{
                      p: 2,
                      mb: 1,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                    onClick={() => navigate(`/schemas/${schema.id}/edit`)}
                  >
                    <Typography variant="subtitle1" fontWeight="medium">
                      {schema.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {schema.questions.length} pytań
                    </Typography>
                  </Box>
                ))
              )}
              <Button
                size="small"
                onClick={() => navigate('/schemas')}
                sx={{ mt: 1 }}
              >
                Zobacz wszystkie
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Najnowsze badania
              </Typography>
              {recentStudies.length === 0 ? (
                <Typography color="text.secondary">
                  Brak badań
                </Typography>
              ) : (
                recentStudies.map((study) => (
                  <Box
                    key={study.id}
                    sx={{
                      p: 2,
                      mb: 1,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                    onClick={() => navigate(`/studies/${study.id}`)}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="start">
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {study.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {study._count?.responses || 0} odpowiedzi
                        </Typography>
                      </Box>
                      <Chip
                        label={getStatusLabel(study.status)}
                        color={getStatusColor(study.status) as any}
                        size="small"
                      />
                    </Box>
                  </Box>
                ))
              )}
              <Button
                size="small"
                onClick={() => navigate('/studies')}
                sx={{ mt: 1 }}
              >
                Zobacz wszystkie
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

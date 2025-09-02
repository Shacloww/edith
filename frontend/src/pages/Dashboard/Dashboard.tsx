import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Science as ScienceIcon, Assignment as AssignmentIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useStudies } from '../../hooks';
import { Study, StudyStatus } from '../../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const {
    studies,
    isLoading: studiesLoading,
    error: studiesError,
    fetchStudies,
    updateStudyStatus,
    deleteStudy
  } = useStudies();

  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);

  const handleStatusChange = async (studyId: string, status: StudyStatus) => {
    await updateStudyStatus(studyId, status);
  };

  const handleDeleteStudy = async (studyId: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć to badanie?')) {
      await deleteStudy(studyId);
    }
  };

  const getStatusColor = (status: StudyStatus) => {
    switch (status) {
      case StudyStatus.ACTIVE: return 'success';
      case StudyStatus.COMPLETED: return 'info';
      case StudyStatus.PAUSED: return 'warning';
      default: return 'default';
    }
  };

  if (studiesLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Panel Kontrolny
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ScienceIcon />}
            onClick={() => navigate('/protocols/predefined')}
            sx={{ mr: 2 }}
          >
            Protokoły
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/studies/create')}
          >
            Nowe Badanie
          </Button>
        </Box>
      </Box>

      {studiesError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {studiesError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {studies.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <AssignmentIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  Brak badań
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  Utwórz swoje pierwsze badanie, aby rozpocząć pracę z protokołami
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/studies/create')}
                >
                  Utwórz Badanie
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          studies.map((study: Study) => (
            <Grid item xs={12} md={6} lg={4} key={study.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" noWrap title={study.name}>
                    {study.name}
                  </Typography>
                  {study.description && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {study.description}
                    </Typography>
                  )}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Chip
                      label={study.status}
                      color={getStatusColor(study.status)}
                      size="small"
                    />
                    {study.category && (
                      <Chip label={study.category} variant="outlined" size="small" />
                    )}
                  </Box>
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    Utworzono: {new Date(study.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate(`/studies/${study.id}`)}
                  >
                    Szczegóły
                  </Button>
                  <Button
                    size="small"
                    onClick={() => navigate(`/studies/${study.id}/edit`)}
                  >
                    Edytuj
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteStudy(study.id)}
                  >
                    Usuń
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
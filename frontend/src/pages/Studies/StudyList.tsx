import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Fab,
  Tooltip,
  Stack,
  Divider,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as PlayIcon,
  MoreVert as MoreVertIcon,
  Science as ScienceIcon,
  Assessment as StatsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { Study, StudyStatus } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useStudies } from '../../hooks';

const StudyList: React.FC = () => {
  const navigate = useNavigate();
  const { 
    studies, 
    isLoading, 
    error, 
    fetchStudies 
  } = useStudies();

  console.log('StudyList - Debug info:', { studies, isLoading, error });

  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);

  const getStatusColor = (status: StudyStatus) => {
    switch (status) {
      case StudyStatus.DRAFT: return 'default';
      case StudyStatus.ACTIVE: return 'success';
      case StudyStatus.COMPLETED: return 'info';
      case StudyStatus.PAUSED: return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: StudyStatus) => {
    switch (status) {
      case StudyStatus.DRAFT: return 'Szkic';
      case StudyStatus.ACTIVE: return 'Aktywne';
      case StudyStatus.COMPLETED: return 'Zakończone';
      case StudyStatus.PAUSED: return 'Wstrzymane';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Błąd podczas ładowania badań: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Badania
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/studies/create')}
        >
          Nowe badanie
        </Button>
      </Box>

      {studies.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Brak badań
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Rozpocznij swoje pierwsze badanie
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/studies/create')}
            >
              Utwórz badanie
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {studies.map((study) => (
            <Grid item xs={12} md={6} lg={4} key={study.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      {study.name}
                    </Typography>
                    <Chip
                      label={getStatusLabel(study.status)}
                      color={getStatusColor(study.status)}
                      size="small"
                    />
                  </Box>
                  
                  {study.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {study.description}
                    </Typography>
                  )}
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Protokół:</strong> {study.protocolName || study.protocolId}
                  </Typography>
                  
                  {study.category && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Kategoria:</strong> {study.category}
                    </Typography>
                  )}
                  
                  <Typography variant="caption" color="text.secondary">
                    Utworzono: {new Date(study.createdAt).toLocaleDateString('pl-PL')}
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<PlayIcon />}
                    onClick={() => {
                      console.log('Navigate to execute:', `/studies/${study.id}/execute`);
                      navigate(`/studies/${study.id}/execute`);
                    }}
                    disabled={study.status !== StudyStatus.ACTIVE}
                  >
                    Wykonaj
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      console.log('Navigate to edit:', `/studies/${study.id}/edit`);
                      navigate(`/studies/${study.id}/edit`);
                    }}
                  >
                    Edytuj
                  </Button>
                  <Button
                    size="small"
                    startIcon={<StatsIcon />}
                    onClick={() => {
                      console.log('Navigate to statistics:', `/studies/${study.id}/statistics`);
                      navigate(`/studies/${study.id}/statistics`);
                    }}
                  >
                    Statystyki
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => navigate('/studies/create')}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default StudyList;

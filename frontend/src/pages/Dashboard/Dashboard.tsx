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
  CircularProgress,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add as AddIcon, Science as ScienceIcon, Assignment as AssignmentIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useStudies, usePredefinedProtocols } from '../../hooks';
import { Study, StudyStatus } from '../../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newStudyData, setNewStudyData] = useState({
    name: '',
    description: '',
    protocolId: '',
    category: ''
  });

  const {
    studies,
    isLoading: studiesLoading,
    error: studiesError,
    fetchStudies,
    createStudy,
    updateStudyStatus,
    deleteStudy
  } = useStudies();

  const {
    protocols: predefinedProtocols,
    isLoading: protocolsLoading,
    error: protocolsError,
    fetchPredefinedProtocols
  } = usePredefinedProtocols();

  useEffect(() => {
    fetchStudies();
    fetchPredefinedProtocols();
  }, [fetchStudies, fetchPredefinedProtocols]);

  const handleCreateStudy = async () => {
    if (!newStudyData.name || !newStudyData.protocolId) return;

    const success = await createStudy({
      name: newStudyData.name,
      description: newStudyData.description,
      protocolId: newStudyData.protocolId,
      category: newStudyData.category
    });

    if (success) {
      setOpenCreateDialog(false);
      setNewStudyData({ name: '', description: '', protocolId: '', category: '' });
    }
  };

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

  if (studiesLoading || protocolsLoading) {
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
            onClick={() => navigate('/predefined-protocols')}
            sx={{ mr: 2 }}
          >
            Protokoły
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateDialog(true)}
          >
            Nowe Badanie
          </Button>
        </Box>
      </Box>

      {(studiesError || protocolsError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {studiesError || protocolsError}
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
                  onClick={() => setOpenCreateDialog(true)}
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

      {/* Create Study Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Utwórz Nowe Badanie</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nazwa badania"
            fullWidth
            variant="outlined"
            value={newStudyData.name}
            onChange={(e) => setNewStudyData({ ...newStudyData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Opis"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newStudyData.description}
            onChange={(e) => setNewStudyData({ ...newStudyData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Protokół</InputLabel>
            <Select
              value={newStudyData.protocolId}
              label="Protokół"
              onChange={(e) => setNewStudyData({ ...newStudyData, protocolId: e.target.value })}
            >
              {predefinedProtocols.map((protocol) => (
                <MenuItem key={protocol.id} value={protocol.id}>
                  {protocol.title} ({protocol.standard})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Kategoria"
            fullWidth
            variant="outlined"
            value={newStudyData.category}
            onChange={(e) => setNewStudyData({ ...newStudyData, category: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Anuluj</Button>
          <Button
            onClick={handleCreateStudy}
            variant="contained"
            disabled={!newStudyData.name || !newStudyData.protocolId}
          >
            Utwórz
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
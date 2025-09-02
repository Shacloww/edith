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
  TextField,
  Alert,
  CircularProgress,
  Fab,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as PlayIcon,
  MoreVert as MoreVertIcon,
  Science as ScienceIcon,
  Assessment as StatsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as CopyIcon,
  Archive as ArchiveIcon,
  History as HistoryIcon,
  Settings as SettingsIcon
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
    fetchStudies,
    deleteStudy
  } = useStudies();
  
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [duplicateName, setDuplicateName] = useState('');

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, study: Study) => {
    setMenuAnchor(event.currentTarget);
    setSelectedStudy(study);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedStudy(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedStudy) {
      await deleteStudy(selectedStudy.id);
      setDeleteDialogOpen(false);
      handleMenuClose();
    }
  };

  const handleDuplicate = () => {
    if (selectedStudy) {
      setDuplicateName(`${selectedStudy.name} (kopia)`);
      setDuplicateDialogOpen(true);
    }
  };

  const handleDuplicateConfirm = async () => {
    // TODO: Implement study duplication
    setDuplicateDialogOpen(false);
    handleMenuClose();
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
      {/* Header */}
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

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Wszystkie badania
              </Typography>
              <Typography variant="h4">
                {studies.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Aktywne
              </Typography>
              <Typography variant="h4">
                {studies.filter(s => s.status === StudyStatus.ACTIVE).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Zakończone
              </Typography>
              <Typography variant="h4">
                {studies.filter(s => s.status === StudyStatus.COMPLETED).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Sesje
              </Typography>
              <Typography variant="h4">
                {studies.reduce((sum, study) => sum + (study._count?.sessions || 0), 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Studies List */}
      {studies.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <ScienceIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={getStatusLabel(study.status)}
                        color={getStatusColor(study.status)}
                        size="small"
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, study)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
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
                  
                  {study._count && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Sesje:</strong> {study._count.sessions || 0}
                    </Typography>
                  )}
                  
                  <Typography variant="caption" color="text.secondary">
                    Utworzono: {new Date(study.createdAt).toLocaleDateString('pl-PL')}
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <Tooltip title="Wykonaj badanie">
                    <Button
                      size="small"
                      startIcon={<PlayIcon />}
                      onClick={() => navigate(`/studies/${study.id}/execute`)}
                      disabled={study.status !== StudyStatus.ACTIVE}
                    >
                      Wykonaj
                    </Button>
                  </Tooltip>
                  <Tooltip title="Edytuj badanie">
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/studies/${study.id}/edit`)}
                    >
                      Edytuj
                    </Button>
                  </Tooltip>
                  <Tooltip title="Statystyki">
                    <Button
                      size="small"
                      startIcon={<StatsIcon />}
                      onClick={() => navigate(`/studies/${study.id}/statistics`)}
                    >
                      Statystyki
                    </Button>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Action Button */}
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

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => navigate(`/studies/${selectedStudy?.id}/edit`)}>
          <EditIcon sx={{ mr: 1 }} />
          Edytuj
        </MenuItem>
        <MenuItem onClick={handleDuplicate}>
          <CopyIcon sx={{ mr: 1 }} />
          Duplikuj
        </MenuItem>
        <MenuItem onClick={() => navigate(`/studies/${selectedStudy?.id}/statistics`)}>
          <StatsIcon sx={{ mr: 1 }} />
          Statystyki
        </MenuItem>
        <MenuItem onClick={() => setDeleteDialogOpen(true)}>
          <DeleteIcon sx={{ mr: 1 }} />
          Usuń
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Usuń badanie</DialogTitle>
        <DialogContent>
          Czy na pewno chcesz usunąć badanie "{selectedStudy?.name}"? 
          Ta operacja jest nieodwracalna.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Anuluj</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Usuń
          </Button>
        </DialogActions>
      </Dialog>

      {/* Duplicate Dialog */}
      <Dialog open={duplicateDialogOpen} onClose={() => setDuplicateDialogOpen(false)}>
        <DialogTitle>Duplikuj badanie</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nazwa nowego badania"
            fullWidth
            variant="outlined"
            value={duplicateName}
            onChange={(e) => setDuplicateName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDuplicateDialogOpen(false)}>Anuluj</Button>
          <Button onClick={handleDuplicateConfirm} variant="contained">
            Duplikuj
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudyList;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Assessment as StatsIcon,
  Link as LinkIcon,
  Quiz as SurveyIcon
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { studiesApi, responsesApi } from '../services/api';
import { Study, StudyStatus, StudyStatistics } from '../types';

const StudyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [study, setStudy] = useState<Study | null>(null);
  const [statistics, setStatistics] = useState<StudyStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dialogi
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<StudyStatus>(StudyStatus.DRAFT);

  useEffect(() => {
    if (id) {
      fetchStudyDetails();
      fetchStatistics();
    }
  }, [id]);

  const fetchStudyDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await studiesApi.getById(id);
      
      if (response.success && response.data) {
        setStudy(response.data);
      } else {
        setError(response.error || 'Nie udało się pobrać szczegółów badania');
      }
    } catch (error) {
      console.error('Error fetching study:', error);
      setError('Nie udało się pobrać szczegółów badania');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    if (!id) return;
    
    try {
      const response = await responsesApi.getStatistics(id);
      
      if (response.success && response.data) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Nie pokazujemy błędu dla statystyk - może po prostu nie ma jeszcze odpowiedzi
    }
  };

  const handleStatusChange = async () => {
    if (!study) return;
    
    try {
      setUpdating(true);
      const response = await studiesApi.updateStatus(study.id, newStatus);
      
      if (response.success && response.data) {
        setStudy(response.data);
        setShowStatusDialog(false);
        toast.success('Status badania został zaktualizowany');
      } else {
        toast.error(response.error || 'Nie udało się zaktualizować statusu');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Nie udało się zaktualizować statusu');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!study) return;
    
    try {
      setUpdating(true);
      const response = await studiesApi.delete(study.id);
      
      if (response.success) {
        toast.success('Badanie zostało usunięte');
        navigate('/studies');
      } else {
        toast.error(response.error || 'Nie udało się usunąć badania');
      }
    } catch (error) {
      console.error('Error deleting study:', error);
      toast.error('Nie udało się usunąć badania');
    } finally {
      setUpdating(false);
      setShowDeleteDialog(false);
    }
  };

  const getStatusColor = (status: StudyStatus) => {
    switch (status) {
      case 'DRAFT': return 'default';
      case 'ACTIVE': return 'success';
      case 'COMPLETED': return 'info';
      case 'PAUSED': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: StudyStatus) => {
    switch (status) {
      case 'DRAFT': return 'Szkic';
      case 'ACTIVE': return 'Aktywne';
      case 'COMPLETED': return 'Zakończone';
      case 'PAUSED': return 'Wstrzymane';
      default: return status;
    }
  };

  const getSurveyUrl = () => {
    return `${window.location.origin}/survey/${study?.id}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Link został skopiowany do schowka');
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Ładowanie...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (error || !study) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Błąd
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Badanie nie zostało znalezione'}
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/studies')}>
          Powrót do listy badań
        </Button>
      </Box>
    );
  }
  return (
    <Box>
      {/* Nagłówek z akcjami */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {study.title}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip 
            label={getStatusLabel(study.status)} 
            color={getStatusColor(study.status)}
            variant="filled"
          />
          
          <Tooltip title="Zmień status">
            <IconButton 
              onClick={() => {
                setNewStatus(study.status);
                setShowStatusDialog(true);
              }}
              color="primary"
            >
              {study.status === 'ACTIVE' ? <PauseIcon /> : <PlayIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Edytuj badanie">
            <IconButton 
              onClick={() => navigate(`/studies/${study.id}/edit`)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Weź udział w badaniu">
            <IconButton 
              onClick={() => navigate(`/survey/${study.id}`)}
              color="success"
              disabled={study.status !== 'ACTIVE'}
            >
              <SurveyIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Udostępnij link">
            <IconButton 
              onClick={() => setShowShareDialog(true)}
              color="primary"
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Zobacz statystyki">
            <IconButton 
              onClick={() => navigate(`/studies/${study.id}/statistics`)}
              color="primary"
            >
              <StatsIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Usuń badanie">
            <IconButton 
              onClick={() => setShowDeleteDialog(true)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Informacje podstawowe */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informacje o badaniu
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Tytuł</Typography>
                  <Typography variant="body1">{study.title}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip 
                    label={getStatusLabel(study.status)} 
                    color={getStatusColor(study.status)}
                    size="small"
                  />
                </Grid>
                
                {study.description && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Opis</Typography>
                    <Typography variant="body1">{study.description}</Typography>
                  </Grid>
                )}
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Data rozpoczęcia</Typography>
                  <Typography variant="body1">
                    {study.startDate ? new Date(study.startDate).toLocaleDateString('pl-PL') : 'Nie ustawiona'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Data zakończenia</Typography>
                  <Typography variant="body1">
                    {study.endDate ? new Date(study.endDate).toLocaleDateString('pl-PL') : 'Nie ustawiona'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Data utworzenia</Typography>
                  <Typography variant="body1">
                    {new Date(study.createdAt).toLocaleString('pl-PL')}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Ostatnia modyfikacja</Typography>
                  <Typography variant="body1">
                    {new Date(study.updatedAt).toLocaleString('pl-PL')}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Schemat badawczy */}
          {study.researchSchema && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Schemat badawczy: {study.researchSchema.title}
                </Typography>
                
                {study.researchSchema.description && (
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {study.researchSchema.description}
                  </Typography>
                )}
                
                <Typography variant="subtitle2" gutterBottom>
                  Pytania ({study.researchSchema.questions?.length || 0})
                </Typography>
                
                <List dense>
                  {study.researchSchema.questions?.map((question, index) => (
                    <React.Fragment key={question.id}>
                      <ListItem>
                        <ListItemText
                          primary={`${index + 1}. ${question.title}`}
                          secondary={
                            <Box>
                              <Chip label={question.type} size="small" variant="outlined" sx={{ mr: 1 }} />
                              {question.required && (
                                <Chip label="Wymagane" size="small" color="error" variant="outlined" />
                              )}
                              {question.description && (
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                  {question.description}
                                </Typography>
                              )}
                            </Box>
                          }
                          secondaryTypographyProps={{ component: 'div' }}
                        />
                      </ListItem>
                      {index < (study.researchSchema?.questions?.length || 0) - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Panel boczny - statystyki i akcje */}
        <Grid item xs={12} md={4}>
          {/* Link do ankiety */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Link do ankiety
              </Typography>
              
              <Paper sx={{ p: 2, mb: 2, backgroundColor: 'grey.50' }}>
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                  {getSurveyUrl()}
                </Typography>
              </Paper>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LinkIcon />}
                  onClick={() => copyToClipboard(getSurveyUrl())}
                  fullWidth
                >
                  Kopiuj link
                </Button>
                
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ShareIcon />}
                  onClick={() => setShowShareDialog(true)}
                  fullWidth
                >
                  Udostępnij
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Statystyki */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statystyki odpowiedzi
              </Typography>
              
              {statistics ? (
                <Box>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {statistics.totalResponses}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Łączna liczba odpowiedzi
                  </Typography>
                  
                  {statistics.totalResponses > 0 && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<StatsIcon />}
                      onClick={() => navigate(`/studies/${study.id}/statistics`)}
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      Zobacz szczegółowe statystyki
                    </Button>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Brak odpowiedzi do wyświetlenia
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog zmiany statusu */}
      <Dialog open={showStatusDialog} onClose={() => setShowStatusDialog(false)}>
        <DialogTitle>Zmień status badania</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as StudyStatus)}
              label="Status"
            >
              <MenuItem value={StudyStatus.DRAFT}>Szkic</MenuItem>
              <MenuItem value={StudyStatus.ACTIVE}>Aktywne</MenuItem>
              <MenuItem value={StudyStatus.PAUSED}>Wstrzymane</MenuItem>
              <MenuItem value={StudyStatus.COMPLETED}>Zakończone</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStatusDialog(false)}>Anuluj</Button>
          <Button onClick={handleStatusChange} disabled={updating} variant="contained">
            {updating ? 'Zapisywanie...' : 'Zapisz'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog udostępniania */}
      <Dialog open={showShareDialog} onClose={() => setShowShareDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Udostępnij badanie</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Wyślij ten link uczestnikom badania:
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            value={getSurveyUrl()}
            variant="outlined"
            sx={{ mt: 2 }}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShareDialog(false)}>Zamknij</Button>
          <Button onClick={() => navigate(`/survey/${study?.id}`)} variant="outlined" color="success">
            Weź udział
          </Button>
          <Button onClick={() => copyToClipboard(getSurveyUrl())} variant="contained">
            Kopiuj link
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog usuwania */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Usuń badanie</DialogTitle>
        <DialogContent>
          <Typography>
            Czy na pewno chcesz usunąć badanie "{study.title}"? 
            Ta operacja jest nieodwracalna i usunie również wszystkie odpowiedzi.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Anuluj</Button>
          <Button onClick={handleDelete} disabled={updating} color="error" variant="contained">
            {updating ? 'Usuwanie...' : 'Usuń'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudyDetails;

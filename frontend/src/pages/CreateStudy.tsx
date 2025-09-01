import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { researchSchemasApi, predefinedSchemasApi, studiesApi } from '../services/api';
import { ResearchSchema, CreateStudyForm, StudyStatus } from '../types';

const steps = ['Wybór schematu', 'Szczegóły badania', 'Podsumowanie'];

const CreateStudy: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dane formularza
  const [selectedSchema, setSelectedSchema] = useState<ResearchSchema | null>(null);
  const [studyData, setStudyData] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +30 dni
  });

  // Listy schematów
  const [customSchemas, setCustomSchemas] = useState<ResearchSchema[]>([]);
  const [predefinedSchemas, setPredefinedSchemas] = useState<ResearchSchema[]>([]); // Zaimportowane predefiniowane schematy
  const [showPredefined, setShowPredefined] = useState(false);

  useEffect(() => {
    fetchSchemas();
  }, []);

  const fetchSchemas = async () => {
    try {
      setLoading(true);
      
      // Pobierz wszystkie schematy z bazy danych (zawierają zaimportowane predefiniowane)
      const allSchemasResponse = await researchSchemasApi.getAll();
      if (allSchemasResponse.success) {
        const allSchemas = allSchemasResponse.data || [];
        
        // Rozdziel na własne i predefiniowane na podstawie tytułów
        const custom = allSchemas.filter(schema => 
          !schema.title.startsWith('ISO ') && 
          !schema.title.startsWith('ASTM ') && 
          !schema.title.startsWith('Finat ') &&
          !schema.title.startsWith('UL ')
        );
        
        const imported = allSchemas.filter(schema => 
          schema.title.startsWith('ISO ') || 
          schema.title.startsWith('ASTM ') || 
          schema.title.startsWith('Finat ') ||
          schema.title.startsWith('UL ')
        );
        
        setCustomSchemas(custom);
        setPredefinedSchemas(imported);
      }
    } catch (error) {
      console.error('Error fetching schemas:', error);
      setError('Nie udało się pobrać schematów badawczych');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedSchema) {
      setError('Proszę wybrać schemat badawczy');
      return;
    }
    if (activeStep === 1 && !studyData.title.trim()) {
      setError('Proszę podać tytuł badania');
      return;
    }
    setError(null);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSchemaSelect = (schema: ResearchSchema) => {
    setSelectedSchema(schema);
    setError(null);
  };

  const handleCreateStudy = async () => {
    if (!selectedSchema) {
      setError('Nie wybrano schematu badawczego');
      return;
    }

    try {
      setLoading(true);
      
      const studyForm: CreateStudyForm = {
        title: studyData.title,
        description: studyData.description || undefined,
        researchSchemaId: selectedSchema.id,
        startDate: studyData.startDate || undefined,
        endDate: studyData.endDate || undefined
      };

      const response = await studiesApi.create(studyForm);
      
      if (response.success) {
        toast.success('Badanie zostało utworzone pomyślnie!');
        navigate('/studies');
      } else {
        setError(response.error || 'Nie udało się utworzyć badania');
      }
    } catch (error: any) {
      console.error('Error creating study:', error);
      setError(error.response?.data?.error || 'Nie udało się utworzyć badania');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Wybierz schemat badawczy
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Własne schematy */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Własne schematy ({customSchemas.length})
                  </Typography>
                  {customSchemas.length === 0 ? (
                    <Typography color="text.secondary">
                      Brak własnych schematów. 
                      <Button 
                        size="small" 
                        onClick={() => navigate('/schemas/create')}
                        sx={{ ml: 1 }}
                      >
                        Utwórz pierwszy
                      </Button>
                    </Typography>
                  ) : (
                    <List dense>
                      {customSchemas.map((schema) => (
                        <ListItem key={schema.id} disablePadding>
                          <ListItemButton
                            selected={selectedSchema?.id === schema.id}
                            onClick={() => handleSchemaSelect(schema)}
                          >
                            <ListItemText
                              primary={schema.title}
                              secondary={`${schema.questions?.length || 0} pytań • ${schema.description?.substring(0, 50) || 'Brak opisu'}${schema.description && schema.description.length > 50 ? '...' : ''}`}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </Grid>

              {/* Predefiniowane schematy */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Schematy predefiniowane ({predefinedSchemas.length})
                  </Typography>
                  {predefinedSchemas.length === 0 ? (
                    <Typography color="text.secondary">
                      Brak dostępnych schematów predefiniowanych.
                    </Typography>
                  ) : (
                    <List dense>
                      {predefinedSchemas.slice(0, 5).map((schema) => (
                        <ListItem key={schema.id} disablePadding>
                          <ListItemButton
                            selected={selectedSchema?.id === schema.id}
                            onClick={() => handleSchemaSelect(schema)}
                          >
                            <ListItemText
                              primary={schema.title}
                              secondary={`${schema.questions?.length || 0} pytań • ${schema.description?.substring(0, 50) || 'Brak opisu'}${schema.description && schema.description.length > 50 ? '...' : ''}`}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                      {predefinedSchemas.length > 5 && (
                        <ListItem>
                          <Button 
                            size="small" 
                            onClick={() => setShowPredefined(true)}
                            fullWidth
                          >
                            Zobacz wszystkie ({predefinedSchemas.length})
                          </Button>
                        </ListItem>
                      )}
                    </List>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Szczegóły badania
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Tytuł badania"
                  fullWidth
                  required
                  value={studyData.title}
                  onChange={(e) => setStudyData({ ...studyData, title: e.target.value })}
                  error={!studyData.title.trim() && error !== null}
                  helperText={!studyData.title.trim() && error !== null ? 'Tytuł jest wymagany' : ''}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Opis badania"
                  fullWidth
                  multiline
                  rows={3}
                  value={studyData.description}
                  onChange={(e) => setStudyData({ ...studyData, description: e.target.value })}
                  helperText="Opcjonalny opis badania dla uczestników"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Data rozpoczęcia"
                  type="date"
                  fullWidth
                  value={studyData.startDate}
                  onChange={(e) => setStudyData({ ...studyData, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Data zakończenia"
                  type="date"
                  fullWidth
                  value={studyData.endDate}
                  onChange={(e) => setStudyData({ ...studyData, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Podsumowanie
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Szczegóły badania
                    </Typography>
                    <Typography><strong>Tytuł:</strong> {studyData.title}</Typography>
                    {studyData.description && (
                      <Typography><strong>Opis:</strong> {studyData.description}</Typography>
                    )}
                    <Typography><strong>Data rozpoczęcia:</strong> {studyData.startDate || 'Nie ustawiona'}</Typography>
                    <Typography><strong>Data zakończenia:</strong> {studyData.endDate || 'Nie ustawiona'}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Wybrany schemat
                    </Typography>
                    <Typography><strong>Nazwa:</strong> {selectedSchema?.title}</Typography>
                    <Typography><strong>Pytania:</strong> {selectedSchema?.questions?.length || 0}</Typography>
                    {selectedSchema?.description && (
                      <Typography><strong>Opis:</strong> {selectedSchema.description}</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Utwórz nowe badanie
      </Typography>
      
      <Card>
        <CardContent>
          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Zawartość kroków */}
          {renderStepContent()}

          {/* Przyciski nawigacji */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
            >
              Wstecz
            </Button>

            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  onClick={handleCreateStudy}
                  disabled={loading}
                  variant="contained"
                  size="large"
                >
                  {loading ? 'Tworzenie...' : 'Utwórz badanie'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={loading}
                >
                  Dalej
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog z pełną listą predefiniowanych schematów */}
      <Dialog 
        open={showPredefined} 
        onClose={() => setShowPredefined(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Wybierz schemat predefiniowany</DialogTitle>
        <DialogContent>
          <List>
            {predefinedSchemas.map((schema) => (
              <ListItem key={schema.id} disablePadding>
                <ListItemButton
                  selected={selectedSchema?.id === schema.id}
                  onClick={() => {
                    handleSchemaSelect(schema);
                    setShowPredefined(false);
                  }}
                >
                  <ListItemText
                    primary={schema.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {schema.questions?.length || 0} pytań
                        </Typography>
                        {schema.description && (
                          <Typography variant="body2" color="text.secondary">
                            {schema.description}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPredefined(false)}>Anuluj</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateStudy;

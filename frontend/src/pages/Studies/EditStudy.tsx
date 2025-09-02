import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Alert
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Science as ScienceIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { StudyStatus, StudyTemplate } from '../../types';

const getStatusLabel = (status: StudyTemplate['status']): string => {
  switch (status) {
    case 'active': return 'Aktywne';
    case 'draft': return 'Szkic';
    case 'completed': return 'Zakończone';
    case 'paused': return 'Wstrzymane';
    default: return 'Nieznany';
  }
};

const EditStudy: React.FC = () => {
  const navigate = useNavigate();
  const { studyId } = useParams<{ studyId: string }>();
  
  const [studyData, setStudyData] = useState<StudyTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (studyId) {
      loadStudy(studyId);
    }
  }, [studyId]);

  const loadStudy = async (id: string) => {
    try {
      setLoading(true);
      // TODO: Load from API
      // const response = await studyApi.get(id);
      
      // Mock data
      const mockStudy: StudyTemplate = {
        id,
        name: 'Badanie wytrzymałości PE-HD',
        description: 'Systematyczne badanie właściwości mechanicznych polietylenu HD',
        protocolId: 'astm-d638',
        protocolName: 'ASTM D638 - Właściwości Rozciągania',
        category: 'Mechaniczne',
        dataCollectionPlan: [],
        parameters: [],
        settings: {
          sampleSettings: {
            minSamples: 3,
            maxSamples: 10,
            defaultSamples: 5,
            sampleNaming: 'automatic',
            samplePrefix: 'PE-HD'
          },
          repetitionSettings: {
            allowRepetitions: true,
            maxRepetitions: 3,
            repetitionNaming: 'automatic'
          },
          validationSettings: {
            requireAllSteps: true,
            allowSkippingOptional: false,
            requireApproval: false
          },
          exportSettings: {
            autoExport: false,
            exportFormat: 'xlsx',
            includeCalculations: true,
            includeCharts: true
          }
        },
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'Admin User'
      };

      setStudyData(mockStudy);
    } catch (error) {
      console.error('Error loading study:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!studyData) return;

    try {
      setSaving(true);
      
      const updatedStudy = {
        ...studyData,
        updatedAt: new Date().toISOString()
      };

      // TODO: Save to API
      console.log('Saving study:', updatedStudy);
      
      navigate('/studies');
    } catch (error) {
      console.error('Error saving study:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Ładowanie badania...</Typography>
      </Box>
    );
  }

  if (!studyData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Nie znaleziono badania</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate('/studies')} sx={{ mr: 1 }}>
            <BackIcon />
          </IconButton>
          <EditIcon sx={{ mr: 1, fontSize: 28 }} />
          <Box>
            <Typography variant="h4">
              Edytuj badanie
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {studyData.name}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Podstawowe informacje
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nazwa badania"
                    value={studyData.name}
                    onChange={(e) => setStudyData(prev => prev ? ({ ...prev, name: e.target.value }) : prev)}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Opis badania"
                    value={studyData.description}
                    onChange={(e) => setStudyData(prev => prev ? ({ ...prev, description: e.target.value }) : prev)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled>
                    <InputLabel>Protokół</InputLabel>
                    <Select value={studyData.protocolId}>
                      <MenuItem value={studyData.protocolId}>
                        {studyData.protocolName}
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="text.secondary">
                    Protokół nie może być zmieniony po utworzeniu badania
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    disabled
                    label="Kategoria"
                    value={studyData.category}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status badania</InputLabel>
                    <Select
                      value={studyData.status}
                      onChange={(e) => setStudyData(prev => prev ? ({ 
                        ...prev, 
                        status: e.target.value as StudyTemplate['status']
                      }) : prev)}
                    >
                      <MenuItem value="draft">Szkic</MenuItem>
                      <MenuItem value="active">Aktywne</MenuItem>
                      <MenuItem value="archived">Zarchiwizowane</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Settings */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ustawienia
              </Typography>

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Próbki
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Min"
                    value={studyData.settings.sampleSettings.minSamples}
                    onChange={(e) => setStudyData(prev => prev ? ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        sampleSettings: {
                          ...prev.settings.sampleSettings,
                          minSamples: parseInt(e.target.value) || 1
                        }
                      }
                    }) : prev)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Max"
                    value={studyData.settings.sampleSettings.maxSamples}
                    onChange={(e) => setStudyData(prev => prev ? ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        sampleSettings: {
                          ...prev.settings.sampleSettings,
                          maxSamples: parseInt(e.target.value) || 1
                        }
                      }
                    }) : prev)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Domyślnie"
                    value={studyData.settings.sampleSettings.defaultSamples}
                    onChange={(e) => setStudyData(prev => prev ? ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        sampleSettings: {
                          ...prev.settings.sampleSettings,
                          defaultSamples: parseInt(e.target.value) || 1
                        }
                      }
                    }) : prev)}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                size="small"
                label="Prefiks próbek"
                value={studyData.settings.sampleSettings.samplePrefix}
                onChange={(e) => setStudyData(prev => prev ? ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    sampleSettings: {
                      ...prev.settings.sampleSettings,
                      samplePrefix: e.target.value
                    }
                  }
                }) : prev)}
                sx={{ mt: 2 }}
              />

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                Walidacja
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={studyData.settings.validationSettings.requireAllSteps}
                    onChange={(e) => setStudyData(prev => prev ? ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        validationSettings: {
                          ...prev.settings.validationSettings,
                          requireAllSteps: e.target.checked
                        }
                      }
                    }) : prev)}
                  />
                }
                label="Wymagaj wszystkich kroków"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={studyData.settings.validationSettings.requireApproval}
                    onChange={(e) => setStudyData(prev => prev ? ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        validationSettings: {
                          ...prev.settings.validationSettings,
                          requireApproval: e.target.checked
                        }
                      }
                    }) : prev)}
                  />
                }
                label="Wymagaj zatwierdzenia"
              />

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                Eksport
              </Typography>

              <FormControl fullWidth size="small">
                <InputLabel>Format eksportu</InputLabel>
                <Select
                  value={studyData.settings.exportSettings.exportFormat}
                  onChange={(e) => setStudyData(prev => prev ? ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      exportSettings: {
                        ...prev.settings.exportSettings,
                        exportFormat: e.target.value as any
                      }
                    }
                  }) : prev)}
                >
                  <MenuItem value="xlsx">Excel (.xlsx)</MenuItem>
                  <MenuItem value="csv">CSV (.csv)</MenuItem>
                  <MenuItem value="json">JSON (.json)</MenuItem>
                  <MenuItem value="pdf">PDF (.pdf)</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={studyData.settings.exportSettings.includeCalculations}
                    onChange={(e) => setStudyData(prev => prev ? ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        exportSettings: {
                          ...prev.settings.exportSettings,
                          includeCalculations: e.target.checked
                        }
                      }
                    }) : prev)}
                  />
                }
                label="Dołącz obliczenia"
                sx={{ mt: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={studyData.settings.exportSettings.includeCharts}
                    onChange={(e) => setStudyData(prev => prev ? ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        exportSettings: {
                          ...prev.settings.exportSettings,
                          includeCharts: e.target.checked
                        }
                      }
                    }) : prev)}
                  />
                }
                label="Dołącz wykresy"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Study Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informacje o badaniu
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Utworzono
                    </Typography>
                    <Typography variant="body1">
                      {studyData.createdAt ? new Date(studyData.createdAt).toLocaleDateString('pl-PL') : 'Brak danych'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Zaktualizowano
                    </Typography>
                    <Typography variant="body1">
                      {studyData.updatedAt ? new Date(studyData.updatedAt).toLocaleDateString('pl-PL') : 'Brak danych'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Utworzone przez
                    </Typography>
                    <Typography variant="body1">
                      {studyData.createdBy}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={getStatusLabel(studyData.status)}
                      color={studyData.status === 'active' ? 'success' :
                            studyData.status === 'draft' ? 'warning' : 'default'}
                      size="small"
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditStudy;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Tabs,
  Tab,
  Badge,
  Avatar
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Science as ScienceIcon,
  Assignment as ProtocolIcon,
  DataUsage as DataIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StudyStatus, StudyTemplate, DataPoint, DataCollectionStep, StudyParameter } from '../../types';
import { useStudies, usePredefinedProtocols } from '../../hooks';

const CreateStudy: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const protocolId = searchParams.get('protocolId');
  
  const [activeStep, setActiveStep] = useState(0);
  const [studyData, setStudyData] = useState<Partial<StudyTemplate>>({
    name: '',
    description: '',
    protocolId: protocolId || '',
    protocolName: '',
    category: '',
    dataCollectionPlan: [],
    parameters: [],
    settings: {
      sampleSettings: {
        minSamples: 3,
        maxSamples: 20,
        defaultSamples: 5,
        sampleNaming: 'automatic',
        samplePrefix: ''
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
    status: 'draft'
  });

  const [protocols, setProtocols] = useState<any[]>([]);
  const [predefinedProtocols, setPredefinedProtocols] = useState<any[]>([]);
  const [userProtocols, setUserProtocols] = useState<any[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<any>(null);
  const [dataPointDialog, setDataPointDialog] = useState(false);
  const [editingDataPoint, setEditingDataPoint] = useState<DataPoint | null>(null);
  const [editingStepId, setEditingStepId] = useState<string>('');
  const [protocolTab, setProtocolTab] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const steps = [
    'Podstawowe informacje',
    'Wybór protokołu',
    'Plan zbierania danych', 
    'Parametry badania',
    'Ustawienia',
    'Podsumowanie'
  ];

  useEffect(() => {
    loadAllProtocols();
  }, []);

  useEffect(() => {
    if (protocolId && [...predefinedProtocols, ...userProtocols].length > 0) {
      const protocol = [...predefinedProtocols, ...userProtocols].find(p => p.id === protocolId);
      if (protocol) {
        setSelectedProtocol(protocol);
        setStudyData(prev => ({
          ...prev,
          protocolId: protocol.id,
          protocolName: protocol.title,
          category: protocol.category,
          name: `Badanie ${protocol.title}`,
          description: `Systematyczne badanie według protokołu ${protocol.title}`
        }));
      }
    }
  }, [protocolId, predefinedProtocols, userProtocols]);

  const loadAllProtocols = async () => {
    try {
      await Promise.all([
        loadPredefinedProtocols(),
        loadUserProtocols()
      ]);
    } catch (error) {
      console.error('Error loading protocols:', error);
    }
  };

  const loadPredefinedProtocols = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/predefined-protocols');
      const data = await response.json();
      
      if (data.success && data.data) {
        // Dla każdego protokołu pobierz szczegóły żeby mieć steps
        const protocolsWithDetails = await Promise.all(
          data.data.map(async (protocol: any) => {
            try {
              const detailResponse = await fetch(`http://localhost:5000/api/predefined-protocols/${protocol.id}`);
              const detailData = await detailResponse.json();
              
              if (detailData.success && detailData.data) {
                return {
                  id: protocol.id,
                  title: protocol.title,
                  category: protocol.category,
                  description: protocol.description,
                  type: 'predefined',
                  steps: detailData.data.steps || []
                };
              }
            } catch (error) {
              console.error(`Error loading details for protocol ${protocol.id}:`, error);
            }
            
            // Fallback bez steps
            return {
              id: protocol.id,
              title: protocol.title,
              category: protocol.category,
              description: protocol.description,
              type: 'predefined',
              steps: []
            };
          })
        );
        
        setPredefinedProtocols(protocolsWithDetails);
        console.log('Loaded protocols:', protocolsWithDetails.length);
      } else {
        throw new Error('Failed to load predefined protocols');
      }
    } catch (error) {
      console.error('Error loading predefined protocols:', error);
      
      // Fallback do danych mockowych
      const mockPredefined = [
        {
          id: 'astm-d638',
          title: 'ASTM D638 - Właściwości Rozciągania',
          category: 'Mechaniczne',
          description: 'Standardowy test właściwości rozciągania plastików',
          type: 'predefined',
          steps: [
            { id: 'prep', title: 'Przygotowanie próbek', description: 'Przygotowanie i kondycjonowanie próbek' },
            { id: 'setup', title: 'Ustawienie sprzętu', description: 'Konfiguracja maszyny wytrzymałościowej' },
            { id: 'test', title: 'Wykonanie testu', description: 'Przeprowadzenie badania rozciągania' },
            { id: 'calc', title: 'Obliczenia', description: 'Analiza wyników i obliczenia' }
          ]
        },
        {
          id: 'iso-11357',
          title: 'ISO 11357 - DSC',
          category: 'Termiczne',
          description: 'Różnicowa kalorymetria skaningowa',
          type: 'predefined',
          steps: [
            { id: 'prep', title: 'Przygotowanie próbek', description: 'Przygotowanie próbek do DSC' },
            { id: 'calib', title: 'Kalibracja', description: 'Kalibracja aparatury DSC' },
            { id: 'measure', title: 'Pomiar', description: 'Wykonanie pomiaru DSC' },
            { id: 'analysis', title: 'Analiza', description: 'Analiza termogramów' }
          ]
        },
        {
          id: 'astm-d256',
          title: 'ASTM D256 - Udarność Izod',
          category: 'Mechaniczne',
          description: 'Test udarności metodą Izod',
          type: 'predefined',
          steps: [
            { id: 'prep', title: 'Przygotowanie próbek', description: 'Przygotowanie próbek z karbem' },
            { id: 'setup', title: 'Ustawienie aparatu', description: 'Konfiguracja młota Izod' },
            { id: 'test', title: 'Wykonanie testu', description: 'Przeprowadzenie testu udarności' },
            { id: 'calc', title: 'Obliczenia', description: 'Obliczenie udarności' }
          ]
        }
      ];

      setPredefinedProtocols(mockPredefined);
    }
  };

  const loadUserProtocols = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/research-schemas');
      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.data) {
          const protocols = data.data.map((schema: any) => ({
            id: schema.id,
            title: schema.title,
            category: schema.category || 'Własne',
            description: schema.description,
            type: 'user',
            author: schema.createdBy || 'Użytkownik',
            createdAt: schema.createdAt || new Date().toISOString(),
            steps: schema.steps || []
          }));
          setUserProtocols(protocols);
          console.log('Loaded user protocols:', protocols.length);
          return;
        }
      }
      
      // Fallback to mock data if API fails
      throw new Error('Failed to load user protocols from API');
    } catch (error) {
      console.error('Error loading user protocols:', error);
      
      // Mock data - protokoły użytkownika
      const mockUserProtocols = [
        {
          id: 'user-pe-test',
          title: 'Test PE-HD - Wewnętrzny',
          category: 'Mechaniczne',
          description: 'Wewnętrzny protokół testowania polietylenu HD',
          type: 'user',
          author: 'Jan Kowalski',
          createdAt: '2024-01-10',
          steps: [
            { id: 'conditioning', title: 'Kondycjonowanie', description: 'Kondycjonowanie próbek 48h w 23°C' },
            { id: 'measurement', title: 'Pomiary', description: 'Pomiar wymiarów próbek' },
            { id: 'tensile', title: 'Rozciąganie', description: 'Test rozciągania z prędkością 50mm/min' },
            { id: 'analysis', title: 'Analiza', description: 'Analiza wyników i raportowanie' }
          ]
        },
        {
          id: 'user-thermal-analysis',
          title: 'Analiza Termiczna - Kompletna',
          category: 'Termiczne',
          description: 'Kompleksowa analiza termiczna z DSC i TGA',
          type: 'user',
          author: 'Anna Nowak',
          createdAt: '2024-01-15',
          steps: [
            { id: 'sample-prep', title: 'Przygotowanie', description: 'Przygotowanie próbek o masie 5-10mg' },
            { id: 'dsc', title: 'DSC', description: 'Różnicowa kalorymetria skaningowa' },
            { id: 'tga', title: 'TGA', description: 'Analiza termograwimetryczna' },
            { id: 'results', title: 'Wyniki', description: 'Porównanie i interpretacja wyników' }
          ]
        }
      ];

      setUserProtocols(mockUserProtocols);
    }
  };

  const getCategories = () => {
    const allProtocols = [...predefinedProtocols, ...userProtocols];
    const categories = [...new Set(allProtocols.map(p => p.category))];
    return categories;
  };

  const getFilteredProtocols = (protocols: any[]) => {
    if (categoryFilter === 'all') return protocols;
    return protocols.filter(p => p.category === categoryFilter);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleProtocolSelect = (protocol: any) => {
    setSelectedProtocol(protocol);
    setStudyData(prev => ({
      ...prev,
      protocolId: protocol.id,
      protocolName: protocol.title,
      category: protocol.category,
      dataCollectionPlan: protocol.steps?.map((step: any, index: number) => ({
        id: `step-${index + 1}`,
        stepNumber: index + 1,
        protocolStepId: step.id,
        stepName: step.title,
        description: step.description,
        dataPoints: [],
        requiredConditions: [],
        isRequired: true
      })) || []
    }));
  };

  const handleAddDataPoint = (stepId: string) => {
    setEditingStepId(stepId);
    setEditingDataPoint(null);
    setDataPointDialog(true);
  };

  const handleEditDataPoint = (stepId: string, dataPoint: DataPoint) => {
    setEditingStepId(stepId);
    setEditingDataPoint(dataPoint);
    setDataPointDialog(true);
  };

  const handleSaveDataPoint = (dataPoint: DataPoint) => {
    setStudyData(prev => ({
      ...prev,
      dataCollectionPlan: prev.dataCollectionPlan?.map(step => {
        if (step.id === editingStepId) {
          if (editingDataPoint) {
            // Edit existing
            return {
              ...step,
              dataPoints: step.dataPoints.map(dp => 
                dp.id === editingDataPoint.id ? dataPoint : dp
              )
            };
          } else {
            // Add new
            return {
              ...step,
              dataPoints: [...step.dataPoints, { ...dataPoint, id: `dp-${Date.now()}` }]
            };
          }
        }
        return step;
      }) || []
    }));
    setDataPointDialog(false);
  };

  const handleDeleteDataPoint = (stepId: string, dataPointId: string) => {
    setStudyData(prev => ({
      ...prev,
      dataCollectionPlan: prev.dataCollectionPlan?.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            dataPoints: step.dataPoints.filter(dp => dp.id !== dataPointId)
          };
        }
        return step;
      }) || []
    }));
  };

  const handleSaveStudy = async () => {
    try {
      // TODO: Save to API
      const studyToSave: StudyTemplate = {
        ...studyData,
        id: `study-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Current User' // TODO: Get from auth
      } as StudyTemplate;

      console.log('Saving study:', studyToSave);
      navigate('/studies');
    } catch (error) {
      console.error('Error saving study:', error);
    }
  };

  const renderBasicInfo = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Podstawowe informacje o badaniu
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nazwa badania"
            value={studyData.name}
            onChange={(e) => setStudyData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="np. Badanie wytrzymałości PE-HD"
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
            onChange={(e) => setStudyData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Opisz cel i zakres badania..."
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderProtocolSelection = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Wybór protokołu badawczego
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Wybierz protokół, na którym będzie oparte Twoje badanie. Możesz wybrać z predefiniowanych protokołów normowych lub własnych schematów.
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={protocolTab} 
          onChange={(e, newValue) => setProtocolTab(newValue)}
          variant="fullWidth"
        >
          <Tab 
            label={
              <Box display="flex" alignItems="center">
                <BusinessIcon sx={{ mr: 1 }} />
                Predefiniowane
                <Badge badgeContent={predefinedProtocols.length} color="primary" sx={{ ml: 1 }} />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center">
                <PersonIcon sx={{ mr: 1 }} />
                Moje protokoły
                <Badge badgeContent={userProtocols.length} color="secondary" sx={{ ml: 1 }} />
              </Box>
            } 
          />
        </Tabs>
      </Paper>

      {/* Filtr kategorii */}
      <Box sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Kategoria</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label="Kategoria"
          >
            <MenuItem value="all">Wszystkie kategorie</MenuItem>
            {getCategories().map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Predefiniowane protokoły */}
      {protocolTab === 0 && (
        <Grid container spacing={2}>
          {getFilteredProtocols(predefinedProtocols).map((protocol) => (
            <Grid item xs={12} md={6} key={protocol.id}>
              <Card 
                variant={selectedProtocol?.id === protocol.id ? "elevation" : "outlined"}
                sx={{ 
                  cursor: 'pointer',
                  border: selectedProtocol?.id === protocol.id ? 2 : 1,
                  borderColor: selectedProtocol?.id === protocol.id ? 'primary.main' : 'divider',
                  height: '100%'
                }}
                onClick={() => handleProtocolSelect(protocol)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <ProtocolIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">
                      {protocol.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {protocol.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip label={protocol.category} size="small" color="primary" variant="outlined" />
                    <Chip label="Normowy" size="small" color="success" />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Kroków: {protocol.steps?.length || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {getFilteredProtocols(predefinedProtocols).length === 0 && (
            <Grid item xs={12}>
              <Alert severity="info">
                {categoryFilter === 'all' 
                  ? 'Brak dostępnych predefiniowanych protokołów.'
                  : `Brak predefiniowanych protokołów w kategorii "${categoryFilter}".`
                }
              </Alert>
            </Grid>
          )}
        </Grid>
      )}

      {/* Protokoły użytkownika */}
      {protocolTab === 1 && (
        <Grid container spacing={2}>
          {getFilteredProtocols(userProtocols).map((protocol) => (
            <Grid item xs={12} md={6} key={protocol.id}>
              <Card 
                variant={selectedProtocol?.id === protocol.id ? "elevation" : "outlined"}
                sx={{ 
                  cursor: 'pointer',
                  border: selectedProtocol?.id === protocol.id ? 2 : 1,
                  borderColor: selectedProtocol?.id === protocol.id ? 'primary.main' : 'divider',
                  height: '100%'
                }}
                onClick={() => handleProtocolSelect(protocol)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <ProtocolIcon sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="h6">
                      {protocol.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {protocol.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Chip label={protocol.category} size="small" color="secondary" variant="outlined" />
                    <Chip label="Własny" size="small" color="info" />
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box display="flex" alignItems="center">
                      <PersonIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {protocol.author}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(protocol.createdAt).toLocaleDateString('pl-PL')}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Kroków: {protocol.steps?.length || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {getFilteredProtocols(userProtocols).length === 0 && (
            <Grid item xs={12}>
              <Alert severity="info">
                {categoryFilter === 'all' 
                  ? 'Nie masz jeszcze własnych protokołów.'
                  : `Nie masz własnych protokołów w kategorii "${categoryFilter}".`
                }
                <Button 
                  variant="text" 
                  size="small" 
                  onClick={() => navigate('/research-schemas/create')}
                  sx={{ ml: 1 }}
                >
                  Utwórz nowy protokół
                </Button>
              </Alert>
            </Grid>
          )}
        </Grid>
      )}

      {selectedProtocol && (
        <Paper sx={{ mt: 3, p: 2, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle1" gutterBottom>
            Wybrany protokół: {selectedProtocol.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedProtocol.description}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Kroki do wykonania:
          </Typography>
          <List dense>
            {selectedProtocol.steps?.map((step: any, index: number) => (
              <ListItem key={step.id}>
                <ListItemText
                  primary={`${index + 1}. ${step.title}`}
                  secondary={step.description}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );

  const renderDataCollectionPlan = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Plan zbierania danych
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Zdefiniuj jakie dane będą zbierane w każdym kroku protokołu.
      </Typography>

      {studyData.dataCollectionPlan?.map((step, index) => (
        <Card key={step.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Krok {step.stepNumber}: {step.stepName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {step.description}
            </Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle2">
                Punkty danych ({step.dataPoints.length})
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleAddDataPoint(step.id)}
              >
                Dodaj punkt danych
              </Button>
            </Box>

            {step.dataPoints.length > 0 ? (
              <List>
                {step.dataPoints.map((dataPoint) => (
                  <ListItem key={dataPoint.id} divider>
                    <ListItemText
                      primary={dataPoint.name}
                      secondary={`${dataPoint.dataType} | ${dataPoint.unit || 'bez jednostki'}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton size="small" onClick={() => handleEditDataPoint(step.id, dataPoint)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteDataPoint(step.id, dataPoint.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="info">
                Nie zdefiniowano punktów danych dla tego kroku.
              </Alert>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderSettings = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ustawienia badania
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Ustawienia próbek
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Min próbek"
                    value={studyData.settings?.sampleSettings.minSamples}
                    onChange={(e) => setStudyData(prev => ({
                      ...prev,
                      settings: {
                        ...prev.settings!,
                        sampleSettings: {
                          ...prev.settings!.sampleSettings,
                          minSamples: parseInt(e.target.value) || 1
                        }
                      }
                    }))}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Max próbek"
                    value={studyData.settings?.sampleSettings.maxSamples}
                    onChange={(e) => setStudyData(prev => ({
                      ...prev,
                      settings: {
                        ...prev.settings!,
                        sampleSettings: {
                          ...prev.settings!.sampleSettings,
                          maxSamples: parseInt(e.target.value) || 1
                        }
                      }
                    }))}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Domyślnie"
                    value={studyData.settings?.sampleSettings.defaultSamples}
                    onChange={(e) => setStudyData(prev => ({
                      ...prev,
                      settings: {
                        ...prev.settings!,
                        sampleSettings: {
                          ...prev.settings!.sampleSettings,
                          defaultSamples: parseInt(e.target.value) || 1
                        }
                      }
                    }))}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Ustawienia walidacji
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={studyData.settings?.validationSettings.requireAllSteps}
                    onChange={(e) => setStudyData(prev => ({
                      ...prev,
                      settings: {
                        ...prev.settings!,
                        validationSettings: {
                          ...prev.settings!.validationSettings,
                          requireAllSteps: e.target.checked
                        }
                      }
                    }))}
                  />
                }
                label="Wymagaj wszystkich kroków"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={studyData.settings?.validationSettings.requireApproval}
                    onChange={(e) => setStudyData(prev => ({
                      ...prev,
                      settings: {
                        ...prev.settings!,
                        validationSettings: {
                          ...prev.settings!.validationSettings,
                          requireApproval: e.target.checked
                        }
                      }
                    }))}
                  />
                }
                label="Wymagaj zatwierdzenia"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderSummary = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Podsumowanie badania
      </Typography>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">{studyData.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {studyData.description}
          </Typography>
          <Chip label={studyData.category} color="primary" size="small" />
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Protokół: {studyData.protocolName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kroków do wykonania: {studyData.dataCollectionPlan?.length || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Punktów danych: {studyData.dataCollectionPlan?.reduce((sum, step) => sum + step.dataPoints.length, 0) || 0}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0: return renderBasicInfo();
      case 1: return renderProtocolSelection();
      case 2: return renderDataCollectionPlan();
      case 3: return <Typography>Parametry badania - TODO</Typography>;
      case 4: return renderSettings();
      case 5: return renderSummary();
      default: return 'Unknown step';
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 0: return studyData.name && studyData.name.length > 0;
      case 1: return selectedProtocol !== null;
      case 2: return true; // Optional step
      case 3: return true; // Optional step
      case 4: return true; // Optional step
      case 5: return true;
      default: return false;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/studies')} sx={{ mr: 1 }}>
          <BackIcon />
        </IconButton>
        <ScienceIcon sx={{ mr: 1, fontSize: 28 }} />
        <Typography variant="h4">
          Utwórz nowe badanie
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3 }}>
            {getStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Wstecz
              </Button>
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSaveStudy}
                    startIcon={<SaveIcon />}
                  >
                    Zapisz badanie
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!isStepValid(activeStep)}
                  >
                    Dalej
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Data Point Dialog */}
      <DataPointDialog
        open={dataPointDialog}
        dataPoint={editingDataPoint}
        onSave={handleSaveDataPoint}
        onClose={() => setDataPointDialog(false)}
      />
    </Box>
  );
};

// Data Point Dialog Component
interface DataPointDialogProps {
  open: boolean;
  dataPoint: DataPoint | null;
  onSave: (dataPoint: DataPoint) => void;
  onClose: () => void;
}

const DataPointDialog: React.FC<DataPointDialogProps> = ({ open, dataPoint, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<DataPoint>>({
    name: '',
    description: '',
    parameterType: 'measurement',
    dataType: 'number',
    unit: '',
    isCalculated: false,
    validation: {
      required: true,
      min: undefined,
      max: undefined
    }
  });

  useEffect(() => {
    if (dataPoint) {
      setFormData(dataPoint);
    } else {
      setFormData({
        name: '',
        description: '',
        parameterType: 'measurement',
        dataType: 'number',
        unit: '',
        isCalculated: false,
        validation: {
          required: true,
          min: undefined,
          max: undefined
        }
      });
    }
  }, [dataPoint, open]);

  const handleSave = () => {
    if (formData.name && formData.description) {
      onSave(formData as DataPoint);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {dataPoint ? 'Edytuj punkt danych' : 'Dodaj punkt danych'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nazwa"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Opis"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={2}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Typ parametru</InputLabel>
              <Select
                value={formData.parameterType}
                onChange={(e) => setFormData(prev => ({ ...prev, parameterType: e.target.value as any }))}
              >
                <MenuItem value="measurement">Pomiar</MenuItem>
                <MenuItem value="observation">Obserwacja</MenuItem>
                <MenuItem value="calculation">Obliczenie</MenuItem>
                <MenuItem value="condition">Warunek</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Typ danych</InputLabel>
              <Select
                value={formData.dataType}
                onChange={(e) => setFormData(prev => ({ ...prev, dataType: e.target.value as any }))}
              >
                <MenuItem value="number">Liczba</MenuItem>
                <MenuItem value="text">Tekst</MenuItem>
                <MenuItem value="boolean">Tak/Nie</MenuItem>
                <MenuItem value="date">Data</MenuItem>
                <MenuItem value="file">Plik</MenuItem>
                <MenuItem value="selection">Wybór</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Jednostka"
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
              placeholder="np. MPa, °C, s"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isCalculated}
                  onChange={(e) => setFormData(prev => ({ ...prev, isCalculated: e.target.checked }))}
                />
              }
              label="Wartość obliczana automatycznie"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button onClick={handleSave} variant="contained">
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateStudy;

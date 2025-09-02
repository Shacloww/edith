import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Science as ScienceIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { predefinedProtocolsApi } from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface Protocol {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedDuration: string;
  difficulty: string;
}

const PredefinedProtocols: React.FC = () => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProtocol, setSelectedProtocol] = useState<any | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadPredefinedProtocols();
  }, []);

  const loadPredefinedProtocols = async () => {
    try {
      setLoading(true);
      const response = await predefinedProtocolsApi.getAll();
      if (response.success && response.data) {
        setProtocols(response.data);
      } else {
        toast.error('Nie udało się załadować predefiniowanych protokołów');
      }
    } catch (error) {
      console.error('Error loading predefined protocols:', error);
      toast.error('Błąd podczas ładowania protokołów');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFromTemplate = async (protocolId: string) => {
    // Przekieruj do edytora protokołów z ID szablonu
    navigate(`/create-protocol?templateId=${protocolId}`);
    toast.success('Przekierowywanie do edytora...');
  };

  const handlePreviewProtocol = async (protocol: Protocol) => {
    try {
      const response = await predefinedProtocolsApi.getById(protocol.id);
      if (response.success && response.data) {
        setSelectedProtocol(response.data);
        setPreviewOpen(true);
      } else {
        toast.error('Nie udało się załadować szczegółów protokołu');
      }
    } catch (error) {
      console.error('Error loading protocol details:', error);
      toast.error('Błąd podczas ładowania protokołu');
    }
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' } = {
      'physical': 'primary',
      'chemical': 'secondary',
      'thermal': 'error',
      'mechanical': 'warning',
      'fire': 'error',
      'weathering': 'info',
      'rheological': 'success',
      // Dodaj polskie kategorie
      'Fizyczne': 'primary',
      'Chemiczne': 'secondary',
      'Termiczne': 'error',
      'Mechaniczne': 'warning',
      'Ognioodporność': 'error',
      'Starzenie pogodowe': 'info',
      'Reologiczne': 'success',
      'Udarność': 'warning',
      'Wymiarowe': 'info',
      'Optyczne': 'primary',
      'Elektryczne': 'secondary'
    };
    return colorMap[category] || 'default' as any;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colorMap: { [key: string]: 'success' | 'warning' | 'error' } = {
      'basic': 'success',
      'intermediate': 'warning',
      'advanced': 'error',
      // Dodaj polskie poziomy trudności
      'Podstawowy': 'success',
      'Średniozaawansowany': 'warning',
      'Zaawansowany': 'error',
      'Ekspercki': 'error'
    };
    return colorMap[difficulty] || 'default' as any;
  };

  const translateCategory = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      'mechanical': 'Mechaniczne',
      'thermal': 'Termiczne',
      'rheological': 'Reologiczne',
      'chemical': 'Chemiczne',
      'physical': 'Fizyczne',
      'electrical': 'Elektryczne',
      'impact': 'Udarność',
      'fire': 'Ognioodporność',
      'weathering': 'Starzenie pogodowe',
      'dimensional': 'Wymiarowe',
      'optical': 'Optyczne'
    };
    return categoryMap[category] || category;
  };

  const translateDifficulty = (difficulty: string): string => {
    const difficultyMap: { [key: string]: string } = {
      'basic': 'Podstawowy',
      'intermediate': 'Średniozaawansowany',
      'advanced': 'Zaawansowany',
      'expert': 'Ekspercki'
    };
    return difficultyMap[difficulty] || difficulty;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <ScienceIcon sx={{ mr: 1, fontSize: 28 }} />
        <Typography variant="h4" component="h1">
          Predefiniowane Protokoły ISO/ASTM
        </Typography>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Wybierz jeden z gotowych protokołów badawczych opartych na standardach międzynarodowych 
        i dostosuj go do swoich potrzeb. Po kliknięciu "Edytuj" protokół zostanie skopiowany 
        do Twoich protokołów i będziesz mógł go modyfikować.
      </Typography>

      <Grid container spacing={3}>
        {protocols.map((protocol) => (
          <Grid item xs={12} sm={6} md={4} key={protocol.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease-in-out'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {protocol.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {protocol.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={translateCategory(protocol.category)}
                    color={getCategoryColor(protocol.category)}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={translateDifficulty(protocol.difficulty)}
                    color={getDifficultyColor(protocol.difficulty)}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Czas trwania: {protocol.estimatedDuration}
                </Typography>
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={() => handlePreviewProtocol(protocol)}
                >
                  Podgląd
                </Button>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  variant="contained"
                  onClick={() => handleCreateFromTemplate(protocol.id)}
                >
                  Edytuj
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {protocols.length === 0 && !loading && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Brak dostępnych protokołów. Sprawdź połączenie z serwerem.
        </Alert>
      )}

      {/* Dialog podglądu */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <ScienceIcon sx={{ mr: 1 }} />
              <Box>
                <Typography variant="h6" component="div">
                  {selectedProtocol?.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Szczegółowy podgląd protokołu badawczego
                </Typography>
              </Box>
            </Box>
            <Box>
              {selectedProtocol && (
                <>
                  <Chip
                    label={translateCategory(selectedProtocol.category)}
                    color={getCategoryColor(selectedProtocol.category)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={translateDifficulty(selectedProtocol.difficulty)}
                    color={getDifficultyColor(selectedProtocol.difficulty)}
                    size="small"
                  />
                </>
              )}
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedProtocol && (
            <Box>
              {/* Podstawowe informacje */}
              <Typography variant="h6" gutterBottom>
                Informacje podstawowe
              </Typography>
              <Box sx={{ mb: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Typography variant="body2">
                  <strong>Kategoria:</strong> {translateCategory(selectedProtocol.category)}
                </Typography>
                <Typography variant="body2">
                  <strong>Poziom trudności:</strong> {translateDifficulty(selectedProtocol.difficulty)}
                </Typography>
                <Typography variant="body2">
                  <strong>Czas trwania:</strong> {selectedProtocol.estimatedDuration}
                </Typography>
                <Typography variant="body2">
                  <strong>Standardy:</strong> {selectedProtocol.standards?.join(', ') || 'Nie podano'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Przegląd */}
              <Typography variant="h6" gutterBottom>
                Przegląd
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Cel:</strong> {selectedProtocol.overview?.purpose}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Zakres:</strong> {selectedProtocol.overview?.scope}
              </Typography>
              {selectedProtocol.overview?.applications && (
                <Typography variant="body2" paragraph>
                  <strong>Zastosowania:</strong> {selectedProtocol.overview.applications}
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />

              {/* Warunki testowe */}
              {selectedProtocol.testConditions && Object.keys(selectedProtocol.testConditions).length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Warunki testowe
                  </Typography>
                  <Box sx={{ mb: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 1 }}>
                    {selectedProtocol.testConditions.temperature && (
                      <Typography variant="body2">
                        <strong>Temperatura:</strong> {selectedProtocol.testConditions.temperature}
                      </Typography>
                    )}
                    {selectedProtocol.testConditions.humidity && (
                      <Typography variant="body2">
                        <strong>Wilgotność:</strong> {selectedProtocol.testConditions.humidity}
                      </Typography>
                    )}
                    {selectedProtocol.testConditions.atmosphere && (
                      <Typography variant="body2">
                        <strong>Atmosfera:</strong> {selectedProtocol.testConditions.atmosphere}
                      </Typography>
                    )}
                    {selectedProtocol.testConditions.pressure && (
                      <Typography variant="body2">
                        <strong>Ciśnienie:</strong> {selectedProtocol.testConditions.pressure}
                      </Typography>
                    )}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              {/* Sprzęt */}
              {selectedProtocol.equipment?.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Wyposażenie
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {selectedProtocol.equipment.map((item: any, index: number) => (
                      <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                        • <strong>{item.name || item}:</strong> {item.description || item.specifications || ''}
                      </Typography>
                    ))}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </>
              )}
              
              {/* Materiały */}
              {selectedProtocol.materials?.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Materiały i odczynniki
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {selectedProtocol.materials.map((material: any, index: number) => (
                      <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                        • <strong>{typeof material === 'string' ? material : material.name}:</strong> {
                          typeof material === 'object' ? (material.grade || material.purity || '') : ''
                        }
                      </Typography>
                    ))}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              {/* Zasady bezpieczeństwa */}
              {selectedProtocol.safetyGuidelines?.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom color="error">
                    Zasady bezpieczeństwa
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {selectedProtocol.safetyGuidelines.map((guideline: any, index: number) => (
                      <Typography key={index} variant="body2" sx={{ mb: 1 }} color="error.main">
                        ⚠️ {typeof guideline === 'string' ? guideline : guideline.guideline}
                      </Typography>
                    ))}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              {/* Kroki procedury */}
              <Typography variant="h6" gutterBottom>
                Procedura ({selectedProtocol.steps?.length || 0} kroków)
              </Typography>
              {selectedProtocol.steps?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  {selectedProtocol.steps.map((step: any, index: number) => (
                    <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Krok {index + 1}: {step.title}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {step.description}
                      </Typography>
                      {step.expectedTime && (
                        <Typography variant="caption" color="text.secondary">
                          Czas: {step.expectedTime}
                        </Typography>
                      )}
                      {step.safety?.length > 0 && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: 'warning.50', borderRadius: 1 }}>
                          <Typography variant="caption" color="warning.main" fontWeight="bold">
                            ⚠️ Bezpieczeństwo:
                          </Typography>
                          {step.safety.map((safety: string, safetyIndex: number) => (
                            <Typography key={safetyIndex} variant="caption" display="block" color="warning.main">
                              • {safety}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {/* Obliczenia */}
              {selectedProtocol.calculations?.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Obliczenia i wzory
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {selectedProtocol.calculations.map((calc: any, index: number) => (
                      <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          {calc.name}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {calc.description}
                        </Typography>
                        <Typography variant="body2" fontFamily="monospace" sx={{ bgcolor: 'white', p: 1, borderRadius: 1 }}>
                          {calc.formula}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}

              {/* Kryteria akceptacji */}
              {selectedProtocol.acceptanceCriteria?.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom color="success.main">
                    Kryteria akceptacji
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {selectedProtocol.acceptanceCriteria.map((criterion: string, index: number) => (
                      <Typography key={index} variant="body2" sx={{ mb: 1 }} color="success.main">
                        ✓ {criterion}
                      </Typography>
                    ))}
                  </Box>
                </>
              )}

              {/* Typowe problemy */}
              {selectedProtocol.commonIssues?.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom color="warning.main">
                    Typowe problemy i rozwiązania
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {selectedProtocol.commonIssues.map((issue: any, index: number) => (
                      <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1, border: '1px solid', borderColor: 'warning.200' }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="warning.main">
                          Problem: {issue.issue}
                        </Typography>
                        <Typography variant="body2" color="warning.main">
                          <strong>Rozwiązanie:</strong> {issue.solution}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}

              {/* Bibliografia */}
              {selectedProtocol.references?.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Bibliografia
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {selectedProtocol.references.map((reference: any, index: number) => (
                      <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                        [{index + 1}] {typeof reference === 'string' ? reference : `${reference.title} - ${reference.authors} (${reference.year})`}
                      </Typography>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>
            Zamknij
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => {
              setPreviewOpen(false);
              if (selectedProtocol) {
                handleCreateFromTemplate(selectedProtocol.id);
              }
            }}
          >
            Skopiuj do moich protokołów
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PredefinedProtocols;

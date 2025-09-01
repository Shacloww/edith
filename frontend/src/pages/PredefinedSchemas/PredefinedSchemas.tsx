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
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  GetApp as GetAppIcon,
  Science as ScienceIcon
} from '@mui/icons-material';
import { predefinedSchemasApi } from '../../services/api';
import { CreateResearchSchemaForm, ResearchSchema } from '../../types';
import toast from 'react-hot-toast';

const PredefinedSchemas: React.FC = () => {
  const [schemas, setSchemas] = useState<CreateResearchSchemaForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [importingAll, setImportingAll] = useState(false);
  const [importingIndex, setImportingIndex] = useState<number | null>(null);
  const [selectedSchema, setSelectedSchema] = useState<CreateResearchSchemaForm | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    loadPredefinedSchemas();
  }, []);

  const loadPredefinedSchemas = async () => {
    try {
      setLoading(true);
      const response = await predefinedSchemasApi.getAll();
      if (response.success && response.data) {
        setSchemas(response.data);
      } else {
        toast.error('Nie udało się załadować predefiniowanych schematów');
      }
    } catch (error) {
      console.error('Error loading predefined schemas:', error);
      toast.error('Błąd podczas ładowania schematów');
    } finally {
      setLoading(false);
    }
  };

  const handleImportSchema = async (index: number) => {
    try {
      setImportingIndex(index);
      const response = await predefinedSchemasApi.importSchema(index);
      if (response.success) {
        toast.success('Schemat został pomyślnie zaimportowany!');
      } else {
        toast.error(response.error || 'Nie udało się zaimportować schematu');
      }
    } catch (error) {
      console.error('Error importing schema:', error);
      toast.error('Błąd podczas importowania schematu');
    } finally {
      setImportingIndex(null);
    }
  };

  const handleImportAll = async () => {
    try {
      setImportingAll(true);
      const response = await predefinedSchemasApi.importAll();
      if (response.success && response.data) {
        const { importedCount, skippedCount, totalProcessed } = response.data;
        toast.success(
          `Zaimportowano ${importedCount} z ${totalProcessed} schematów. Pominięto: ${skippedCount}`
        );
      } else {
        toast.error('Nie udało się zaimportować schematów');
      }
    } catch (error) {
      console.error('Error importing all schemas:', error);
      toast.error('Błąd podczas importowania schematów');
    } finally {
      setImportingAll(false);
    }
  };

  const handlePreviewSchema = (schema: CreateResearchSchemaForm) => {
    setSelectedSchema(schema);
    setPreviewOpen(true);
  };

  const getSchemaCategory = (title: string): string => {
    if (title.includes('ISO')) return 'ISO';
    if (title.includes('ASTM')) return 'ASTM';
    if (title.includes('Finat')) return 'Finat';
    if (title.includes('UL')) return 'UL';
    return 'Standard';
  };

  const getCategoryColor = (category: string): "primary" | "secondary" | "info" | "success" | "warning" => {
    switch (category) {
      case 'ISO': return 'primary';
      case 'ASTM': return 'secondary';
      case 'Finat': return 'info';
      case 'UL': return 'warning';
      default: return 'success';
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            <ScienceIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Predefiniowane Schematy Badawcze
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Biblioteka standardowych schematów badawczych zgodnych z normami ISO, ASTM, Finat i UL
          </Typography>
        </Box>
        
        <Tooltip title="Importuj wszystkie schematy">
          <Fab
            color="primary"
            onClick={handleImportAll}
            disabled={importingAll}
            sx={{ position: 'relative' }}
          >
            {importingAll ? <CircularProgress size={24} color="inherit" /> : <GetAppIcon />}
          </Fab>
        </Tooltip>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Te schematy zawierają profesjonalne procedury badawcze zgodne z międzynarodowymi standardami. 
        Każdy schemat zawiera szczegółowe instrukcje przeprowadzania badań oraz wszystkie wymagane pola.
      </Alert>

      <Grid container spacing={3}>
        {schemas.map((schema, index) => {
          const category = getSchemaCategory(schema.title);
          return (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip 
                      label={category} 
                      color={getCategoryColor(category)}
                      size="small"
                    />
                    <Chip 
                      label={`${schema.questions.length} pytań`} 
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                    {schema.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {schema.description}
                  </Typography>

                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Zawiera pola: temperatura, materiał, procedura, wyniki
                    </Typography>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handlePreviewSchema(schema)}
                  >
                    Podgląd
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleImportSchema(index)}
                    disabled={importingIndex === index}
                    sx={{ ml: 'auto' }}
                  >
                    {importingIndex === index ? <CircularProgress size={16} /> : 'Importuj'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Dialog podglądu schematu */}
      <Dialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedSchema?.title}
          <Chip 
            label={getSchemaCategory(selectedSchema?.title || '')} 
            color={getCategoryColor(getSchemaCategory(selectedSchema?.title || ''))}
            size="small"
            sx={{ ml: 2 }}
          />
        </DialogTitle>
        
        <DialogContent dividers>
          <Typography variant="body1" paragraph>
            {selectedSchema?.description}
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Pytania badawcze ({selectedSchema?.questions.length}):
          </Typography>
          
          <List dense>
            {selectedSchema?.questions.map((question, index) => (
              <React.Fragment key={question.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">
                          {index + 1}. {question.title}
                        </Typography>
                        {question.required && (
                          <Chip label="Wymagane" size="small" color="error" variant="outlined" />
                        )}
                        <Chip label={question.type} size="small" variant="outlined" />
                      </Box>
                    }
                    secondary={
                      <>
                        {question.description && (
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {question.description}
                          </Typography>
                        )}
                        {question.options && question.options.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" display="block">Opcje:</Typography>
                            {question.options.map((option, optIndex) => {
                              const optionLabel = typeof option === 'string' ? option : (option as any).label;
                              return (
                                <Typography key={optIndex} variant="caption" display="block" sx={{ ml: 2 }}>
                                  • {optionLabel}
                                </Typography>
                              );
                            })}
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {index < (selectedSchema?.questions.length || 0) - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>
            Zamknij
          </Button>
          <Button 
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => {
              const index = schemas.findIndex(s => s.title === selectedSchema?.title);
              if (index !== -1) {
                handleImportSchema(index);
                setPreviewOpen(false);
              }
            }}
          >
            Importuj ten schemat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PredefinedSchemas;

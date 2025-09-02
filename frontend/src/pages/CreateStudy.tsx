import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Grid,
  Chip
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useStudies, usePredefinedProtocols } from '../hooks';

const CreateStudy: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    protocolId: '',
    category: ''
  });
  const [selectedProtocol, setSelectedProtocol] = useState<any>(null);

  const { createStudy, isLoading: createLoading, error: createError } = useStudies();
  const {
    protocols: predefinedProtocols,
    protocol: protocolDetails,
    isLoading: protocolsLoading,
    error: protocolsError,
    fetchPredefinedProtocols,
    fetchPredefinedProtocol
  } = usePredefinedProtocols();

  useEffect(() => {
    fetchPredefinedProtocols();
  }, [fetchPredefinedProtocols]);

  useEffect(() => {
    if (formData.protocolId) {
      fetchPredefinedProtocol(formData.protocolId);
    }
  }, [formData.protocolId, fetchPredefinedProtocol]);

  useEffect(() => {
    if (protocolDetails) {
      setSelectedProtocol(protocolDetails);
    }
  }, [protocolDetails]);

  const handleChange = (field: string) => (event: any) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.name || !formData.protocolId) {
      return;
    }

    const success = await createStudy({
      name: formData.name,
      description: formData.description,
      protocolId: formData.protocolId,
      category: formData.category || selectedProtocol?.category
    });

    if (success) {
      navigate('/dashboard');
    }
  };

  const isFormValid = formData.name.trim() && formData.protocolId;

  if (protocolsLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mr: 2 }}
        >
          Powrót
        </Button>
        <Typography variant="h4" component="h1">
          Utwórz Nowe Badanie
        </Typography>
      </Box>

      {(createError || protocolsError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {createError || protocolsError}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informacje o Badaniu
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nazwa badania"
                  value={formData.name}
                  onChange={handleChange('name')}
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Opis"
                  value={formData.description}
                  onChange={handleChange('description')}
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Protokół badawczy *</InputLabel>
                  <Select
                    value={formData.protocolId}
                    label="Protokół badawczy *"
                    onChange={handleChange('protocolId')}
                    required
                  >
                    {predefinedProtocols.map((protocol) => (
                      <MenuItem key={protocol.id} value={protocol.id}>
                        {protocol.title} - {protocol.standard}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Kategoria"
                  value={formData.category}
                  onChange={handleChange('category')}
                  placeholder={selectedProtocol?.category || ''}
                  sx={{ mb: 3 }}
                />

                <Box display="flex" gap={2}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => navigate('/dashboard')}
                  >
                    Anuluj
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!isFormValid || createLoading}
                  >
                    {createLoading ? <CircularProgress size={24} /> : 'Utwórz Badanie'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {selectedProtocol && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Podgląd Protokołu
                </Typography>
                
                <Typography variant="subtitle1" gutterBottom>
                  {selectedProtocol.title}
                </Typography>
                
                <Box display="flex" gap={1} mb={2}>
                  <Chip label={selectedProtocol.standard} size="small" />
                  <Chip label={selectedProtocol.category} variant="outlined" size="small" />
                  <Chip label={selectedProtocol.difficulty} color="info" size="small" />
                </Box>

                <Typography variant="body2" color="textSecondary" paragraph>
                  {selectedProtocol.description}
                </Typography>

                <Typography variant="body2" paragraph>
                  <strong>Cel:</strong> {selectedProtocol.overview?.purpose}
                </Typography>

                <Typography variant="body2" paragraph>
                  <strong>Szacowany czas:</strong> {selectedProtocol.estimatedDuration}
                </Typography>

                {selectedProtocol.equipment && selectedProtocol.equipment.length > 0 && (
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      <strong>Wymagane wyposażenie:</strong>
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {selectedProtocol.equipment.slice(0, 3).map((item: any, index: number) => (
                        <li key={index}>
                          <Typography variant="body2" component="span">
                            {item.name}
                          </Typography>
                        </li>
                      ))}
                      {selectedProtocol.equipment.length > 3 && (
                        <li>
                          <Typography variant="body2" component="span" color="textSecondary">
                            ... i {selectedProtocol.equipment.length - 3} więcej
                          </Typography>
                        </li>
                      )}
                    </ul>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateStudy;
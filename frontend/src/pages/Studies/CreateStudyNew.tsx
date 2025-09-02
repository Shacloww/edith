import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStudies, usePredefinedProtocols } from '../../hooks';
import { CreateStudyRequest } from '../../hooks/useStudies';

const CreateStudy: React.FC = () => {
  const navigate = useNavigate();
  const { createStudy, isLoading: studyLoading } = useStudies();
  const { protocols: predefinedProtocols, fetchPredefinedProtocols, isLoading: protocolsLoading } = usePredefinedProtocols();
  
  const [formData, setFormData] = useState<CreateStudyRequest>({
    name: '',
    description: '',
    protocolId: '',
    category: '',
    settings: {},
    parameters: {}
  });
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPredefinedProtocols();
  }, [fetchPredefinedProtocols]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const study = await createStudy(formData);
      if (study) {
        navigate('/studies');
      }
    } catch (err) {
      setError('Błąd podczas tworzenia badania');
    }
  };

  const handleInputChange = (field: keyof CreateStudyRequest) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSelectChange = (field: keyof CreateStudyRequest) => (
    e: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  if (protocolsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Nowe badanie
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nazwa badania"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  required
                  placeholder="np. Badanie wytrzymałości PE-HD"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Opis badania"
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  multiline
                  rows={3}
                  placeholder="Opisz cel i zakres badania..."
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Protokół badania</InputLabel>
                  <Select
                    value={formData.protocolId}
                    onChange={handleSelectChange('protocolId')}
                    label="Protokół badania"
                  >
                    {predefinedProtocols.map((protocol) => (
                      <MenuItem key={protocol.id} value={protocol.id}>
                        {protocol.title} - {protocol.standard}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Kategoria</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={handleSelectChange('category')}
                    label="Kategoria"
                  >
                    <MenuItem value="mechanical">Mechaniczne</MenuItem>
                    <MenuItem value="thermal">Termiczne</MenuItem>
                    <MenuItem value="chemical">Chemiczne</MenuItem>
                    <MenuItem value="physical">Fizyczne</MenuItem>
                    <MenuItem value="electrical">Elektryczne</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/studies')}
                  >
                    Anuluj
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={studyLoading || !formData.name || !formData.protocolId}
                  >
                    {studyLoading ? <CircularProgress size={20} /> : 'Utwórz badanie'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateStudy;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  ArrowBack,
  Refresh,
  People,
  Assessment
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

const StudyStatistics = () => {
  const { id: studyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Symulacja ładowania danych
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleBack = () => {
    navigate(`/studies/${studyId}`);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Dane odświeżone');
    }, 1000);
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Ładowanie statystyk...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button onClick={handleRefresh} variant="contained" startIcon={<Refresh />}>
          Spróbuj ponownie
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={handleBack} size="large">
          <ArrowBack />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Statystyki badania
          </Typography>
          <Typography variant="h6" color="text.secondary">
            ID: {studyId}
          </Typography>
        </Box>
        <Button
          onClick={handleRefresh}
          startIcon={<Refresh />}
          variant="outlined"
        >
          Odśwież
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <People color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h4" component="div">
                    0
                  </Typography>
                  <Typography color="text.secondary">
                    Odpowiedzi
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Assessment color="success" fontSize="large" />
                <Box>
                  <Typography variant="h4" component="div">
                    0%
                  </Typography>
                  <Typography color="text.secondary">
                    Ukończenie
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Assessment color="info" fontSize="large" />
                <Box>
                  <Typography variant="h4" component="div">
                    0
                  </Typography>
                  <Typography color="text.secondary">
                    Śr. czas (min)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <People color="warning" fontSize="large" />
                <Box>
                  <Typography variant="h4" component="div">
                    0
                  </Typography>
                  <Typography color="text.secondary">
                    Pytania
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* No data message */}
      <Alert severity="info">
        To badanie nie ma jeszcze żadnych odpowiedzi. 
        Statystyki będą dostępne po otrzymaniu pierwszych odpowiedzi.
      </Alert>
    </Box>
  );
};

export default StudyStatistics;
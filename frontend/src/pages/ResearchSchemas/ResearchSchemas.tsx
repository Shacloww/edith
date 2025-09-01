import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ResearchSchemas: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Schematy badawcze
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/schemas/create')}
        >
          Nowy schemat
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lista schematów badawczych
          </Typography>
          <Typography color="text.secondary">
            Tutaj będą wyświetlane wszystkie utworzone schematy badawcze.
            Funkcjonalność w trakcie implementacji.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResearchSchemas;

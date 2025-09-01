import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Studies: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Badania
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/studies/create')}
        >
          Nowe badanie
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography color="text.secondary">
            Lista badań - w trakcie implementacji.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Studies;

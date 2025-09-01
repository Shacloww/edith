import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const CreateResearchSchema: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Utwórz nowy schemat badawczy
      </Typography>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Kreator schematu badawczego
          </Typography>
          <Typography color="text.secondary">
            Tutaj będzie formularz do tworzenia nowego schematu badawczego.
            Funkcjonalność w trakcie implementacji.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateResearchSchema;

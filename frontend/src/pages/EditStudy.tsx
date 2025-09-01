import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const EditStudy: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Edytuj badanie
      </Typography>
      <Card>
        <CardContent>
          <Typography color="text.secondary">
            Edycja badania - w trakcie implementacji.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditStudy;

import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const EditResearchSchema: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Edytuj schemat badawczy
      </Typography>
      
      <Card>
        <CardContent>
          <Typography color="text.secondary">
            Edycja schematu badawczego - w trakcie implementacji.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditResearchSchema;

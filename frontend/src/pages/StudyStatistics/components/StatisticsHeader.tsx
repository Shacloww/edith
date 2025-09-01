import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Refresh,
  Download,
  Share,
  Print
} from '@mui/icons-material';
import { Study } from '../../../types';

interface StatisticsHeaderProps {
  study: Study;
  onBack: () => void;
  onRefresh: () => void;
  onExport: (format: 'csv' | 'xlsx' | 'pdf') => void;
  loading?: boolean;
}

export const StatisticsHeader: React.FC<StatisticsHeaderProps> = ({
  study,
  onBack,
  onRefresh,
  onExport,
  loading = false
}) => {
  const handleExportClick = (format: 'csv' | 'xlsx' | 'pdf') => {
    onExport(format);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'COMPLETED': return 'info';
      case 'PAUSED': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Aktywne';
      case 'COMPLETED': return 'Zakończone';
      case 'PAUSED': return 'Wstrzymane';
      case 'DRAFT': return 'Szkic';
      default: return status;
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Główny nagłówek */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
        <IconButton 
          onClick={onBack} 
          size="large"
          sx={{ mt: 0.5 }}
        >
          <ArrowBack />
        </IconButton>
        
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="h4" component="h1">
              Statystyki badania
            </Typography>
            <Chip
              label={getStatusLabel(study.status)}
              color={getStatusColor(study.status) as any}
              variant="outlined"
              size="small"
            />
          </Box>
          
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {study.title}
          </Typography>
          
          {study.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {study.description}
            </Typography>
          )}
        </Box>

        {/* Akcje */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Tooltip title="Odśwież dane">
            <IconButton 
              onClick={onRefresh}
              disabled={loading}
              color="primary"
            >
              <Refresh />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Udostępnij">
            <IconButton color="primary">
              <Share />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Drukuj">
            <IconButton color="primary">
              <Print />
            </IconButton>
          </Tooltip>
          
          <Button
            onClick={() => handleExportClick('xlsx')}
            startIcon={<Download />}
            variant="contained"
            size="small"
            disabled={loading}
          >
            Eksportuj
          </Button>
        </Box>
      </Box>

      {/* Meta informacje */}
      <Box sx={{ 
        display: 'flex', 
        gap: 4, 
        flexWrap: 'wrap',
        p: 2,
        bgcolor: 'grey.50',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'grey.200'
      }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Data utworzenia
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {new Date(study.createdAt).toLocaleDateString('pl-PL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="caption" color="text.secondary">
            Ostatnia aktualizacja
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {new Date(study.updatedAt).toLocaleDateString('pl-PL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </Box>
        
        {study.startDate && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Data rozpoczęcia
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {new Date(study.startDate).toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </Box>
        )}
        
        {study.endDate && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Data zakończenia
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {new Date(study.endDate).toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </Box>
        )}
        
        <Box>
          <Typography variant="caption" color="text.secondary">
            Liczba pytań
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {study.researchSchema?.questions?.length || 0}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

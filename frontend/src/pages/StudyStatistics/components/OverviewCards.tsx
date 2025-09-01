import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  Chip,
  Tooltip
} from '@mui/material';
import {
  People,
  Assessment,
  TrendingUp,
  AccessTime,
  QuestionAnswer,
  CheckCircle,
  Cancel,
  Timeline
} from '@mui/icons-material';
import { StatisticsData } from '../types';

interface OverviewCardsProps {
  data: StatisticsData;
  questionsCount: number;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  data,
  questionsCount
}) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}min`;
    return `${Math.round(seconds / 3600)}h`;
  };

  const cards = [
    {
      title: 'Wszystkie odpowiedzi',
      value: data.totalResponses.toLocaleString('pl-PL'),
      icon: People,
      color: 'primary' as const,
      subtitle: 'Łączna liczba uczestników'
    },
    {
      title: 'Wskaźnik ukończenia',
      value: `${Math.round(data.completionRate)}%`,
      icon: CheckCircle,
      color: 'success' as const,
      subtitle: 'Procent ukończonych badań',
      progress: data.completionRate
    },
    {
      title: 'Średni czas',
      value: formatDuration(data.averageTime),
      icon: AccessTime,
      color: 'info' as const,
      subtitle: 'Czas wypełniania badania'
    },
    {
      title: 'Wskaźnik porzucenia',
      value: `${Math.round(data.abandonmentRate)}%`,
      icon: Cancel,
      color: 'warning' as const,
      subtitle: 'Procent porzuconych badań',
      progress: data.abandonmentRate,
      isNegative: true
    },
    {
      title: 'Liczba pytań',
      value: questionsCount.toString(),
      icon: QuestionAnswer,
      color: 'secondary' as const,
      subtitle: 'Pytania w badaniu'
    },
    {
      title: 'Aktywność dzisiaj',
      value: data.responsesByDay[data.responsesByDay.length - 1]?.count.toString() || '0',
      icon: Timeline,
      color: 'primary' as const,
      subtitle: 'Odpowiedzi w ciągu dnia'
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
          <Card 
            sx={{ 
              height: '100%',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: `${card.color}.100`,
                    color: `${card.color}.main`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <card.icon fontSize="medium" />
                </Box>
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant="h4" 
                    component="div" 
                    fontWeight="bold"
                    color={card.isNegative ? 'warning.main' : 'text.primary'}
                    sx={{ lineHeight: 1.2 }}
                  >
                    {card.value}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {card.title}
                  </Typography>
                </Box>
              </Box>

              {/* Progress bar dla wskaźników procentowych */}
              {card.progress !== undefined && (
                <Box sx={{ mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(card.progress, 100)}
                    color={card.isNegative ? 'warning' : card.color}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: 'grey.200'
                    }}
                  />
                </Box>
              )}

              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: '0.75rem' }}
              >
                {card.subtitle}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

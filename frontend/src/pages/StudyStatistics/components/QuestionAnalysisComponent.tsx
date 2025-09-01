import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import {
  ExpandMore,
  Analytics,
  TrendingUp,
  Assessment,
  TextFields,
  Numbers,
  RadioButtonChecked,
  CheckBox
} from '@mui/icons-material';
import { QuestionAnalysis } from '../types';
import { QuestionType } from '../../../types';

interface QuestionAnalysisComponentProps {
  analyses: QuestionAnalysis[];
}

export const QuestionAnalysisComponent: React.FC<QuestionAnalysisComponentProps> = ({
  analyses
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case 'TEXT': return <TextFields />;
      case 'NUMBER': return <Numbers />;
      case 'SCALE': return <TrendingUp />;
      case 'SINGLE_CHOICE': return <RadioButtonChecked />;
      case 'MULTIPLE_CHOICE': return <CheckBox />;
      default: return <Analytics />;
    }
  };

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case 'TEXT': return 'Tekst';
      case 'NUMBER': return 'Liczba';
      case 'SCALE': return 'Skala';
      case 'SINGLE_CHOICE': return 'Wybór jednokrotny';
      case 'MULTIPLE_CHOICE': return 'Wybór wielokrotny';
      case 'DATE': return 'Data';
      default: return type;
    }
  };

  const filteredAnalyses = analyses.filter(analysis => 
    filterType === 'all' || analysis.type === filterType
  );

  const uniqueTypes = [...new Set(analyses.map(a => a.type))];

  if (analyses.length === 0) {
    return (
      <Alert severity="info">
        Brak pytań do analizy w tym badaniu.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Filtry */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filtruj według typu</InputLabel>
          <Select
            value={filterType}
            label="Filtruj według typu"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">Wszystkie typy</MenuItem>
            {uniqueTypes.map(type => (
              <MenuItem key={type} value={type}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getQuestionTypeIcon(type)}
                  {getQuestionTypeLabel(type)}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Typography variant="body2" color="text.secondary">
          {filteredAnalyses.length} z {analyses.length} pytań
        </Typography>
      </Box>

      {/* Lista pytań */}
      {filteredAnalyses.map((analysis, index) => (
        <Accordion
          key={analysis.questionId}
          expanded={expandedPanel === analysis.questionId}
          onChange={handleAccordionChange(analysis.questionId)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls={`question-${analysis.questionId}-content`}
            id={`question-${analysis.questionId}-header`}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              {getQuestionTypeIcon(analysis.type)}
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {analysis.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  <Chip
                    size="small"
                    label={getQuestionTypeLabel(analysis.type)}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    label={`${analysis.totalResponses} odpowiedzi`}
                    color="primary"
                  />
                  <Chip
                    size="small"
                    label={`${analysis.responseRate.toFixed(1)}% wskaźnik odpowiedzi`}
                    color={analysis.responseRate > 80 ? 'success' : analysis.responseRate > 60 ? 'warning' : 'error'}
                  />
                </Box>
              </Box>
            </Box>
          </AccordionSummary>
          
          <AccordionDetails>
            <Grid container spacing={3}>
              {/* Podstawowe statystyki */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Podstawowe statystyki
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Wskaźnik odpowiedzi
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={analysis.responseRate}
                        sx={{ mt: 1, mb: 1 }}
                      />
                      <Typography variant="body2">
                        {analysis.responseRate.toFixed(1)}% ({analysis.totalResponses} odpowiedzi)
                      </Typography>
                    </Box>

                    {/* Statystyki numeryczne */}
                    {analysis.numericStats && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Statystyki numeryczne
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Średnia</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {analysis.numericStats.mean}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Mediana</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {analysis.numericStats.median}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Min / Max</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {analysis.numericStats.min} / {analysis.numericStats.max}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Odch. standardowe</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {analysis.numericStats.standardDeviation}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {/* Statystyki tekstowe */}
                    {analysis.textStats && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Analiza tekstu
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Średnia długość</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {analysis.textStats.averageLength} znaków
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Liczba słów</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {analysis.textStats.wordCount}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Czytelność</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {analysis.textStats.readabilityScore}/100
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Zdania</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {analysis.textStats.sentenceCount}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Rozkład odpowiedzi */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Rozkład odpowiedzi
                    </Typography>
                    
                    {analysis.distribution.length > 0 ? (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Odpowiedź</TableCell>
                              <TableCell align="right">Liczba</TableCell>
                              <TableCell align="right">%</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {analysis.distribution.slice(0, 10).map((item, idx) => (
                              <TableRow key={idx}>
                                <TableCell>
                                  {item.value.length > 30 
                                    ? `${item.value.substring(0, 30)}...` 
                                    : item.value}
                                </TableCell>
                                <TableCell align="right">{item.count}</TableCell>
                                <TableCell align="right">{item.percentage}%</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Brak danych do wyświetlenia
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Najpopularniejsze słowa dla pytań tekstowych */}
              {analysis.textStats?.commonWords && analysis.textStats.commonWords.length > 0 && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Najpopularniejsze słowa
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {analysis.textStats.commonWords.slice(0, 20).map((word, idx) => (
                          <Chip
                            key={idx}
                            label={`${word.word} (${word.count})`}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

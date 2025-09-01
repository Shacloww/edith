import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Refresh,
  TrendingUp,
  Assessment,
  People,
  QuestionAnswer,
  ExpandMore,
  Analytics,
  Timeline,
  ShowChart,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TableChart,
  Functions
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { responsesApi, studiesApi } from '../services/api';
import { StudyStatistics as StudyStatsType, Study, QuestionType, Response } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`statistics-tabpanel-${index}`}
      aria-labelledby={`statistics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface QuestionAnalysis {
  questionId: string;
  title: string;
  type: QuestionType;
  totalResponses: number;
  responseRate: number;
  
  // Statystyki numeryczne
  mean?: number;
  median?: number;
  mode?: string | number;
  standardDeviation?: number;
  variance?: number;
  min?: number;
  max?: number;
  quartiles?: {
    q1: number;
    q2: number;
    q3: number;
  };
  
  // Rozkład odpowiedzi
  distribution: Record<string, number>;
  frequencies: Array<{ value: string; count: number; percentage: number }>;
  
  // Analiza tekstowa
  averageLength?: number;
  wordCount?: number;
  commonWords?: Array<{ word: string; count: number }>;
  
  // Trendy czasowe
  timeSeriesData?: Array<{ date: string; count: number; value?: number }>;
  
  // Surowe odpowiedzi
  rawResponses: Array<{ value: any; timestamp: string; responseId: string }>;
}

interface CorrelationData {
  question1: string;
  question2: string;
  correlation: number;
  pValue?: number;
  significance: 'high' | 'medium' | 'low' | 'none';
}

const StudyStatisticsPage = () => {
  const { id: studyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [study, setStudy] = useState<Study | null>(null);
  const [statistics, setStatistics] = useState<StudyStatsType | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [questionAnalyses, setQuestionAnalyses] = useState<QuestionAnalysis[]>([]);
  const [correlations, setCorrelations] = useState<CorrelationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('all');

  useEffect(() => {
    if (studyId) {
      fetchData();
    }
  }, [studyId]);

  const fetchData = async () => {
    if (!studyId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Pobierz dane badania, statystyki i odpowiedzi równolegle
      const [studyResponse, statsResponse] = await Promise.all([
        studiesApi.getById(studyId),
        responsesApi.getStatistics(studyId)
      ]);

      if (studyResponse.success && studyResponse.data) {
        setStudy(studyResponse.data);
      }

      if (statsResponse.success && statsResponse.data) {
        setStatistics(statsResponse.data);
      }

      // Pobierz szczegółowe odpowiedzi
      try {
        const responsesResponse = await responsesApi.getByStudy(studyId);
        if (responsesResponse.success && responsesResponse.data && studyResponse.data) {
          setResponses(responsesResponse.data.responses);
          await performAdvancedAnalysis(responsesResponse.data.responses, studyResponse.data);
        }
      } catch (error) {
        console.warn('Nie udało się pobrać odpowiedzi:', error);
      }

    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Nie udało się załadować statystyk');
      toast.error('Błąd podczas ładowania statystyk');
    } finally {
      setLoading(false);
    }
  };

  const performAdvancedAnalysis = async (responses: Response[], study: Study) => {
    if (!study.researchSchema?.questions || responses.length === 0) return;

    const analyses: QuestionAnalysis[] = [];
    const correlationData: CorrelationData[] = [];

    // Analizuj każde pytanie
    for (const question of study.researchSchema.questions) {
      const questionResponses = responses
        .map(response => {
          const answer = response.answers.find((a: any) => a.questionId === question.id);
          return answer ? {
            value: answer.value,
            timestamp: response.createdAt,
            responseId: response.id
          } : null;
        })
        .filter(Boolean) as Array<{ value: any; timestamp: string; responseId: string }>;

      const analysis = analyzeQuestion(question, questionResponses);
      analyses.push(analysis);
    }

    // Oblicz korelacje dla pytań numerycznych i skali
    const numericQuestions = analyses.filter(a => 
      a.type === QuestionType.NUMBER || a.type === QuestionType.SCALE
    );

    for (let i = 0; i < numericQuestions.length; i++) {
      for (let j = i + 1; j < numericQuestions.length; j++) {
        const correlation = calculateCorrelation(
          numericQuestions[i],
          numericQuestions[j],
          responses
        );
        if (correlation) {
          correlationData.push(correlation);
        }
      }
    }

    setQuestionAnalyses(analyses);
    setCorrelations(correlationData.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation)));
  };

  const analyzeQuestion = (
    question: any,
    responses: Array<{ value: any; timestamp: string; responseId: string }>
  ): QuestionAnalysis => {
    const analysis: QuestionAnalysis = {
      questionId: question.id,
      title: question.title,
      type: question.type,
      totalResponses: responses.length,
      responseRate: responses.length > 0 ? 100 : 0, // Będzie poprawione z całkowitą liczbą uczestników
      distribution: {},
      frequencies: [],
      rawResponses: responses
    };

    if (responses.length === 0) return analysis;

    // Podstawowy rozkład
    const valueCount: Record<string, number> = {};
    responses.forEach(r => {
      const value = String(r.value || '').trim();
      valueCount[value] = (valueCount[value] || 0) + 1;
    });

    analysis.distribution = valueCount;
    analysis.frequencies = Object.entries(valueCount)
      .map(([value, count]) => ({
        value,
        count,
        percentage: (count / responses.length) * 100
      }))
      .sort((a, b) => b.count - a.count);

    // Analiza specyficzna dla typu pytania
    switch (question.type) {
      case QuestionType.NUMBER:
      case QuestionType.SCALE:
        analyzeNumericQuestion(analysis, responses);
        break;
      case QuestionType.TEXT:
        analyzeTextQuestion(analysis, responses);
        break;
      case QuestionType.SINGLE_CHOICE:
      case QuestionType.MULTIPLE_CHOICE:
        analyzeChoiceQuestion(analysis, responses);
        break;
      case QuestionType.DATE:
        analyzeDateQuestion(analysis, responses);
        break;
    }

    // Analiza czasowa
    analysis.timeSeriesData = generateTimeSeriesData(responses);

    return analysis;
  };

  const analyzeNumericQuestion = (
    analysis: QuestionAnalysis,
    responses: Array<{ value: any; timestamp: string; responseId: string }>
  ) => {
    const numericValues = responses
      .map(r => parseFloat(r.value))
      .filter(v => !isNaN(v))
      .sort((a, b) => a - b);

    if (numericValues.length === 0) return;

    // Podstawowe statystyki
    analysis.mean = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
    analysis.min = Math.min(...numericValues);
    analysis.max = Math.max(...numericValues);

    // Mediana
    const mid = Math.floor(numericValues.length / 2);
    analysis.median = numericValues.length % 2 === 0
      ? (numericValues[mid - 1] + numericValues[mid]) / 2
      : numericValues[mid];

    // Moda
    const frequency: Record<number, number> = {};
    numericValues.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency).filter(key => frequency[Number(key)] === maxFreq);
    analysis.mode = modes.length === 1 ? Number(modes[0]) : 'Brak dominującej wartości';

    // Odchylenie standardowe i wariancja
    const variance = numericValues.reduce((sum, val) => sum + Math.pow(val - analysis.mean!, 2), 0) / numericValues.length;
    analysis.variance = variance;
    analysis.standardDeviation = Math.sqrt(variance);

    // Kwartyle
    const q1Index = Math.floor(numericValues.length * 0.25);
    const q3Index = Math.floor(numericValues.length * 0.75);
    analysis.quartiles = {
      q1: numericValues[q1Index],
      q2: analysis.median,
      q3: numericValues[q3Index]
    };
  };

  const analyzeTextQuestion = (
    analysis: QuestionAnalysis,
    responses: Array<{ value: any; timestamp: string; responseId: string }>
  ) => {
    const textResponses = responses.filter(r => r.value && typeof r.value === 'string');
    
    if (textResponses.length === 0) return;

    // Średnia długość tekstu
    analysis.averageLength = textResponses.reduce((sum, r) => sum + r.value.length, 0) / textResponses.length;

    // Analiza słów
    const allWords = textResponses
      .flatMap(r => r.value.toLowerCase().split(/\\s+/))
      .filter(word => word.length > 2); // Ignoruj krótkie słowa

    analysis.wordCount = allWords.length;

    // Najczęściej używane słowa
    const wordFreq: Record<string, number> = {};
    allWords.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    analysis.commonWords = Object.entries(wordFreq)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const analyzeChoiceQuestion = (
    analysis: QuestionAnalysis,
    responses: Array<{ value: any; timestamp: string; responseId: string }>
  ) => {
    // Dla pytań wielokrotnego wyboru, analiza kombinacji odpowiedzi
    if (analysis.type === QuestionType.MULTIPLE_CHOICE) {
      const combinations: Record<string, number> = {};
      responses.forEach(r => {
        if (Array.isArray(r.value)) {
          const combo = r.value.sort().join(', ');
          combinations[combo] = (combinations[combo] || 0) + 1;
        }
      });
      
      analysis.distribution = { ...analysis.distribution, ...combinations };
    }
  };

  const analyzeDateQuestion = (
    analysis: QuestionAnalysis,
    responses: Array<{ value: any; timestamp: string; responseId: string }>
  ) => {
    const dates = responses
      .map(r => new Date(r.value))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    if (dates.length === 0) return;

    analysis.min = dates[0].getTime();
    analysis.max = dates[dates.length - 1].getTime();

    // Rozkład dat po miesiącach/dniach tygodnia
    const monthDistribution: Record<string, number> = {};
    const dayOfWeekDistribution: Record<string, number> = {};
    
    dates.forEach(date => {
      const month = date.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });
      const dayOfWeek = date.toLocaleDateString('pl-PL', { weekday: 'long' });
      
      monthDistribution[month] = (monthDistribution[month] || 0) + 1;
      dayOfWeekDistribution[dayOfWeek] = (dayOfWeekDistribution[dayOfWeek] || 0) + 1;
    });

    analysis.distribution = { ...monthDistribution, ...dayOfWeekDistribution };
  };

  const generateTimeSeriesData = (
    responses: Array<{ value: any; timestamp: string; responseId: string }>
  ) => {
    const dailyData: Record<string, { count: number; values: number[] }> = {};
    
    responses.forEach(r => {
      const date = new Date(r.timestamp).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { count: 0, values: [] };
      }
      dailyData[date].count++;
      
      const numValue = parseFloat(r.value);
      if (!isNaN(numValue)) {
        dailyData[date].values.push(numValue);
      }
    });

    return Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        count: data.count,
        value: data.values.length > 0 ? data.values.reduce((sum, val) => sum + val, 0) / data.values.length : undefined
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const calculateCorrelation = (
    analysis1: QuestionAnalysis,
    analysis2: QuestionAnalysis,
    responses: Response[]
  ): CorrelationData | null => {
    const pairs: Array<{ x: number; y: number }> = [];

    responses.forEach(response => {
      const answer1 = response.answers.find((a: any) => a.questionId === analysis1.questionId);
      const answer2 = response.answers.find((a: any) => a.questionId === analysis2.questionId);

      if (answer1 && answer2) {
        const x = parseFloat(answer1.value);
        const y = parseFloat(answer2.value);

        if (!isNaN(x) && !isNaN(y)) {
          pairs.push({ x, y });
        }
      }
    });

    if (pairs.length < 3) return null;

    // Oblicz korelację Pearsona
    const n = pairs.length;
    const sumX = pairs.reduce((sum, pair) => sum + pair.x, 0);
    const sumY = pairs.reduce((sum, pair) => sum + pair.y, 0);
    const sumXY = pairs.reduce((sum, pair) => sum + pair.x * pair.y, 0);
    const sumX2 = pairs.reduce((sum, pair) => sum + pair.x * pair.x, 0);
    const sumY2 = pairs.reduce((sum, pair) => sum + pair.y * pair.y, 0);

    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (isNaN(correlation)) return null;

    let significance: 'high' | 'medium' | 'low' | 'none';
    const absCorr = Math.abs(correlation);
    if (absCorr >= 0.7) significance = 'high';
    else if (absCorr >= 0.4) significance = 'medium';
    else if (absCorr >= 0.2) significance = 'low';
    else significance = 'none';

    return {
      question1: analysis1.title,
      question2: analysis2.title,
      correlation,
      significance
    };
  };

  const getQuestionTypeColor = (type: QuestionType): string => {
    const colors: Record<QuestionType, string> = {
      [QuestionType.TEXT]: '#1976d2',
      [QuestionType.NUMBER]: '#388e3c',
      [QuestionType.SINGLE_CHOICE]: '#f57c00',
      [QuestionType.MULTIPLE_CHOICE]: '#7b1fa2',
      [QuestionType.SCALE]: '#d32f2f',
      [QuestionType.DATE]: '#455a64'
    };
    return colors[type] || '#757575';
  };

  const getQuestionTypeLabel = (type: QuestionType): string => {
    const labels: Record<QuestionType, string> = {
      [QuestionType.TEXT]: 'Tekst',
      [QuestionType.NUMBER]: 'Liczba',
      [QuestionType.SINGLE_CHOICE]: 'Wybór pojedynczy',
      [QuestionType.MULTIPLE_CHOICE]: 'Wybór wielokrotny',
      [QuestionType.SCALE]: 'Skala',
      [QuestionType.DATE]: 'Data'
    };
    return labels[type] || type;
  };

  const generateDistributionChartData = (distribution: Record<string, number>) => {
    return Object.entries(distribution)
      .map(([key, value]) => ({
        name: key.length > 20 ? key.substring(0, 20) + '...' : key,
        value,
        fullName: key
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20); // Pokaż tylko top 20
  };

  const getFilteredAnalyses = () => {
    if (selectedQuestionType === 'all') return questionAnalyses;
    return questionAnalyses.filter(analysis => analysis.type === selectedQuestionType);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchData}>
          Spróbuj ponownie
        </Button>
      </Box>
    );
  }

  if (!study) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Nie znaleziono danych badania.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(`/studies/${studyId}`)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Zaawansowane statystyki badania
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {study.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kompleksowa analiza statystyczna odpowiedzi
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Odśwież dane">
            <IconButton onClick={fetchData}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eksportuj raport">
            <IconButton>
              <Download />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Podsumowanie główne */}
      {statistics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Łączna liczba odpowiedzi
                    </Typography>
                    <Typography variant="h4">
                      {statistics.totalResponses}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <QuestionAnswer sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Liczba pytań
                    </Typography>
                    <Typography variant="h4">
                      {questionAnalyses.length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Assessment sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Średni wskaźnik odpowiedzi
                    </Typography>
                    <Typography variant="h4">
                      {questionAnalyses.length > 0
                        ? (questionAnalyses.reduce((sum, analysis) => sum + analysis.responseRate, 0) / questionAnalyses.length).toFixed(1)
                        : '0'}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Functions sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Silne korelacje
                    </Typography>
                    <Typography variant="h4">
                      {correlations.filter(c => c.significance === 'high').length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Nawigacja zakładek */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          aria-label="statistics tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<BarChartIcon />} label="Analiza pytań" />
          <Tab icon={<Functions />} label="Korelacje" />
          <Tab icon={<Timeline />} label="Trendy czasowe" />
          <Tab icon={<TableChart />} label="Surowe dane" />
        </Tabs>
      </Paper>

      {/* Analiza pytań */}
      <TabPanel value={activeTab} index={0}>
        <Box sx={{ mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filtruj po typie pytania</InputLabel>
            <Select
              value={selectedQuestionType}
              label="Filtruj po typie pytania"
              onChange={(e: SelectChangeEvent) => setSelectedQuestionType(e.target.value)}
            >
              <MenuItem value="all">Wszystkie typy</MenuItem>
              <MenuItem value={QuestionType.TEXT}>Tekst</MenuItem>
              <MenuItem value={QuestionType.NUMBER}>Liczba</MenuItem>
              <MenuItem value={QuestionType.SINGLE_CHOICE}>Wybór pojedynczy</MenuItem>
              <MenuItem value={QuestionType.MULTIPLE_CHOICE}>Wybór wielokrotny</MenuItem>
              <MenuItem value={QuestionType.SCALE}>Skala</MenuItem>
              <MenuItem value={QuestionType.DATE}>Data</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {getFilteredAnalyses().map((analysis, index) => (
          <Accordion key={analysis.questionId} defaultExpanded={index === 0}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{analysis.title}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                      label={getQuestionTypeLabel(analysis.type)}
                      size="small"
                      sx={{
                        backgroundColor: getQuestionTypeColor(analysis.type),
                        color: 'white'
                      }}
                    />
                    <Chip
                      label={`${analysis.totalResponses} odpowiedzi`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`${analysis.responseRate.toFixed(1)}% wskaźnik`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {/* Podstawowe statystyki */}
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      <Analytics sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Statystyki opisowe
                    </Typography>
                    <List dense>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary="Liczba odpowiedzi"
                          secondary={analysis.totalResponses}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary="Wskaźnik odpowiedzi"
                          secondary={`${analysis.responseRate.toFixed(1)}%`}
                        />
                      </ListItem>
                      
                      {/* Statystyki numeryczne */}
                      {analysis.mean !== undefined && (
                        <>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText
                              primary="Średnia"
                              secondary={analysis.mean.toFixed(2)}
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText
                              primary="Mediana"
                              secondary={analysis.median?.toFixed(2)}
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText
                              primary="Odchylenie standardowe"
                              secondary={analysis.standardDeviation?.toFixed(2)}
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText
                              primary="Zakres"
                              secondary={`${analysis.min} - ${analysis.max}`}
                            />
                          </ListItem>
                          {analysis.quartiles && (
                            <>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                  primary="Q1 (25%)"
                                  secondary={analysis.quartiles.q1.toFixed(2)}
                                />
                              </ListItem>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                  primary="Q3 (75%)"
                                  secondary={analysis.quartiles.q3.toFixed(2)}
                                />
                              </ListItem>
                            </>
                          )}
                        </>
                      )}

                      {/* Statystyki tekstowe */}
                      {analysis.averageLength && (
                        <>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText
                              primary="Średnia długość tekstu"
                              secondary={`${analysis.averageLength.toFixed(1)} znaków`}
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText
                              primary="Łączna liczba słów"
                              secondary={analysis.wordCount}
                            />
                          </ListItem>
                        </>
                      )}
                    </List>
                  </Paper>

                  {/* Najczęstsze słowa dla pytań tekstowych */}
                  {analysis.commonWords && analysis.commonWords.length > 0 && (
                    <Paper sx={{ p: 2, bgcolor: 'grey.50', mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Najczęściej używane słowa
                      </Typography>
                      <List dense>
                        {analysis.commonWords.slice(0, 5).map((word, idx) => (
                          <ListItem key={idx} sx={{ px: 0 }}>
                            <ListItemText
                              primary={word.word}
                              secondary={`${word.count} razy`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}
                </Grid>

                {/* Wizualizacja rozkładu */}
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle2" gutterBottom>
                    <ShowChart sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Rozkład odpowiedzi
                  </Typography>

                  {Object.keys(analysis.distribution).length <= 10 ? (
                    <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {generateDistributionChartData(analysis.distribution).map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ minWidth: 200 }}>
                            <Typography variant="body2" noWrap>
                              {item.name}
                            </Typography>
                          </Box>
                          <Box sx={{ flexGrow: 1, height: 20, bgcolor: 'grey.100', borderRadius: 1, position: 'relative' }}>
                            <Box
                              sx={{
                                width: `${(item.value / Math.max(...generateDistributionChartData(analysis.distribution).map(d => d.value))) * 100}%`,
                                height: '100%',
                                bgcolor: COLORS[index % COLORS.length],
                                borderRadius: 1
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ minWidth: 50 }}>
                            {item.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }}>
                      {generateDistributionChartData(analysis.distribution).slice(0, 20).map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ minWidth: 150 }}>
                            <Typography variant="body2" noWrap>
                              {item.name}
                            </Typography>
                          </Box>
                          <Box sx={{ flexGrow: 1, height: 16, bgcolor: 'grey.100', borderRadius: 1, position: 'relative' }}>
                            <Box
                              sx={{
                                width: `${(item.value / Math.max(...generateDistributionChartData(analysis.distribution).map(d => d.value))) * 100}%`,
                                height: '100%',
                                bgcolor: getQuestionTypeColor(analysis.type),
                                borderRadius: 1
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ minWidth: 40 }}>
                            {item.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Tabela częstości */}
                  <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 300 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Wartość</TableCell>
                          <TableCell align="right">Liczba</TableCell>
                          <TableCell align="right">Procent</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analysis.frequencies.slice(0, 10).map((freq, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              {freq.value.length > 50 ? freq.value.substring(0, 50) + '...' : freq.value}
                            </TableCell>
                            <TableCell align="right">{freq.count}</TableCell>
                            <TableCell align="right">{freq.percentage.toFixed(1)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>

              {/* Wskaźnik postępu odpowiedzi */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Wskaźnik odpowiedzi: {analysis.responseRate.toFixed(1)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={analysis.responseRate}
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </TabPanel>

      {/* Analiza korelacji */}
      <TabPanel value={activeTab} index={1}>
        <Typography variant="h5" gutterBottom>
          Analiza korelacji między pytaniami
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Korelacje obliczone dla pytań numerycznych i skal (współczynnik Pearsona)
        </Typography>

        {correlations.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pytanie 1</TableCell>
                  <TableCell>Pytanie 2</TableCell>
                  <TableCell align="center">Korelacja</TableCell>
                  <TableCell align="center">Siła związku</TableCell>
                  <TableCell align="center">Wizualizacja</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {correlations.map((corr, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap>
                        {corr.question1}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap>
                        {corr.question2}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="medium">
                        {corr.correlation.toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={
                          corr.significance === 'high' ? 'Silna' :
                          corr.significance === 'medium' ? 'Średnia' :
                          corr.significance === 'low' ? 'Słaba' : 'Brak'
                        }
                        color={
                          corr.significance === 'high' ? 'error' :
                          corr.significance === 'medium' ? 'warning' :
                          corr.significance === 'low' ? 'info' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ width: 100, height: 20, bgcolor: 'grey.100', borderRadius: 1, position: 'relative' }}>
                        <Box
                          sx={{
                            width: `${Math.abs(corr.correlation) * 100}%`,
                            height: '100%',
                            bgcolor: corr.correlation > 0 ? 'success.light' : 'error.light',
                            borderRadius: 1
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontWeight: 'bold'
                          }}
                        >
                          {(Math.abs(corr.correlation) * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">
            Brak danych do analizy korelacji. Korelacje są obliczane tylko dla pytań numerycznych i skal.
          </Alert>
        )}
      </TabPanel>

      {/* Trendy czasowe */}
      <TabPanel value={activeTab} index={2}>
        <Typography variant="h5" gutterBottom>
          Analiza trendów czasowych
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Rozkład odpowiedzi w czasie dla każdego pytania
        </Typography>

        <Grid container spacing={3}>
          {questionAnalyses
            .filter(analysis => analysis.timeSeriesData && analysis.timeSeriesData.length > 1)
            .map((analysis) => (
              <Grid item xs={12} lg={6} key={analysis.questionId}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {analysis.title}
                    </Typography>
                    <Box sx={{ height: 250, p: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Trendy odpowiedzi w czasie
                      </Typography>
                      <Box sx={{ height: 200, display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }}>
                        {analysis.timeSeriesData?.map((dataPoint, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" sx={{ minWidth: 100 }}>
                              {new Date(dataPoint.date).toLocaleDateString('pl-PL')}
                            </Typography>
                            <Box sx={{ flexGrow: 1, height: 16, bgcolor: 'grey.100', borderRadius: 1, position: 'relative' }}>
                              <Box
                                sx={{
                                  width: `${Math.min((dataPoint.count / Math.max(...(analysis.timeSeriesData?.map(d => d.count) || [1]))) * 100, 100)}%`,
                                  height: '100%',
                                  bgcolor: '#8884d8',
                                  borderRadius: 1
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ minWidth: 30 }}>
                              {dataPoint.count}
                            </Typography>
                            {dataPoint.value !== undefined && (
                              <Typography variant="body2" sx={{ minWidth: 50 }} color="text.secondary">
                                avg: {dataPoint.value.toFixed(1)}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        {questionAnalyses.filter(analysis => analysis.timeSeriesData && analysis.timeSeriesData.length > 1).length === 0 && (
          <Alert severity="info">
            Brak wystarczających danych czasowych do analizy trendów.
          </Alert>
        )}
      </TabPanel>

      {/* Surowe dane */}
      <TabPanel value={activeTab} index={3}>
        <Typography variant="h5" gutterBottom>
          Surowe dane odpowiedzi
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Pełna lista wszystkich odpowiedzi dla każdego pytania
        </Typography>

        {questionAnalyses.map((analysis) => (
          <Accordion key={`raw-${analysis.questionId}`}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">
                {analysis.title} ({analysis.rawResponses.length} odpowiedzi)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Lp.</TableCell>
                      <TableCell>Wartość</TableCell>
                      <TableCell>Data odpowiedzi</TableCell>
                      <TableCell>ID odpowiedzi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analysis.rawResponses.map((response, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          {typeof response.value === 'object' 
                            ? JSON.stringify(response.value)
                            : String(response.value)
                          }
                        </TableCell>
                        <TableCell>
                          {new Date(response.timestamp).toLocaleString('pl-PL')}
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {response.responseId.substring(0, 8)}...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
      </TabPanel>

      {questionAnalyses.length === 0 && (
        <Box sx={{ mt: 4 }}>
          <Alert severity="info">
            To badanie nie ma jeszcze żadnych odpowiedzi. Statystyki będą dostępne po otrzymaniu pierwszych odpowiedzi.
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export { StudyStatisticsPage };
export default StudyStatisticsPage;

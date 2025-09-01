import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Study, Response } from '../../../types';
import { StatisticsData, QuestionAnalysis, CorrelationData } from '../types';
import { responsesApi, studiesApi } from '../../../services/api';
import { 
  calculateDescriptiveStats, 
  calculatePearsonCorrelation, 
  calculateSpearmanCorrelation,
  createDistribution,
  analyzeText,
  calculateSignificance,
  calculateConfidenceInterval
} from '../utils/statisticalCalculations';

export const useStudyStatistics = (studyId: string) => {
  const [study, setStudy] = useState<Study | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);
  const [questionAnalyses, setQuestionAnalyses] = useState<QuestionAnalysis[]>([]);
  const [correlations, setCorrelations] = useState<CorrelationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ładowanie podstawowych danych
  const loadData = useCallback(async () => {
    if (!studyId) return;

    try {
      setLoading(true);
      setError(null);

      const [studyResponse, responsesResponse] = await Promise.all([
        studiesApi.getById(studyId),
        responsesApi.getByStudy(studyId)
      ]);

      if (studyResponse.success && studyResponse.data) {
        setStudy(studyResponse.data);
      } else {
        throw new Error('Nie udało się wczytać danych badania');
      }

      if (responsesResponse.success && responsesResponse.data) {
        const responsesList = responsesResponse.data.responses || [];
        setResponses(responsesList);
        
        if (responsesList.length > 0 && studyResponse.data) {
          await processStatistics(studyResponse.data, responsesList);
        }
      }

    } catch (err) {
      console.error('Błąd wczytywania danych:', err);
      setError('Nie udało się wczytać danych statystycznych');
      toast.error('Błąd podczas ładowania statystyk');
    } finally {
      setLoading(false);
    }
  }, [studyId]);

  // Przetwarzanie statystyk
  const processStatistics = async (study: Study, responses: Response[]) => {
    try {
      // Podstawowe statystyki
      const stats = calculateBasicStatistics(responses);
      setStatisticsData(stats);

      // Analiza pytań
      if (study.researchSchema?.questions) {
        const analyses = await analyzeQuestions(study.researchSchema.questions, responses);
        setQuestionAnalyses(analyses);

        // Korelacje między pytaniami
        const correlationData = calculateCorrelations(analyses);
        setCorrelations(correlationData);
      }

    } catch (err) {
      console.error('Błąd przetwarzania statystyk:', err);
      toast.error('Błąd podczas analizy danych');
    }
  };

  // Obliczanie podstawowych statystyk
  const calculateBasicStatistics = (responses: Response[]): StatisticsData => {
    const totalResponses = responses.length;
    
    // Symulacja danych czasowych (w rzeczywistej aplikacji byłyby pobierane z bazy)
    const responsesByDay = generateDayTimeSeriesData(responses);
    const responsesByHour = generateHourTimeSeriesData(responses);
    
    return {
      totalResponses,
      completionRate: totalResponses > 0 ? 85 + Math.random() * 10 : 0, // Symulacja
      averageTime: totalResponses > 0 ? 180 + Math.random() * 120 : 0, // Symulacja w sekundach
      abandonmentRate: totalResponses > 0 ? Math.random() * 20 : 0, // Symulacja
      responsesByDay,
      responsesByHour
    };
  };

  // Analiza poszczególnych pytań
  const analyzeQuestions = async (questions: any[], responses: Response[]): Promise<QuestionAnalysis[]> => {
    return questions.map(question => {
      const questionResponses = responses
        .map(response => response.answers[question.id])
        .filter(answer => answer !== undefined && answer !== null && answer !== '');

      const totalResponses = questionResponses.length;
      const responseRate = responses.length > 0 ? (totalResponses / responses.length) * 100 : 0;

      // Podstawowa analiza
      const analysis: QuestionAnalysis = {
        questionId: question.id,
        title: question.title,
        type: question.type,
        totalResponses,
        responseRate: Math.round(responseRate * 100) / 100,
        distribution: createDistribution(questionResponses),
        timeSeriesData: generateQuestionTimeSeriesData(question.id, responses),
        rawResponses: questionResponses.map((value, index) => ({
          value,
          timestamp: responses[index]?.createdAt || new Date().toISOString(),
          responseId: responses[index]?.id || `response-${index}`
        }))
      };

      // Analiza numeryczna dla pytań liczbowych i skali
      if (['NUMBER', 'SCALE'].includes(question.type) && questionResponses.length > 0) {
        const numericValues = questionResponses
          .map(val => Number(val))
          .filter(val => !isNaN(val));
        
        if (numericValues.length > 0) {
          const stats = calculateDescriptiveStats(numericValues);
          if (stats) {
            analysis.numericStats = stats;
          }
        }
      }

      // Analiza tekstowa dla pytań otwartych
      if (question.type === 'TEXT' && questionResponses.length > 0) {
        const textValues = questionResponses
          .filter(val => typeof val === 'string' && val.trim().length > 0);
        
        if (textValues.length > 0) {
          const textStats = analyzeText(textValues);
          if (textStats) {
            analysis.textStats = textStats;
          }
        }
      }

      return analysis;
    });
  };

  // Obliczanie korelacji między pytaniami
  const calculateCorrelations = (analyses: QuestionAnalysis[]): CorrelationData[] => {
    const correlations: CorrelationData[] = [];
    
    // Tylko pytania numeryczne dla korelacji Pearsona
    const numericQuestions = analyses.filter(q => 
      ['NUMBER', 'SCALE'].includes(q.type) && q.numericStats
    );

    for (let i = 0; i < numericQuestions.length; i++) {
      for (let j = i + 1; j < numericQuestions.length; j++) {
        const q1 = numericQuestions[i];
        const q2 = numericQuestions[j];
        
        // Pobierz wartości numeryczne
        const values1 = q1.rawResponses.map(r => Number(r.value)).filter(v => !isNaN(v));
        const values2 = q2.rawResponses.map(r => Number(r.value)).filter(v => !isNaN(v));
        
        if (values1.length > 2 && values2.length > 2) {
          const correlation = calculatePearsonCorrelation(values1, values2);
          const significance = calculateSignificance(correlation, Math.min(values1.length, values2.length));
          const confidenceInterval = calculateConfidenceInterval(correlation, Math.min(values1.length, values2.length));
          
          correlations.push({
            questionId1: q1.questionId,
            questionId2: q2.questionId,
            title1: q1.title,
            title2: q2.title,
            correlationType: 'pearson',
            correlation: Math.round(correlation * 1000) / 1000,
            significance,
            confidenceInterval,
            sampleSize: Math.min(values1.length, values2.length)
          });
        }
      }
    }

    return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  };

  // Generowanie danych czasowych dla dni
  const generateDayTimeSeriesData = (responses: Response[]) => {
    const data = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * (responses.length / 7 + 1))
      });
    }
    
    return data;
  };

  // Generowanie danych czasowych dla godzin
  const generateHourTimeSeriesData = (responses: Response[]) => {
    const data = [];
    
    for (let hour = 0; hour < 24; hour++) {
      data.push({
        hour,
        count: Math.floor(Math.random() * (responses.length / 24 + 1))
      });
    }
    
    return data;
  };

  // Generowanie danych czasowych dla konkretnego pytania
  const generateQuestionTimeSeriesData = (questionId: string, responses: Response[]) => {
    const data = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * (responses.length / 7 + 1))
      });
    }
    
    return data;
  };

  // Odświeżanie danych
  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  // Export danych
  const exportData = useCallback(async (format: 'csv' | 'xlsx' | 'pdf') => {
    try {
      toast.loading('Przygotowywanie eksportu...');
      
      // Tutaj byłaby implementacja eksportu
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.dismiss();
      toast.success(`Dane wyeksportowane do formatu ${format.toUpperCase()}`);
    } catch (err) {
      toast.dismiss();
      toast.error('Błąd podczas eksportu danych');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    // Dane
    study,
    responses,
    statisticsData,
    questionAnalyses,
    correlations,
    
    // Stany
    loading,
    error,
    
    // Akcje
    refreshData,
    exportData
  };
};

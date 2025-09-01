import { QuestionType } from '../../types';

export interface StatisticsData {
  totalResponses: number;
  completionRate: number;
  averageTime: number;
  abandonmentRate: number;
  responsesByDay: { date: string; count: number }[];
  responsesByHour: { hour: number; count: number }[];
}

export interface QuestionAnalysis {
  questionId: string;
  title: string;
  type: QuestionType;
  totalResponses: number;
  responseRate: number;
  
  // Statystyki numeryczne
  numericStats?: {
    mean: number;
    median: number;
    mode: number;
    standardDeviation: number;
    variance: number;
    min: number;
    max: number;
    quartiles: {
      q1: number;
      q2: number;
      q3: number;
    };
    outliers: number[];
  };
  
  // Rozkład odpowiedzi dla pytań kategorycznych
  distribution: { value: string; count: number; percentage: number }[];
  
  // Analiza tekstowa
  textStats?: {
    averageLength: number;
    wordCount: number;
    sentenceCount: number;
    readabilityScore: number;
    commonWords: { word: string; count: number }[];
    sentiment?: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
  
  // Trendy czasowe
  timeSeriesData: { date: string; count: number; value?: number }[];
  
  // Surowe odpowiedzi (do analizy)
  rawResponses: { value: any; timestamp: string; responseId: string }[];
}

export interface CorrelationData {
  questionId1: string;
  questionId2: string;
  title1: string;
  title2: string;
  correlationType: 'pearson' | 'spearman' | 'kendall' | 'cramer_v';
  correlation: number;
  pValue?: number;
  significance: 'high' | 'medium' | 'low' | 'none';
  confidenceInterval?: [number, number];
  sampleSize: number;
}

export interface AdvancedAnalytics {
  clusterAnalysis?: {
    clusters: number;
    silhouetteScore: number;
    groups: { respondents: string[]; characteristics: string[] }[];
  };
  
  factorAnalysis?: {
    factors: { name: string; variance: number; questions: string[] }[];
    totalVarianceExplained: number;
  };
  
  regressionAnalysis?: {
    dependent: string;
    independent: string[];
    rSquared: number;
    coefficients: { variable: string; coefficient: number; pValue: number }[];
  };
}

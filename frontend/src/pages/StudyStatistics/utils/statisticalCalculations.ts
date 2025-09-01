import { QuestionAnalysis, CorrelationData, StatisticsData } from '../types';
import { Response, Question, QuestionType } from '../../../types';

// Podstawowe statystyki opisowe
export const calculateDescriptiveStats = (values: number[]) => {
  if (values.length === 0) return null;
  
  const sorted = [...values].sort((a, b) => a - b);
  const n = values.length;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / n;
  const median = n % 2 === 0 
    ? (sorted[n/2 - 1] + sorted[n/2]) / 2 
    : sorted[Math.floor(n/2)];
  
  // Moda - najczęściej występująca wartość
  const frequency = values.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const mode = Number(Object.entries(frequency)
    .reduce((a, b) => frequency[Number(a[0])] > frequency[Number(b[0])] ? a : b)[0]);
  
  // Odchylenie standardowe i wariancja
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
  const standardDeviation = Math.sqrt(variance);
  
  // Kwartyle
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  
  // Outliers (metoda IQR)
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  const outliers = values.filter(val => val < lowerBound || val > upperBound);
  
  return {
    mean: Math.round(mean * 100) / 100,
    median,
    mode,
    standardDeviation: Math.round(standardDeviation * 100) / 100,
    variance: Math.round(variance * 100) / 100,
    min: Math.min(...values),
    max: Math.max(...values),
    quartiles: { q1, q2: median, q3 },
    outliers
  };
};

// Korelacja Pearsona
export const calculatePearsonCorrelation = (x: number[], y: number[]) => {
  if (x.length !== y.length || x.length === 0) return 0;
  
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
};

// Korelacja Spearmana (rangowa)
export const calculateSpearmanCorrelation = (x: number[], y: number[]) => {
  if (x.length !== y.length) return 0;
  
  const rankX = getRanks(x);
  const rankY = getRanks(y);
  
  return calculatePearsonCorrelation(rankX, rankY);
};

// Pomocnicza funkcja do obliczania rang
const getRanks = (arr: number[]): number[] => {
  const sorted = [...arr].map((val, idx) => ({ val, idx }))
    .sort((a, b) => a.val - b.val);
  
  const ranks = new Array(arr.length);
  sorted.forEach((item, rank) => {
    ranks[item.idx] = rank + 1;
  });
  
  return ranks;
};

// V Cramera dla zmiennych kategorycznych
export const calculateCramersV = (contingencyTable: number[][]) => {
  const n = contingencyTable.reduce((sum, row) => sum + row.reduce((a, b) => a + b, 0), 0);
  const chi2 = calculateChiSquare(contingencyTable);
  
  const rows = contingencyTable.length;
  const cols = contingencyTable[0].length;
  
  return Math.sqrt(chi2 / (n * (Math.min(rows, cols) - 1)));
};

// Chi-kwadrat
const calculateChiSquare = (observed: number[][]) => {
  const rows = observed.length;
  const cols = observed[0].length;
  const total = observed.reduce((sum, row) => sum + row.reduce((a, b) => a + b, 0), 0);
  
  let chi2 = 0;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const rowSum = observed[i].reduce((a, b) => a + b, 0);
      const colSum = observed.reduce((sum, row) => sum + row[j], 0);
      const expected = (rowSum * colSum) / total;
      
      if (expected > 0) {
        chi2 += Math.pow(observed[i][j] - expected, 2) / expected;
      }
    }
  }
  
  return chi2;
};

// Analiza tekstu - podstawowe statystyki
export const analyzeText = (texts: string[]) => {
  if (texts.length === 0) return null;
  
  const totalLength = texts.reduce((sum, text) => sum + text.length, 0);
  const averageLength = totalLength / texts.length;
  
  const words = texts.flatMap(text => 
    text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0)
  );
  
  const sentences = texts.flatMap(text => 
    text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0)
  );
  
  // Częstotliwość słów
  const wordFreq = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const commonWords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
  
  // Prosta analiza sentymentu (bardzo podstawowa)
  const positiveWords = ['dobry', 'świetny', 'doskonały', 'pozytywny', 'lubię', 'podoba'];
  const negativeWords = ['zły', 'słaby', 'negatywny', 'nie lubię', 'problem', 'trudny'];
  
  let positive = 0, negative = 0, neutral = 0;
  
  texts.forEach(text => {
    const lowerText = text.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerText.includes(word));
    const hasNegative = negativeWords.some(word => lowerText.includes(word));
    
    if (hasPositive && !hasNegative) positive++;
    else if (hasNegative && !hasPositive) negative++;
    else neutral++;
  });
  
  return {
    averageLength: Math.round(averageLength * 100) / 100,
    wordCount: words.length,
    sentenceCount: sentences.length,
    readabilityScore: Math.max(0, Math.min(100, 100 - averageLength / 10)), // Uproszczona ocena czytelności
    commonWords,
    sentiment: {
      positive: Math.round((positive / texts.length) * 100),
      negative: Math.round((negative / texts.length) * 100),
      neutral: Math.round((neutral / texts.length) * 100)
    }
  };
};

// Grupowanie odpowiedzi według wartości
export const createDistribution = (values: any[]) => {
  const frequency = values.reduce((acc, val) => {
    const key = String(val);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const total = values.length;
  
  return Object.entries(frequency)
    .map(([value, count]) => ({
      value,
      count: count as number,
      percentage: Math.round(((count as number) / total) * 100 * 100) / 100
    }))
    .sort((a, b) => b.count - a.count);
};

// Test istotności korelacji
export const calculateSignificance = (correlation: number, sampleSize: number) => {
  const tStat = Math.abs(correlation) * Math.sqrt((sampleSize - 2) / (1 - correlation * correlation));
  
  // Uproszczone progi istotności
  if (tStat > 2.576) return 'high';      // p < 0.01
  if (tStat > 1.96) return 'medium';     // p < 0.05
  if (tStat > 1.645) return 'low';       // p < 0.10
  return 'none';
};

// Obliczenia przedziałów ufności dla korelacji
export const calculateConfidenceInterval = (correlation: number, sampleSize: number, confidence = 0.95) => {
  const z = 0.5 * Math.log((1 + correlation) / (1 - correlation));
  const se = 1 / Math.sqrt(sampleSize - 3);
  const zCritical = confidence === 0.95 ? 1.96 : 2.576;
  
  const lowerZ = z - zCritical * se;
  const upperZ = z + zCritical * se;
  
  const lower = (Math.exp(2 * lowerZ) - 1) / (Math.exp(2 * lowerZ) + 1);
  const upper = (Math.exp(2 * upperZ) - 1) / (Math.exp(2 * upperZ) + 1);
  
  return [Math.round(lower * 1000) / 1000, Math.round(upper * 1000) / 1000] as [number, number];
};

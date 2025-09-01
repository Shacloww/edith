export { default } from './StudyStatistics';

// Eksportujemy też komponenty dla ewentualnego ponownego użycia
export { StatisticsHeader } from './components/StatisticsHeader';
export { OverviewCards } from './components/OverviewCards';
export { QuestionAnalysisComponent } from './components/QuestionAnalysisComponent';

// Eksportujemy typy
export * from './types';

// Eksportujemy hook
export { useStudyStatistics } from './hooks/useStudyStatistics';

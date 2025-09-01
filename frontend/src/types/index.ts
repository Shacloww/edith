import React from 'react';

// Enums
export enum StudyStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED'
}

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE', 
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  SCALE = 'SCALE',
  DATE = 'DATE'
}

// Interfaces dla pytań
export interface QuestionOption {
  value: string;
  label: string;
}

export interface QuestionValidation {
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  pattern?: string;
  required?: boolean;
}

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
  description?: string;
  placeholder?: string;
  options?: (string | QuestionOption)[];
  validation?: QuestionValidation;
}

// Interfaces dla modeli
export interface ResearchSchema {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  studies?: Study[];
}

export interface Study {
  id: string;
  title: string;
  description?: string;
  researchSchemaId: string;
  status: StudyStatus;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  researchSchema?: ResearchSchema;
  responses?: Response[];
  _count?: {
    responses: number;
  };
}

export interface Response {
  id: string;
  studyId: string;
  answers: Record<string, any>;
  createdAt: string;
  study?: Study;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any[];
}

// Form data types
export interface CreateResearchSchemaForm {
  title: string;
  description?: string;
  questions: Question[];
}

export interface UpdateResearchSchemaForm {
  title?: string;
  description?: string;
  questions?: Question[];
}

export interface CreateStudyForm {
  title: string;
  description?: string;
  researchSchemaId: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateStudyForm {
  title?: string;
  description?: string;
  status?: StudyStatus;
  startDate?: string;
  endDate?: string;
}

export interface SubmitResponseForm {
  studyId: string;
  answers: Record<string, any>;
}

// Statistics types
export interface QuestionStatistics {
  title: string;
  type: QuestionType;
  totalAnswers: number;
  responseRate: string;
  averageLength?: string;
  min?: number;
  max?: number;
  average?: string;
  distribution?: Record<string, number>;
}

export interface StudyStatistics {
  totalResponses: number;
  questionStats: Record<string, QuestionStatistics>;
}

// Component props types
export interface QuestionBuilderProps {
  question: Question;
  onChange: (question: Question) => void;
  onDelete: () => void;
}

export interface QuestionRendererProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export interface StudyCardProps {
  study: Study;
  onEdit?: (study: Study) => void;
  onDelete?: (studyId: string) => void;
  onStatusChange?: (studyId: string, status: StudyStatus) => void;
}

export interface ResearchSchemaCardProps {
  schema: ResearchSchema;
  onEdit?: (schema: ResearchSchema) => void;
  onDelete?: (schemaId: string) => void;
}

// Navigation types
export interface NavigationItem {
  label: string;
  path: string;
  icon?: React.ComponentType;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Pagination
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

import { Request } from 'express';
import { PrismaClient } from '@prisma/client';

// Rozszerz Express Request o Prisma
export interface RequestWithPrisma extends Request {
  prisma: PrismaClient;
}

// Typy dla pytań w schemacie badawczym
export type QuestionType = 
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE' 
  | 'TEXT' 
  | 'NUMBER' 
  | 'SCALE'
  | 'DATE';

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
  instructions?: string;
  placeholder?: string;
  options?: string[];
  validation?: QuestionValidation;
}

// Study Status enum (jako string literals dla SQLite)
export type StudyStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';

// Typy dla API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any[];
}

// Typy dla statystyk
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

// Typy dla DTO (Data Transfer Objects)
export interface CreateResearchSchemaDto {
  title: string;
  description?: string;
  protocol_id?: string;
  questions: Question[];
}

export interface UpdateResearchSchemaDto {
  title?: string;
  description?: string;
  questions?: Question[];
}

export interface CreateStudyDto {
  title: string;
  description?: string;
  researchSchemaId: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateStudyDto {
  title?: string;
  description?: string;
  status?: StudyStatus;
  startDate?: string;
  endDate?: string;
}

export interface CreateResponseDto {
  studyId: string;
  answers: Record<string, any>;
}

// Validation result type
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Helper functions for JSON serialization
export const serializeQuestions = (questions: Question[]): string => {
  return JSON.stringify(questions);
};

export const deserializeQuestions = (questionsJson: string): Question[] => {
  try {
    return JSON.parse(questionsJson);
  } catch (error) {
    console.error('Error parsing questions JSON:', error);
    return [];
  }
};

export const serializeAnswers = (answers: Record<string, any>): string => {
  return JSON.stringify(answers);
};

export const deserializeAnswers = (answersJson: string): Record<string, any> => {
  try {
    return JSON.parse(answersJson);
  } catch (error) {
    console.error('Error parsing answers JSON:', error);
    return {};
  }
};

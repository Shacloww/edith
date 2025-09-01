import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { 
  RequestWithPrisma, 
  CreateResponseDto, 
  ApiResponse,
  Question,
  StudyStatistics,
  QuestionStatistics,
  ValidationResult,
  deserializeQuestions,
  deserializeAnswers,
  serializeAnswers
} from '../types';

const prisma = new PrismaClient();

class ResponseController {
  // Pobierz wszystkie odpowiedzi dla badania
  async getResponsesByStudy(req: Request, res: Response): Promise<void> {
    try {
      const { studyId } = req.params;

      // Sprawdź czy badanie istnieje
      const study = await prisma.study.findUnique({
        where: { id: studyId },
        include: {
          researchSchema: true
        }
      });

      if (!study) {
        const response: ApiResponse = {
          success: false,
          error: 'Badanie nie zostało znalezione'
        };
        res.status(404).json(response);
        return;
      }

      const responses = await prisma.response.findMany({
        where: { studyId },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Deserializuj answers dla każdej odpowiedzi
      const responsesWithAnswers = responses.map((response: any) => ({
        ...response,
        answers: deserializeAnswers(response.answers)
      }));

      // Deserializuj questions dla schematu
      const studyWithQuestions = {
        ...study,
        researchSchema: {
          ...study.researchSchema,
          questions: deserializeQuestions(study.researchSchema.questions)
        }
      };

      const apiResponse: ApiResponse = {
        success: true,
        data: {
          study: studyWithQuestions,
          responses: responsesWithAnswers
        }
      };

      res.json(apiResponse);
    } catch (error) {
      console.error('Error fetching responses:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się pobrać odpowiedzi'
      };
      res.status(500).json(response);
    }
  }

  // Pobierz pojedynczą odpowiedź
  async getResponseById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const response = await prisma.response.findUnique({
        where: { id },
        include: {
          study: {
            include: {
              researchSchema: true
            }
          }
        }
      });

      if (!response) {
        const apiResponse: ApiResponse = {
          success: false,
          error: 'Odpowiedź nie została znaleziona'
        };
        res.status(404).json(apiResponse);
        return;
      }

      // Deserializuj dane
      const responseWithData = {
        ...response,
        answers: deserializeAnswers(response.answers),
        study: {
          ...response.study,
          researchSchema: {
            ...response.study.researchSchema,
            questions: deserializeQuestions(response.study.researchSchema.questions)
          }
        }
      };

      const apiResponse: ApiResponse = {
        success: true,
        data: responseWithData
      };

      res.json(apiResponse);
    } catch (error) {
      console.error('Error fetching response:', error);
      const apiResponse: ApiResponse = {
        success: false,
        error: 'Nie udało się pobrać odpowiedzi'
      };
      res.status(500).json(apiResponse);
    }
  }

  // Utwórz nową odpowiedź
  async createResponse(req: Request, res: Response): Promise<void> {
    try {
      console.log('📥 Received request body:', JSON.stringify(req.body, null, 2));
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        const response: ApiResponse = {
          success: false,
          error: 'Nieprawidłowe dane',
          details: errors.array()
        };
        res.status(400).json(response);
        return;
      }

      const { studyId, answers }: CreateResponseDto = req.body;

      // Sprawdź czy badanie istnieje i jest aktywne
      const study = await prisma.study.findUnique({
        where: { id: studyId },
        include: {
          researchSchema: true
        }
      });

      if (!study) {
        const response: ApiResponse = {
          success: false,
          error: 'Badanie nie istnieje'
        };
        res.status(400).json(response);
        return;
      }

      if (study.status !== 'ACTIVE') {
        const response: ApiResponse = {
          success: false,
          error: 'Badanie nie jest aktywne'
        };
        res.status(400).json(response);
        return;
      }

      // Walidacja odpowiedzi względem schematu badawczego
      const questions = deserializeQuestions(study.researchSchema.questions);
      console.log('🔍 Questions from schema:', questions);
      console.log('📝 Answers to validate:', answers);
      
      const isValidAnswers = this.validateAnswers(questions, answers);
      console.log('✅ Validation result:', isValidAnswers);

      if (!isValidAnswers.valid) {
        const response: ApiResponse = {
          success: false,
          error: 'Nieprawidłowe odpowiedzi',
          details: isValidAnswers.errors
        };
        res.status(400).json(response);
        return;
      }

      const responseData = await prisma.response.create({
        data: {
          studyId,
          answers: serializeAnswers(answers)
        }
      });

      // Deserializuj dla odpowiedzi
      const responseWithAnswers = {
        ...responseData,
        answers: deserializeAnswers(responseData.answers)
      };

      const apiResponse: ApiResponse = {
        success: true,
        data: responseWithAnswers,
        message: 'Odpowiedź została zapisana'
      };

      res.status(201).json(apiResponse);
    } catch (error) {
      console.error('Error creating response:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się zapisać odpowiedzi'
      };
      res.status(500).json(response);
    }
  }

  // Usuń odpowiedź
  async deleteResponse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await prisma.response.delete({
        where: { id }
      });

      const response: ApiResponse = {
        success: true,
        message: 'Odpowiedź została usunięta'
      };

      res.json(response);
    } catch (error: any) {
      if (error.code === 'P2025') {
        const response: ApiResponse = {
          success: false,
          error: 'Odpowiedź nie została znaleziona'
        };
        res.status(404).json(response);
        return;
      }

      console.error('Error deleting response:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się usunąć odpowiedzi'
      };
      res.status(500).json(response);
    }
  }

  // Generuj statystyki dla badania
  async getStudyStatistics(req: Request, res: Response): Promise<void> {
    try {
      const { studyId } = req.params;

      const study = await prisma.study.findUnique({
        where: { id: studyId },
        include: {
          researchSchema: true,
          responses: true
        }
      });

      if (!study) {
        const response: ApiResponse = {
          success: false,
          error: 'Badanie nie zostało znalezione'
        };
        res.status(404).json(response);
        return;
      }

      // Deserializuj dane
      const studyWithData = {
        ...study,
        researchSchema: {
          ...study.researchSchema,
          questions: deserializeQuestions(study.researchSchema.questions)
        },
        responses: study.responses.map((response: any) => ({
          ...response,
          answers: deserializeAnswers(response.answers)
        }))
      };

      const statistics = this.calculateStatistics(studyWithData);

      const apiResponse: ApiResponse<StudyStatistics> = {
        success: true,
        data: statistics
      };

      res.json(apiResponse);
    } catch (error) {
      console.error('Error generating statistics:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się wygenerować statystyk'
      };
      res.status(500).json(response);
    }
  }

  // Pomocnicza funkcja do walidacji odpowiedzi
  validateAnswers(questions: Question[], answers: Record<string, any>): ValidationResult {
    const errors: string[] = [];

    // Sprawdź czy wszystkie wymagane pytania mają odpowiedzi
    questions.forEach(question => {
      if (question.required && (!answers[question.id] || answers[question.id] === '')) {
        errors.push(`Pytanie "${question.title}" jest wymagane`);
      }

      // Dodatkowa walidacja typów odpowiedzi
      if (answers[question.id]) {
        switch (question.type) {
          case 'NUMBER':
            if (isNaN(Number(answers[question.id]))) {
              errors.push(`Odpowiedź na pytanie "${question.title}" musi być liczbą`);
            }
            break;
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Pomocnicza funkcja do kalkulacji statystyk
  calculateStatistics(study: any): StudyStatistics {
    const responses = study.responses;
    const questions = study.researchSchema.questions;

    const stats: StudyStatistics = {
      totalResponses: responses.length,
      questionStats: {}
    };

    questions.forEach((question: Question) => {
      const questionResponses = responses
        .map((r: any) => r.answers[question.id])
        .filter((answer: any) => answer !== undefined && answer !== null && answer !== '');

      const questionStat: QuestionStatistics = {
        title: question.title,
        type: question.type,
        totalAnswers: questionResponses.length,
        responseRate: responses.length > 0 ? (questionResponses.length / responses.length * 100).toFixed(2) : '0'
      };

      // Statystyki specyficzne dla typu pytania
      switch (question.type) {
        case 'TEXT':
          questionStat.averageLength = questionResponses.length > 0 
            ? (questionResponses.reduce((sum: number, answer: string) => sum + answer.length, 0) / questionResponses.length).toFixed(2)
            : '0';
          break;

        case 'NUMBER':
        case 'SCALE':
          const numericAnswers = questionResponses.map(Number).filter((n: number) => !isNaN(n));
          if (numericAnswers.length > 0) {
            questionStat.min = Math.min(...numericAnswers);
            questionStat.max = Math.max(...numericAnswers);
            questionStat.average = (numericAnswers.reduce((sum: number, n: number) => sum + n, 0) / numericAnswers.length).toFixed(2);
          }
          break;

        case 'SINGLE_CHOICE':
          const distribution: Record<string, number> = {};
          questionResponses.forEach((answer: string) => {
            distribution[answer] = (distribution[answer] || 0) + 1;
          });
          questionStat.distribution = distribution;
          break;

        case 'MULTIPLE_CHOICE':
          const checkboxDistribution: Record<string, number> = {};
          questionResponses.forEach((answer: string[]) => {
            if (Array.isArray(answer)) {
              answer.forEach((option: string) => {
                checkboxDistribution[option] = (checkboxDistribution[option] || 0) + 1;
              });
            }
          });
          questionStat.distribution = checkboxDistribution;
          break;
      }

      stats.questionStats[question.id] = questionStat;
    });

    return stats;
  }
}

export default new ResponseController();

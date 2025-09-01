import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { 
  RequestWithPrisma, 
  CreateStudyDto, 
  UpdateStudyDto, 
  ApiResponse,
  StudyStatus,
  deserializeQuestions
} from '../types';

const prisma = new PrismaClient();

class StudyController {
  // Pobierz wszystkie badania
  async getAllStudies(req: Request, res: Response): Promise<void> {
    try {
      const studies = await prisma.study.findMany({
        include: {
          researchSchema: {
            select: {
              id: true,
              title: true
            }
          },
          _count: {
            select: {
              responses: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const response: ApiResponse = {
        success: true,
        data: studies
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching studies:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się pobrać badań'
      };
      res.status(500).json(response);
    }
  }

  // Pobierz pojedyncze badanie
  async getStudyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const study = await prisma.study.findUnique({
        where: { id },
        include: {
          researchSchema: true,
          responses: {
            orderBy: {
              createdAt: 'desc'
            }
          }
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

      // Deserializuj questions w researchSchema
      const studyWithDeserializedQuestions = {
        ...study,
        researchSchema: study.researchSchema ? {
          ...study.researchSchema,
          questions: deserializeQuestions(study.researchSchema.questions)
        } : null
      };

      const response: ApiResponse = {
        success: true,
        data: studyWithDeserializedQuestions
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching study:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się pobrać badania'
      };
      res.status(500).json(response);
    }
  }

  // Utwórz nowe badanie
  async createStudy(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse = {
          success: false,
          error: 'Nieprawidłowe dane',
          details: errors.array()
        };
        res.status(400).json(response);
        return;
      }

      const { title, description, researchSchemaId, startDate, endDate }: CreateStudyDto = req.body;

      // Sprawdź czy schemat badawczy istnieje
      const researchSchema = await prisma.researchSchema.findUnique({
        where: { id: researchSchemaId }
      });

      if (!researchSchema) {
        const response: ApiResponse = {
          success: false,
          error: 'Schemat badawczy nie istnieje'
        };
        res.status(400).json(response);
        return;
      }

      const study = await prisma.study.create({
        data: {
          title,
          description,
          researchSchemaId,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null
        },
        include: {
          researchSchema: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });

      const response: ApiResponse = {
        success: true,
        data: study,
        message: 'Badanie zostało utworzone'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating study:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się utworzyć badania'
      };
      res.status(500).json(response);
    }
  }

  // Aktualizuj badanie
  async updateStudy(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: ApiResponse = {
          success: false,
          error: 'Nieprawidłowe dane',
          details: errors.array()
        };
        res.status(400).json(response);
        return;
      }

      const { id } = req.params;
      const { title, description, status, startDate, endDate }: UpdateStudyDto = req.body;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) updateData.status = status;
      if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
      if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;

      const study = await prisma.study.update({
        where: { id },
        data: updateData,
        include: {
          researchSchema: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });

      const response: ApiResponse = {
        success: true,
        data: study,
        message: 'Badanie zostało zaktualizowane'
      };

      res.json(response);
    } catch (error: any) {
      if (error.code === 'P2025') {
        const response: ApiResponse = {
          success: false,
          error: 'Badanie nie zostało znalezione'
        };
        res.status(404).json(response);
        return;
      }

      console.error('Error updating study:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się zaktualizować badania'
      };
      res.status(500).json(response);
    }
  }

  // Usuń badanie
  async deleteStudy(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await prisma.study.delete({
        where: { id }
      });

      const response: ApiResponse = {
        success: true,
        message: 'Badanie zostało usunięte'
      };

      res.json(response);
    } catch (error: any) {
      if (error.code === 'P2025') {
        const response: ApiResponse = {
          success: false,
          error: 'Badanie nie zostało znalezione'
        };
        res.status(404).json(response);
        return;
      }

      console.error('Error deleting study:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się usunąć badania'
      };
      res.status(500).json(response);
    }
  }

  // Zmień status badania
  async updateStudyStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status }: { status: StudyStatus } = req.body;

      const validStatuses: StudyStatus[] = ['DRAFT', 'ACTIVE', 'COMPLETED', 'PAUSED'];
      if (!validStatuses.includes(status)) {
        const response: ApiResponse = {
          success: false,
          error: 'Nieprawidłowy status badania'
        };
        res.status(400).json(response);
        return;
      }

      const study = await prisma.study.update({
        where: { id },
        data: { status },
        include: {
          researchSchema: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });

      const response: ApiResponse = {
        success: true,
        data: study,
        message: `Status badania został zmieniony na ${status}`
      };

      res.json(response);
    } catch (error: any) {
      if (error.code === 'P2025') {
        const response: ApiResponse = {
          success: false,
          error: 'Badanie nie zostało znalezione'
        };
        res.status(404).json(response);
        return;
      }

      console.error('Error updating study status:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się zmienić statusu badania'
      };
      res.status(500).json(response);
    }
  }
}

export default new StudyController();

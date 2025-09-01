import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { 
  RequestWithPrisma, 
  CreateResearchSchemaDto, 
  UpdateResearchSchemaDto, 
  ApiResponse,
  serializeQuestions,
  deserializeQuestions
} from '../types';

const prisma = new PrismaClient();

class ResearchSchemaController {
  // Pobierz wszystkie schematy badawcze
  async getAllSchemas(req: Request, res: Response): Promise<void> {
    try {
      const schemas = await prisma.researchSchema.findMany({
        include: {
          studies: {
            select: {
              id: true,
              title: true,
              status: true,
              createdAt: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Deserializuj questions dla każdego schematu
      const schemasWithQuestions = schemas.map((schema: any) => ({
        ...schema,
        questions: deserializeQuestions(schema.questions)
      }));

      const response: ApiResponse = {
        success: true,
        data: schemasWithQuestions
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching research schemas:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się pobrać schematów badawczych'
      };
      res.status(500).json(response);
    }
  }

  // Pobierz pojedynczy schemat
  async getSchemaById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const schema = await prisma.researchSchema.findUnique({
        where: { id },
        include: {
          studies: true
        }
      });

      if (!schema) {
        const response: ApiResponse = {
          success: false,
          error: 'Schemat badawczy nie został znaleziony'
        };
        res.status(404).json(response);
        return;
      }

      // Deserializuj questions
      const schemaWithQuestions = {
        ...schema,
        questions: deserializeQuestions(schema.questions)
      };

      const response: ApiResponse = {
        success: true,
        data: schemaWithQuestions
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching research schema:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się pobrać schematu badawczego'
      };
      res.status(500).json(response);
    }
  }

  // Utwórz nowy schemat
  async createSchema(req: Request, res: Response): Promise<void> {
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

      const { title, description, questions }: CreateResearchSchemaDto = req.body;

      const schema = await prisma.researchSchema.create({
        data: {
          title,
          description,
          questions: serializeQuestions(questions)
        }
      });

      // Deserializuj questions dla odpowiedzi
      const schemaWithQuestions = {
        ...schema,
        questions: deserializeQuestions(schema.questions)
      };

      const response: ApiResponse = {
        success: true,
        data: schemaWithQuestions,
        message: 'Schemat badawczy został utworzony'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating research schema:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się utworzyć schematu badawczego'
      };
      res.status(500).json(response);
    }
  }

  // Aktualizuj schemat
  async updateSchema(req: Request, res: Response): Promise<void> {
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
      const { title, description, questions }: UpdateResearchSchemaDto = req.body;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (questions !== undefined) updateData.questions = serializeQuestions(questions);

      const schema = await prisma.researchSchema.update({
        where: { id },
        data: updateData
      });

      // Deserializuj questions dla odpowiedzi
      const schemaWithQuestions = {
        ...schema,
        questions: deserializeQuestions(schema.questions)
      };

      const response: ApiResponse = {
        success: true,
        data: schemaWithQuestions,
        message: 'Schemat badawczy został zaktualizowany'
      };

      res.json(response);
    } catch (error: any) {
      if (error.code === 'P2025') {
        const response: ApiResponse = {
          success: false,
          error: 'Schemat badawczy nie został znaleziony'
        };
        res.status(404).json(response);
        return;
      }

      console.error('Error updating research schema:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się zaktualizować schematu badawczego'
      };
      res.status(500).json(response);
    }
  }

  // Usuń schemat
  async deleteSchema(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await prisma.researchSchema.delete({
        where: { id }
      });

      const response: ApiResponse = {
        success: true,
        message: 'Schemat badawczy został usunięty'
      };

      res.json(response);
    } catch (error: any) {
      if (error.code === 'P2025') {
        const response: ApiResponse = {
          success: false,
          error: 'Schemat badawczy nie został znaleziony'
        };
        res.status(404).json(response);
        return;
      }

      console.error('Error deleting research schema:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się usunąć schematu badawczego'
      };
      res.status(500).json(response);
    }
  }
}

export default new ResearchSchemaController();

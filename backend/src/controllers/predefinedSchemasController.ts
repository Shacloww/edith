import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import predefinedSchemas from '../data/predefinedSchemas';
import { RequestWithPrisma, ApiResponse, serializeQuestions } from '../types';

const prisma = new PrismaClient();

class PredefinedSchemasController {
  // Pobierz listę predefiniowanych schematów
  async getPredefinedSchemas(req: Request, res: Response): Promise<void> {
    try {
      const response: ApiResponse = {
        success: true,
        data: predefinedSchemas,
        message: `Dostępne predefiniowane schematy: ${predefinedSchemas.length}`
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching predefined schemas:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się pobrać predefiniowanych schematów'
      };
      res.status(500).json(response);
    }
  }

  // Importuj konkretny predefiniowany schemat do bazy danych
  async importPredefinedSchema(req: Request, res: Response): Promise<void> {
    try {
      const { index } = req.params;
      const schemaIndex = parseInt(index);

      if (schemaIndex < 0 || schemaIndex >= predefinedSchemas.length) {
        const response: ApiResponse = {
          success: false,
          error: 'Nieprawidłowy indeks schematu'
        };
        res.status(400).json(response);
        return;
      }

      const schemaTemplate = predefinedSchemas[schemaIndex];

      // Sprawdź czy schemat już istnieje
      const existingSchema = await prisma.researchSchema.findFirst({
        where: {
          title: schemaTemplate.title
        }
      });

      if (existingSchema) {
        const response: ApiResponse = {
          success: false,
          error: 'Schemat o tej nazwie już istnieje w bazie danych',
          data: existingSchema
        };
        res.status(409).json(response);
        return;
      }

      // Importuj schemat do bazy danych
      const newSchema = await prisma.researchSchema.create({
        data: {
          title: schemaTemplate.title,
          description: schemaTemplate.description,
          questions: serializeQuestions(schemaTemplate.questions)
        }
      });

      const response: ApiResponse = {
        success: true,
        data: newSchema,
        message: 'Schemat został pomyślnie zaimportowany'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error importing predefined schema:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się zaimportować schematu'
      };
      res.status(500).json(response);
    }
  }

  // Importuj wszystkie predefiniowane schematy do bazy danych
  async importAllPredefinedSchemas(req: Request, res: Response): Promise<void> {
    try {
      const importedSchemas = [];
      const skippedSchemas = [];

      for (let i = 0; i < predefinedSchemas.length; i++) {
        const schemaTemplate = predefinedSchemas[i];

        // Sprawdź czy schemat już istnieje
        const existingSchema = await prisma.researchSchema.findFirst({
          where: {
            title: schemaTemplate.title
          }
        });

        if (existingSchema) {
          skippedSchemas.push({
            title: schemaTemplate.title,
            reason: 'Already exists'
          });
          continue;
        }

        // Importuj schemat
        const newSchema = await prisma.researchSchema.create({
          data: {
            title: schemaTemplate.title,
            description: schemaTemplate.description,
            questions: serializeQuestions(schemaTemplate.questions)
          }
        });

        importedSchemas.push(newSchema);
      }

      const response: ApiResponse = {
        success: true,
        data: {
          imported: importedSchemas,
          skipped: skippedSchemas,
          importedCount: importedSchemas.length,
          skippedCount: skippedSchemas.length,
          totalProcessed: predefinedSchemas.length
        },
        message: `Zaimportowano ${importedSchemas.length} z ${predefinedSchemas.length} schematów`
      };

      res.json(response);
    } catch (error) {
      console.error('Error importing all predefined schemas:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się zaimportować schematów'
      };
      res.status(500).json(response);
    }
  }

  // Pobierz konkretny predefiniowany schemat według indeksu
  async getPredefinedSchemaByIndex(req: Request, res: Response): Promise<void> {
    try {
      const { index } = req.params;
      const schemaIndex = parseInt(index);

      if (schemaIndex < 0 || schemaIndex >= predefinedSchemas.length) {
        const response: ApiResponse = {
          success: false,
          error: 'Nieprawidłowy indeks schematu'
        };
        res.status(400).json(response);
        return;
      }

      const schema = predefinedSchemas[schemaIndex];

      const response: ApiResponse = {
        success: true,
        data: schema
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching predefined schema:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Nie udało się pobrać schematu'
      };
      res.status(500).json(response);
    }
  }
}

export default new PredefinedSchemasController();

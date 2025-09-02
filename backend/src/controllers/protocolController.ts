import { Response, NextFunction, Request } from 'express';
import { CreateProtocolDto, UpdateProtocolDto, ApiResponse, ProtocolType } from '../types';
import { ResearchProtocols, getProtocolById, getAllProtocols, getProtocolCategories } from '../data/research-protocols';

/**
 * Pobierz wszystkie protokoły (predefined + user created)
 */
export const getProtocols = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Pobierz predefiniowane protokoły
    const predefinedProtocols = getAllProtocols();
    
    // Pobierz protokoły użytkowników z bazy danych
    const prisma = (req as any).prisma;
    const userProtocols = await prisma.protocol.findMany({
      where: { type: ProtocolType.USER },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        steps: {
          include: {
            dataPoints: true
          }
        },
        testConditions: true,
        calculations: true,
        typicalValues: true,
        commonIssues: true
      }
    });

    // Przekształć predefiniowane protokoły do jednolitego formatu
    const formattedPredefined = predefinedProtocols.map(protocol => ({
      id: protocol.id,
      title: protocol.title,
      description: protocol.description,
      category: protocol.category,
      type: 'PREDEFINED' as ProtocolType,
      difficulty: protocol.difficulty,
      estimatedDuration: protocol.estimatedDuration,
      version: protocol.version || '1.0',
      overview: protocol.overview,
      equipment: protocol.equipment,
      materials: protocol.materials,
      safetyGuidelines: protocol.safetyGuidelines,
      references: protocol.references,
      notes: protocol.notes,
      isPublic: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    const allProtocols = [...formattedPredefined, ...userProtocols];

    res.status(200).json({
      success: true,
      data: allProtocols
    });
  } catch (error) {
    console.error('Error fetching protocols:', error);
    next(error);
  }
};

/**
 * Pobierz protokół po ID
 */
export const getProtocolByIdController = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Sprawdź czy to predefiniowany protokół
    const predefinedProtocol = getProtocolById(id);
    if (predefinedProtocol) {
      res.status(200).json({
        success: true,
        data: {
          id: predefinedProtocol.id,
          title: predefinedProtocol.title,
          description: predefinedProtocol.description,
          category: predefinedProtocol.category,
          type: 'PREDEFINED' as ProtocolType,
          difficulty: predefinedProtocol.difficulty,
          estimatedDuration: predefinedProtocol.estimatedDuration,
          version: predefinedProtocol.version || '1.0',
          overview: predefinedProtocol.overview,
          equipment: predefinedProtocol.equipment,
          materials: predefinedProtocol.materials,
          safetyGuidelines: predefinedProtocol.safetyGuidelines,
          testConditions: predefinedProtocol.testConditions,
          steps: predefinedProtocol.steps,
          calculations: predefinedProtocol.calculations,
          acceptanceCriteria: predefinedProtocol.acceptanceCriteria,
          commonIssues: predefinedProtocol.commonIssues,
          typicalValues: predefinedProtocol.typicalValues,
          references: predefinedProtocol.references,
          notes: predefinedProtocol.notes,
          isPublic: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });
      return;
    }

    // Szukaj w bazie danych
    const prisma = (req as any).prisma;
    const protocol = await prisma.protocol.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        steps: {
          include: {
            dataPoints: true
          },
          orderBy: { stepNumber: 'asc' }
        },
        testConditions: true,
        calculations: true,
        typicalValues: true,
        commonIssues: true
      }
    });

    if (!protocol) {
      res.status(404).json({
        success: false,
        error: 'Protocol not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: protocol
    });
  } catch (error) {
    console.error('Error fetching protocol:', error);
    next(error);
  }
};

/**
 * Pobierz protokoły według kategorii
 */
export const getProtocolsByCategory = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { category } = req.params;

    // Pobierz predefiniowane protokoły dla tej kategorii
    const predefinedProtocols = getAllProtocols().filter(p => p.category === category);
    
    // Pobierz protokoły użytkowników z bazy danych
    const prisma = (req as any).prisma;
    const userProtocols = await prisma.protocol.findMany({
      where: { 
        category: category,
        type: ProtocolType.USER 
      },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    });

    // Przekształć predefiniowane protokoły
    const formattedPredefined = predefinedProtocols.map(protocol => ({
      id: protocol.id,
      title: protocol.title,
      description: protocol.description,
      category: protocol.category,
      type: 'PREDEFINED' as ProtocolType,
      difficulty: protocol.difficulty,
      estimatedDuration: protocol.estimatedDuration,
      isPublic: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    const allProtocols = [...formattedPredefined, ...userProtocols];

    res.status(200).json({
      success: true,
      data: allProtocols
    });
  } catch (error) {
    console.error('Error fetching protocols by category:', error);
    next(error);
  }
};

/**
 * Pobierz dostępne kategorie protokołów
 */
export const getProtocolCategoriesController = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Kategorie z predefiniowanych protokołów
    const predefinedCategories = getProtocolCategories();
    
    // Kategorie z protokołów użytkowników
    const prisma = (req as any).prisma;
    const userCategories = await prisma.protocol.findMany({
      select: { category: true },
      distinct: ['category'],
      where: { type: ProtocolType.USER }
    }).then((results: any) => results.map((r: any) => r.category));

    // Połącz i usuń duplikaty
    const allCategories = [...new Set([...predefinedCategories, ...userCategories])];

    res.status(200).json({
      success: true,
      data: allCategories
    });
  } catch (error) {
    console.error('Error fetching protocol categories:', error);
    next(error);
  }
};

/**
 * Utwórz nowy protokół użytkownika
 */
export const createProtocol = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const data: CreateProtocolDto = req.body;
    const userId = req.body.createdBy; // Załóżmy że to przychodzi z middleware auth
    const prisma = (req as any).prisma;

    // Tworzenie protokołu w transakcji
    const protocol = await prisma.$transaction(async (tx: any) => {
      // Tworzenie głównego protokołu
      const newProtocol = await tx.protocol.create({
        data: {
          title: data.title,
          description: data.description,
          category: data.category,
          type: ProtocolType.USER,
          difficulty: data.difficulty,
          estimatedDuration: data.estimatedDuration,
          overview: data.overview,
          equipment: data.equipment,
          materials: data.materials,
          safetyGuidelines: data.safetyGuidelines,
          references: data.references,
          notes: data.notes,
          createdBy: userId,
          isPublic: false // Domyślnie prywatny
        }
      });

      // Dodanie kroków protokołu
      if (data.steps && data.steps.length > 0) {
        await Promise.all(data.steps.map((step, index) => 
          tx.protocolStep.create({
            data: {
              protocolId: newProtocol.id,
              stepNumber: index + 1,
              title: step.title,
              description: step.description,
              duration: step.duration,
              instructions: step.instructions,
              tips: step.tips,
              safety: step.safety
            }
          })
        ));
      }

      // Dodanie warunków testowych
      if (data.testConditions) {
        // Przekształć testConditions do formatu bazy danych
        // (to zależy od struktury danych w testConditions)
      }

      return newProtocol;
    });

    res.status(201).json({
      success: true,
      data: protocol,
      message: 'Protocol created successfully'
    });
  } catch (error) {
    console.error('Error creating protocol:', error);
    next(error);
  }
};

/**
 * Zaktualizuj protokół użytkownika
 */
export const updateProtocol = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const data: UpdateProtocolDto = req.body;
    const userId = req.body.updatedBy; // Z middleware auth
    const prisma = (req as any).prisma;

    // Sprawdź czy protokół istnieje i czy user ma uprawnienia
    const existingProtocol = await prisma.protocol.findUnique({
      where: { id },
      select: { createdBy: true, type: true }
    });

    if (!existingProtocol) {
      res.status(404).json({
        success: false,
        error: 'Protocol not found'
      });
      return;
    }

    if (existingProtocol.type === ProtocolType.PREDEFINED) {
      res.status(403).json({
        success: false,
        error: 'Cannot modify predefined protocols'
      });
      return;
    }

    if (existingProtocol.createdBy !== userId) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
      return;
    }

    // Aktualizacja w transakcji
    const updatedProtocol = await prisma.$transaction(async (tx: any) => {
      const protocol = await tx.protocol.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          category: data.category,
          difficulty: data.difficulty,
          estimatedDuration: data.estimatedDuration,
          overview: data.overview,
          equipment: data.equipment,
          materials: data.materials,
          safetyGuidelines: data.safetyGuidelines,
          references: data.references,
          notes: data.notes
        }
      });

      // Aktualizacja kroków jeśli podane
      if (data.steps) {
        // Usuń stare kroki
        await tx.protocolStep.deleteMany({
          where: { protocolId: id }
        });

        // Dodaj nowe kroki
        await Promise.all(data.steps.map((step, index) => 
          tx.protocolStep.create({
            data: {
              protocolId: id,
              stepNumber: index + 1,
              title: step.title,
              description: step.description,
              duration: step.duration,
              instructions: step.instructions,
              tips: step.tips,
              safety: step.safety
            }
          })
        ));
      }

      return protocol;
    });

    res.status(200).json({
      success: true,
      data: updatedProtocol,
      message: 'Protocol updated successfully'
    });
  } catch (error) {
    console.error('Error updating protocol:', error);
    next(error);
  }
};

/**
 * Usuń protokół użytkownika
 */
export const deleteProtocol = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.body.deletedBy; // Z middleware auth
    const prisma = (req as any).prisma;

    // Sprawdź czy protokół istnieje i czy user ma uprawnienia
    const existingProtocol = await prisma.protocol.findUnique({
      where: { id },
      select: { createdBy: true, type: true }
    });

    if (!existingProtocol) {
      res.status(404).json({
        success: false,
        error: 'Protocol not found'
      });
      return;
    }

    if (existingProtocol.type === ProtocolType.PREDEFINED) {
      res.status(403).json({
        success: false,
        error: 'Cannot delete predefined protocols'
      });
      return;
    }

    if (existingProtocol.createdBy !== userId) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
      return;
    }

    // Usuń protokół (kaskadowo usuną się powiązane dane)
    await prisma.protocol.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Protocol deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting protocol:', error);
    next(error);
  }
};

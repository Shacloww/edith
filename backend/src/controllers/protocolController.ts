import { Request, Response } from 'express';
import { ResearchProtocols, getProtocolById as getProtocol, getProtocolsByCategory, getAllProtocols, getProtocolCategories } from '../data/research-protocols';

// GET /api/protocols - Pobierz wszystkie protokoły
export const getProtocols = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    let protocols;
    if (category && typeof category === 'string') {
      protocols = getProtocolsByCategory(category);
    } else {
      protocols = getAllProtocols();
    }

    res.json({
      success: true,
      data: protocols,
      count: protocols.length
    });
  } catch (error) {
    console.error('Error fetching protocols:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd podczas pobierania protokołów badawczych'
    });
  }
};

// GET /api/protocols/:id - Pobierz konkretny protokół
export const getProtocolByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const protocol = getProtocol(id);

    if (!protocol) {
      return res.status(404).json({
        success: false,
        error: 'Protokół nie został znaleziony'
      });
    }

    res.json({
      success: true,
      data: protocol
    });
  } catch (error) {
    console.error('Error fetching protocol:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd podczas pobierania protokołu'
    });
  }
};

// GET /api/protocols/categories - Pobierz kategorie protokołów
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = getProtocolCategories();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd podczas pobierania kategorii'
    });
  }
};

// GET /api/protocols/:id/steps - Pobierz kroki konkretnego protokołu
export const getProtocolSteps = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const protocol = getProtocol(id);

    if (!protocol) {
      return res.status(404).json({
        success: false,
        error: 'Protokół nie został znaleziony'
      });
    }

    res.json({
      success: true,
      data: protocol.steps
    });
  } catch (error) {
    console.error('Error fetching protocol steps:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd podczas pobierania kroków protokołu'
    });
  }
};

// GET /api/protocols/:id/step/:stepId - Pobierz konkretny krok protokołu
export const getProtocolStep = async (req: Request, res: Response) => {
  try {
    const { id, stepId } = req.params;
    const protocol = getProtocol(id);

    if (!protocol) {
      return res.status(404).json({
        success: false,
        error: 'Protokół nie został znaleziony'
      });
    }

    const step = protocol.steps.find(s => s.id === stepId);
    if (!step) {
      return res.status(404).json({
        success: false,
        error: 'Krok protokołu nie został znaleziony'
      });
    }

    res.json({
      success: true,
      data: step
    });
  } catch (error) {
    console.error('Error fetching protocol step:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd podczas pobierania kroku protokołu'
    });
  }
};

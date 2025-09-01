import { Router } from 'express';
import { 
  getProtocols, 
  getProtocolByIdController, 
  getCategories, 
  getProtocolSteps, 
  getProtocolStep 
} from '../controllers/protocolController';

const router = Router();

// GET /api/protocols/categories - Pobierz kategorie protokołów (musi być przed /:id)
router.get('/categories', getCategories);

// GET /api/protocols - Pobierz wszystkie protokoły (z opcjonalnym filtrem kategorii)
router.get('/', getProtocols);

// GET /api/protocols/:id - Pobierz konkretny protokół
router.get('/:id', getProtocolByIdController);

// GET /api/protocols/:id/steps - Pobierz kroki konkretnego protokołu
router.get('/:id/steps', getProtocolSteps);

// GET /api/protocols/:id/step/:stepId - Pobierz konkretny krok protokołu
router.get('/:id/step/:stepId', getProtocolStep);

export default router;

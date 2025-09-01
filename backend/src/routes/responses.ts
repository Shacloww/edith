import express, { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';
import responseController from '../controllers/responseController';

const router: Router = express.Router();

// Walidatory
const createResponseValidation = [
  body('studyId')
    .notEmpty()
    .withMessage('ID badania jest wymagane'),
  body('answers')
    .isObject()
    .withMessage('Odpowiedzi muszą być obiektem')
];

const getResponseValidation = [
  param('id').isString().withMessage('ID musi być stringiem')
];

const getResponsesByStudyValidation = [
  param('studyId').isString().withMessage('ID badania musi być stringiem')
];

const getStatisticsValidation = [
  param('studyId').isString().withMessage('ID badania musi być stringiem')
];

// Routes
router.get('/study/:studyId', getResponsesByStudyValidation, (req: Request, res: Response) => responseController.getResponsesByStudy(req, res));
router.get('/study/:studyId/statistics', getStatisticsValidation, (req: Request, res: Response) => responseController.getStudyStatistics(req, res));
router.get('/:id', getResponseValidation, (req: Request, res: Response) => responseController.getResponseById(req, res));
router.post('/', createResponseValidation, (req: Request, res: Response) => responseController.createResponse(req, res));
router.delete('/:id', getResponseValidation, (req: Request, res: Response) => responseController.deleteResponse(req, res));

export default router;

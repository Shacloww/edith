import express, { Router } from 'express';
import { body, param } from 'express-validator';
import studyController from '../controllers/studyController';

const router: Router = express.Router();

// Walidatory
const createStudyValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Tytuł musi mieć od 1 do 200 znaków'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Opis może mieć maksymalnie 1000 znaków'),
  body('researchSchemaId')
    .notEmpty()
    .withMessage('ID schematu badawczego jest wymagane'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Data rozpoczęcia musi być w formacie ISO 8601'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Data zakończenia musi być w formacie ISO 8601')
];

const updateStudyValidation = [
  param('id').isString().withMessage('ID musi być stringiem'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Tytuł musi mieć od 1 do 200 znaków'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Opis może mieć maksymalnie 1000 znaków'),
  body('status')
    .optional()
    .isIn(['DRAFT', 'ACTIVE', 'COMPLETED', 'PAUSED'])
    .withMessage('Nieprawidłowy status'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Data rozpoczęcia musi być w formacie ISO 8601'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Data zakończenia musi być w formacie ISO 8601')
];

const getStudyValidation = [
  param('id').isString().withMessage('ID musi być stringiem')
];

const updateStatusValidation = [
  param('id').isString().withMessage('ID musi być stringiem'),
  body('status')
    .isIn(['DRAFT', 'ACTIVE', 'COMPLETED', 'PAUSED'])
    .withMessage('Nieprawidłowy status')
];

// Routes
router.get('/', studyController.getAllStudies);
router.get('/:id', getStudyValidation, studyController.getStudyById);
router.post('/', createStudyValidation, studyController.createStudy);
router.put('/:id', updateStudyValidation, studyController.updateStudy);
router.patch('/:id/status', updateStatusValidation, studyController.updateStudyStatus);
router.delete('/:id', getStudyValidation, studyController.deleteStudy);

export default router;

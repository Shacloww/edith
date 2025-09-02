import express, { Router } from 'express';
import { body, param } from 'express-validator';
import { 
  getStudies, 
  getStudyById, 
  createStudy, 
  updateStudy, 
  deleteStudy 
} from '../controllers/studyController';

const router: Router = express.Router();

// Walidatory
const createStudyValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Nazwa musi mieć od 1 do 200 znaków'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Opis może mieć maksymalnie 1000 znaków'),
  body('protocolId')
    .notEmpty()
    .withMessage('ID protokołu jest wymagane'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Kategoria może mieć maksymalnie 100 znaków')
];

const updateStudyValidation = [
  param('id').isString().withMessage('ID musi być stringiem'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Nazwa musi mieć od 1 do 200 znaków'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Opis może mieć maksymalnie 1000 znaków'),
  body('status')
    .optional()
    .isIn(['DRAFT', 'ACTIVE', 'ARCHIVED', 'DELETED'])
    .withMessage('Nieprawidłowy status'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Kategoria może mieć maksymalnie 100 znaków')
];

const getStudyValidation = [
  param('id').isString().withMessage('ID musi być stringiem')
];

// Routes
router.get('/', getStudies);
router.get('/:id', getStudyValidation, getStudyById);
router.post('/', createStudyValidation, createStudy);
router.put('/:id', updateStudyValidation, updateStudy);
router.delete('/:id', getStudyValidation, deleteStudy);

export default router;

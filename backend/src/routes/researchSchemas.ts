import express, { Router } from 'express';
import { body, param } from 'express-validator';
import researchSchemaController from '../controllers/researchSchemaController';

const router: Router = express.Router();

// Walidatory
const createSchemaValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Tytuł musi mieć od 1 do 200 znaków'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Opis może mieć maksymalnie 1000 znaków'),
  body('questions')
    .isArray({ min: 1 })
    .withMessage('Schemat musi zawierać przynajmniej jedno pytanie'),
  body('questions.*.id')
    .notEmpty()
    .withMessage('Każde pytanie musi mieć ID'),
  body('questions.*.title')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Tytuł pytania musi mieć od 1 do 500 znaków'),
  body('questions.*.type')
    .isIn(['text', 'textarea', 'number', 'email', 'select', 'radio', 'checkbox', 'date'])
    .withMessage('Nieprawidłowy typ pytania'),
  body('questions.*.required')
    .isBoolean()
    .withMessage('Pole required musi być boolean')
];

const updateSchemaValidation = [
  param('id').isString().withMessage('ID musi być stringiem'),
  ...createSchemaValidation
];

const getSchemaValidation = [
  param('id').isString().withMessage('ID musi być stringiem')
];

// Routes
router.get('/', researchSchemaController.getAllSchemas);
router.get('/:id', getSchemaValidation, researchSchemaController.getSchemaById);
router.post('/', createSchemaValidation, researchSchemaController.createSchema);
router.put('/:id', updateSchemaValidation, researchSchemaController.updateSchema);
router.delete('/:id', getSchemaValidation, researchSchemaController.deleteSchema);

export default router;

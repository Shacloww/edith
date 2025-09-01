import express from 'express';
import { param } from 'express-validator';
import predefinedSchemasController from '../controllers/predefinedSchemasController';

const router = express.Router();

// Walidatory
const getSchemaByIndexValidation = [
  param('index').isInt({ min: 0 }).withMessage('Indeks musi być liczbą nieujemną')
];

// Routes
router.get('/', predefinedSchemasController.getPredefinedSchemas);
router.get('/:index', getSchemaByIndexValidation, predefinedSchemasController.getPredefinedSchemaByIndex);
router.post('/import/:index', getSchemaByIndexValidation, predefinedSchemasController.importPredefinedSchema);
router.post('/import-all', predefinedSchemasController.importAllPredefinedSchemas);

export default router;

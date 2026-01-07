import express from 'express';
import { uploadFile } from '../controllers/fileController.js';
import { processExcel, getAllRecords } from '../controllers/recordController.js';

const router = express.Router();

router.post('/files/upload', uploadFile);
router.post('/process-excel', processExcel);
router.get('/getAll', getAllRecords);

export default router;

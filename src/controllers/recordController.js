import xlsx from 'xlsx';
import { pool } from '../db.js';
import fs from 'fs';

export const processExcel = async (req, res) => {
  try {
    const { filePath } = req.body;
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(400).json({ error: 'File not found' });
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const validRecords = [];
    const invalidRecords = [];

    for (let row of data) {
      const { Id, Name, Age, Education } = row;
      if (!Id || !Name || !Age || !Education || Age <= 0) {
        invalidRecords.push(row);
        continue;
      }
      validRecords.push([Id, Name, Age, Education]);
    }

    const client = await pool.connect();
    for (let record of validRecords) {
      try {
        await client.query(
          'INSERT INTO records (excel_id, name, age, education) VALUES ($1,$2,$3,$4) ON CONFLICT (excel_id) DO NOTHING',
          record
        );
      } catch {
        invalidRecords.push(record);
      }
    }
    client.release();

    res.json({
      message: 'File processed',
      validCount: validRecords.length - invalidRecords.length,
      invalidCount: invalidRecords.length,
      invalidRecords,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllRecords = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { education } = req.query;

  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM records';
  const params = [];

  if (education) {
    params.push(education);
    query += ` WHERE education = $${params.length}`;
  }

  params.push(limit);
  query += ` ORDER BY id LIMIT $${params.length}`;

  params.push(offset);
  query += ` OFFSET $${params.length}`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

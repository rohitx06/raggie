import express from 'express';
import { queryAll, queryOne, executeInsert, executeUpdate } from '../db/index.js';

const router = express.Router();

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const settingsList = await queryAll('settings');
    const settingsObj = {};
    settingsList.forEach((s) => {
      settingsObj[s.key] = s.value;
    });
    res.json(settingsObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/settings
router.post('/', async (req, res) => {
  try {
    const updates = req.body || {};
    const now = new Date().toISOString();

    for (const [key, value] of Object.entries(updates)) {
      const existing = await queryOne('settings', (s) => s.key === key);
      if (existing) {
        await executeUpdate('settings', key, { value: String(value), updated_at: now });
      } else {
        await executeInsert('settings', { key, value: String(value), updated_at: now });
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

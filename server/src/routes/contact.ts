import { Router } from 'express';
import { db } from '../db';

const router = Router();

// POST /api/contact
router.post('/', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'សូមបំពេញឈ្មោះ អ៊ីមែល និងសាររបស់អ្នក' });
    }

    const saved = db.createContactMessage({
      name,
      email,
      phone: phone || '',
      subject: subject || 'សំណួរទូទៅ',
      message,
    });

    return res.status(201).json({
      message: 'សាររបស់អ្នកត្រូវបានផ្ញើរួចរាល់! ក្រុមការងារយើងខ្ញុំនឹងទាក់ទងទៅវិញក្នុងពេលឆាប់ៗ។',
      contact: saved,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to submit contact message' });
  }
});

export default router;

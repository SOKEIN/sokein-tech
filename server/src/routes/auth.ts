import { Router, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { authenticate, JWT_SECRET, type AuthenticatedRequest } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Helper to remove passwordHash from user object
function sanitizeUser(user: any) {
  const { passwordHash, ...safe } = user;
  return safe;
}

// POST /api/auth/register (protected by authLimiter)
router.post('/register', authLimiter, (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const cleanName = String(name || '').trim();
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';
    const cleanPhone = phone ? String(phone).trim() : '';

    if (!cleanName || (!cleanEmail && !cleanPhone) || !password) {
      return res.status(400).json({ error: 'សូមបំពេញឈ្មោះ និងលេខទូរសព្ទ ឬអ៊ីមែលរបស់អ្នក' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'ពាក្យសម្ងាត់ត្រូវតែយ៉ាងហោចណាស់ 6 តួអក្សរ' });
    }

    // Check if phone or email is already in use
    if (cleanPhone && db.getUserByPhone(cleanPhone)) {
      return res.status(400).json({ error: 'លេខទូរសព្ទនេះត្រូវបានចុះឈ្មោះរួចហើយ' });
    }

    if (cleanEmail && db.getUserByEmail(cleanEmail)) {
      return res.status(400).json({ error: 'អ៊ីមែលនេះត្រូវបានចុះឈ្មោះរួចហើយ' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const fallbackEmail = cleanEmail || `${cleanPhone.replace(/\D/g, '')}@phone.esokein`;

    const newUser = db.createUser({
      name: cleanName,
      email: fallbackEmail,
      phone: cleanPhone,
      passwordHash,
      role: 'customer',
      avatar: '👤',
      address: {
        street: '',
        district: '',
        city: 'ភ្នំពេញ',
      },
    });

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '30d' });

    return res.status(201).json({
      message: 'បង្កើតគណនីបានជោគជ័យ',
      user: sanitizeUser(newUser),
      token,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

// POST /api/auth/login (protected by authLimiter)
router.post('/login', authLimiter, (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'សូមបញ្ចូលអ៊ីមែល ឬលេខទូរសព្ទ និងពាក្យសម្ងាត់' });
    }

    const user = db.getUserByEmail(String(email).trim());
    if (!user) {
      return res.status(401).json({ error: 'អ៊ីមែល/លេខទូរសព្ទ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'អ៊ីមែល/លេខទូរសព្ទ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

    return res.json({
      message: 'ចូលគណនីបានជោគជ័យ',
      user: sanitizeUser(user),
      token,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    user: sanitizeUser(req.user!),
  });
});

// PUT /api/auth/profile
router.put('/profile', authenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, phone, avatar, address } = req.body;
    const updated = db.updateUser(req.user!.id, {
      ...(name && { name }),
      ...(phone !== undefined && { phone }),
      ...(avatar && { avatar }),
      ...(address && { address }),
    });

    if (!updated) {
      return res.status(404).json({ error: 'រកមិនឃើញគណនី' });
    }

    return res.json({
      message: 'កែប្រែព័ត៌មានផ្ទាល់ខ្លួនបានជោគជ័យ',
      user: sanitizeUser(updated),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

// PUT /api/auth/password
router.put('/password', authenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'សូមបញ្ចូលពាក្យសម្ងាត់ចាស់ និងថ្មី' });
    }

    const isMatch = bcrypt.compareSync(currentPassword, req.user!.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'ពាក្យសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវ' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច 6 តួអក្សរ' });
    }

    const passwordHash = bcrypt.hashSync(newPassword, 10);
    db.updateUser(req.user!.id, { passwordHash });

    return res.json({ message: 'បានប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

export default router;

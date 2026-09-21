import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db, type User } from '../db';

export const JWT_SECRET = process.env.JWT_SECRET || 'esokein_super_secret_jwt_key_2026';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'ការចូលមិនត្រឹមត្រូវ (Unauthorized - No token provided)' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = db.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'គណនីមិនមានក្នុងប្រព័ន្ធ (User not found)' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token ផុតកំណត់ ឬមិនត្រឹមត្រូវ (Invalid or expired token)' });
  }
}

export function optionalAuthenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = db.getUserById(decoded.userId);
      if (user) {
        req.user = user;
      }
    } catch {
      // ignore
    }
  }
  next();
}

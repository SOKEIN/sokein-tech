import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './auth';

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'សូមចូលគណនីជាមុនសិន (Unauthorized)' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'អ្នកមិនមានសិទ្ធិជា Admin ទេ (Forbidden: Admin role required)' });
  }

  next();
}

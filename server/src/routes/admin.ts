import { Router, type Response } from 'express';
import { db } from '../db';
import { authenticate, type AuthenticatedRequest } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

// Apply auth & admin verification to all admin routes
router.use(authenticate);
router.use(requireAdmin);

// Helper to remove passwordHash
function sanitizeUser(user: any) {
  const { passwordHash, ...safe } = user;
  return safe;
}

// GET /api/admin/stats
router.get('/stats', (req: AuthenticatedRequest, res: Response) => {
  const users = db.getUsers();
  const orders = db.getOrders();
  const products = db.getProducts();

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  return res.json({
    totalUsers: users.length,
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders,
    deliveredOrders,
    totalProducts: products.length,
  });
});

// GET /api/admin/users
router.get('/users', (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = db.getUsers();
    const orders = db.getOrders();

    const usersWithStats = users.map(u => {
      const userOrders = orders.filter(o => o.userId === u.id || o.customerEmail === u.email);
      const userSpent = userOrders.reduce((sum, o) => sum + o.total, 0);

      return {
        ...sanitizeUser(u),
        ordersCount: userOrders.length,
        totalSpent: userSpent,
      };
    });

    return res.json({ users: usersWithStats });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch users' });
  }
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role } = req.body;
    const targetUserId = req.params.id;

    if (role !== 'admin' && role !== 'customer') {
      return res.status(400).json({ error: 'Invalid role. Must be admin or customer' });
    }

    if (targetUserId === 'usr_admin_root' && role !== 'admin') {
      return res.status(400).json({ error: 'មិនអាចដកសិទ្ធិពី Root Admin បានទេ' });
    }

    const updated = db.updateUser(targetUserId, { role });
    if (!updated) {
      return res.status(404).json({ error: 'រកមិនឃើញអ្នកប្រើប្រាស់នេះទេ' });
    }

    return res.json({
      message: 'បានផ្លាស់ប្តូរសិទ្ធិដោយជោគជ័យ',
      user: sanitizeUser(updated),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update user role' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const targetUserId = req.params.id;

    if (targetUserId === 'usr_admin_root' || targetUserId === req.user?.id) {
      return res.status(400).json({ error: 'មិនអាចលុបគណនីផ្ទាល់ខ្លួន ឬ Root Admin បានទេ' });
    }

    const deleted = db.deleteUser(targetUserId);
    if (!deleted) {
      return res.status(404).json({ error: 'រកមិនឃើញអ្នកប្រើប្រាស់នេះទេ' });
    }

    return res.json({ message: 'បានលុបអ្នកប្រើប្រាស់ជោគជ័យ' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to delete user' });
  }
});

// GET /api/admin/orders
router.get('/orders', (req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = db.getOrders();
    return res.json({ orders });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch orders' });
  }
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, note } = req.body;
    const orderId = req.params.id;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    const updated = db.updateOrderStatus(orderId, status, note);
    if (!updated) {
      return res.status(404).json({ error: 'រកមិនឃើញការបញ្ជាទិញនេះទេ' });
    }

    return res.json({
      message: 'បានកែប្រែស្ថានភាពការបញ្ជាទិញជោគជ័យ',
      order: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update order status' });
  }
});

// GET /api/admin/contacts
router.get('/contacts', (req: AuthenticatedRequest, res: Response) => {
  try {
    const messages = (db as any).data.contactMessages || [];
    return res.json({ messages });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch messages' });
  }
});

export default router;

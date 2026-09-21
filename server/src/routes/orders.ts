import { Router, type Response } from 'express';
import { db } from '../db';
import { authenticate, optionalAuthenticate, type AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// POST /api/orders (create order)
router.post('/', optionalAuthenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      paymentMethod = 'cod',
      items,
      subtotal,
      shippingFee = 0,
      discount = 0,
      total,
    } = req.body;

    if (!customerName || !customerPhone || !shippingAddress || !items || !items.length) {
      return res.status(400).json({ error: 'សូមបំពេញព័ត៌មានអតិថិជន និងទំនិញឱ្យបានត្រឹមត្រូវ' });
    }

    const userId = req.user?.id;

    const order = db.createOrder({
      userId,
      customerName,
      customerPhone,
      customerEmail: customerEmail || req.user?.email,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'khqr' ? 'paid' : 'pending',
      items,
      subtotal: subtotal || items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0),
      shippingFee,
      discount,
      total: total || (subtotal + shippingFee - discount),
      status: 'pending',
    });

    return res.status(201).json({
      message: 'ការបញ្ជាទិញទទួលបានជោគជ័យ!',
      order,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to place order' });
  }
});

// GET /api/orders/user (user's order history)
router.get('/user', authenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = db.getUserOrders(req.user!.id);
    return res.json({ orders });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch user orders' });
  }
});

// GET /api/orders/track/:orderNumber (tracking lookup)
router.get('/track/:orderNumber', (req, res) => {
  try {
    const orderNumber = req.params.orderNumber.trim().toUpperCase();
    const order = db.getOrderById(orderNumber);

    if (!order) {
      return res.status(404).json({ error: `មិនមានការបញ្ជាទិញលេខ #${orderNumber} នៅក្នុងប្រព័ន្ធទេ` });
    }

    return res.json({
      orderId: order.id,
      status: order.status,
      statusTextKh: order.statusTextKh,
      createdAt: order.createdAt,
      customerName: order.customerName,
      shippingAddress: order.shippingAddress,
      total: order.total,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      timeline: order.timeline,
      items: order.items,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to lookup tracking' });
  }
});

// GET /api/orders/:id (order details)
router.get('/:id', optionalAuthenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'រកមិនឃើញការបញ្ជាទិញនេះទេ' });
    }

    // If order has userId and requester is logged in as someone else
    if (order.userId && req.user && req.user.id !== order.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'គ្មានសិទ្ធិមើលការបញ្ជាទិញនេះទេ' });
    }

    return res.json({ order });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch order' });
  }
});

export default router;

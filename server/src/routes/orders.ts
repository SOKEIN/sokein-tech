import { Router, type Response } from 'express';
import { db, type OrderItem } from '../db';
import { authenticate, optionalAuthenticate, type AuthenticatedRequest } from '../middleware/auth';
import { orderLimiter } from '../middleware/rateLimiter';

const router = Router();

// Helper to mask customer name for public tracking
function maskName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return name.slice(0, 2) + '***';
  return `${parts[0]} ***`;
}

// Helper to mask shipping address for public tracking
function maskAddress(addr: string): string {
  const parts = addr.split(',');
  if (parts.length > 1) {
    return '***, ' + parts.slice(1).join(',').trim();
  }
  return '*** ' + addr.slice(-10);
}

// POST /api/orders (create order) - protected with rate limiter and server-side price recalculation
router.post('/', orderLimiter, optionalAuthenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      paymentMethod = 'cod',
      paymentSlip,
      transactionId,
      items,
    } = req.body;

    if (!customerName || !customerPhone || !shippingAddress || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'សូមបំពេញព័ត៌មានអតិថិជន និងទំនិញឱ្យបានត្រឹមត្រូវ' });
    }

    // Server-side validation: prevent price tampering by verifying against catalog products
    const verifiedItems: OrderItem[] = [];
    let calculatedSubtotal = 0;

    for (const rawItem of items) {
      const prodId = Number(rawItem.productId);
      const qty = Math.max(1, Math.min(99, Math.floor(Number(rawItem.quantity) || 1)));
      const catalogProduct = db.getProductById(prodId);

      if (!catalogProduct) {
        return res.status(400).json({ error: `រកមិនឃើញទំនិញលេខកូដ #${prodId} នៅក្នុងប្រព័ន្ធ` });
      }

      const itemPrice = catalogProduct.price;
      calculatedSubtotal += itemPrice * qty;

      verifiedItems.push({
        productId: catalogProduct.id,
        name: catalogProduct.name,
        price: itemPrice,
        quantity: qty,
        image: catalogProduct.images?.[0] || rawItem.image || '',
      });
    }

    // Verified shipping calculation: Free shipping promotion ($0)
    const calculatedShippingFee = 0;
    const discount = 0;
    const calculatedTotal = Number((calculatedSubtotal + calculatedShippingFee - discount).toFixed(2));

    const userId = req.user?.id;

    const order = db.createOrder({
      userId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail?.trim() || req.user?.email,
      shippingAddress: shippingAddress.trim(),
      paymentMethod,
      paymentStatus: paymentSlip ? 'paid' : (paymentMethod === 'khqr' ? 'pending' : 'pending'),
      paymentSlip: paymentSlip || undefined,
      transactionId: transactionId || undefined,
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      shippingFee: calculatedShippingFee,
      discount,
      total: calculatedTotal,
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

// GET /api/orders/track/:orderNumber (tracking lookup with PII protection)
router.get('/track/:orderNumber', optionalAuthenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const orderNumber = req.params.orderNumber.trim().toUpperCase();
    const order = db.getOrderById(orderNumber);

    if (!order) {
      return res.status(404).json({ error: `មិនមានការបញ្ជាទិញលេខ #${orderNumber} នៅក្នុងប្រព័ន្ធទេ` });
    }

    const isOwnerOrAdmin = req.user && (req.user.id === order.userId || req.user.role === 'admin');

    return res.json({
      orderId: order.id,
      status: order.status,
      statusTextKh: order.statusTextKh,
      createdAt: order.createdAt,
      customerName: isOwnerOrAdmin ? order.customerName : maskName(order.customerName),
      shippingAddress: isOwnerOrAdmin ? order.shippingAddress : maskAddress(order.shippingAddress),
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

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import contactRoutes from './routes/contact';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), service: 'E-SOKEIN API Server' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: `API route ${req.method} ${req.originalUrl} not found` });
});

// Serve built frontend assets in production
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath, {
  etag: false,
  maxAge: 0,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  },
}));

// SPA fallback: return index.html for all non-API web routes
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.originalUrl.startsWith('/api')) return next();
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 E-SOKEIN Backend Server running at http://localhost:${PORT}`);
  console.log(`📡 API Endpoints available at:`);
  console.log(`   - Auth:     http://localhost:${PORT}/api/auth`);
  console.log(`   - Products: http://localhost:${PORT}/api/products`);
  console.log(`   - Orders:   http://localhost:${PORT}/api/orders`);
  console.log(`   - Contact:  http://localhost:${PORT}/api/contact`);
  console.log(`   - Health:   http://localhost:${PORT}/api/health`);
});

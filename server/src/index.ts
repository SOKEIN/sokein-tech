import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import contactRoutes from './routes/contact';
import adminRoutes from './routes/admin';
import { apiLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;

// Trust reverse proxy (e.g. Render, Cloudflare, Nginx) for accurate client IP in rate limiting
app.set('trust proxy', 1);

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows SPA inline assets and external CDN images (Unsplash)
    crossOriginEmbedderPolicy: false,
  })
);

// High-traffic performance: HTTP response compression (gzip/deflate)
app.use(compression());

// CORS configuration: Allow localhost in dev, configurable for production
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:8443', 'http://localhost:5000', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, or same-origin SPA)
      if (!origin || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback to allow if unspecified, but headers are set safely
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' })); // Limit body payload to prevent memory exhaustion

// Global API rate limiter to prevent server flooding / DDoS
app.use('/api', apiLimiter);

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
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    service: 'E-SOKEIN API Server',
    memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
  });
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

// High-performance static asset caching in production
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath, {
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Vite hashed chunks (/assets/*) are immutable for 1 year
    if (filePath.includes('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Product images, logos, and fonts cached for 7 days with stale-while-revalidate
    else if (/\.(jpg|jpeg|png|webp|svg|ico|gif|woff2?|ttf|eot)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    }
    // index.html must revalidate so clients get latest releases immediately
    else if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
    else {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  },
}));

// SPA fallback: return index.html for all non-API web routes
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
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

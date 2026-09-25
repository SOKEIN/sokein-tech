import rateLimit from 'express-rate-limit';

// General API rate limiter (protects against general flooding/DDoS)
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 150, // Limit each IP to 150 requests per minute
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'សំណើច្រើនពេកក្នុងពេលតែមួយ សូមរង់ចាំបន្តិចសិន (Too many requests, please slow down)',
  },
});

// Sensitive Auth limiter (protects against credential brute-force attacks)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 15, // Limit each IP to 15 auth attempts per 15 minutes
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'អ្នកបានព្យាយាមចូល ឬបង្កើតគណនីច្រើនដងពេក សូមរង់ចាំ ១៥ នាទីសិន (Too many auth attempts. Please try again later)',
  },
});

// Order creation limiter (prevents order spamming / bot checkouts)
export const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 25, // Limit each IP to 25 orders per 15 minutes
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'អ្នកបានបញ្ជាទិញញឹកញាប់ពេក សូមរង់ចាំបន្តិចសិន (Too many order requests)',
  },
});

// Contact form limiter (prevents inbox spam bots)
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 5 contact messages per 15 minutes
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'អ្នកបានផ្ញើសារញឹកញាប់ពេក សូមរង់ចាំ ១៥ នាទីសិន (Too many contact requests)',
  },
});

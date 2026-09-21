import { Router } from 'express';
import { db } from '../db';

const router = Router();

// GET /api/products/categories
router.get('/categories', (req, res) => {
  const products = db.getProducts();
  const categoryMap = new Map<string, { category: string; categoryKh: string; count: number; image: string }>();

  products.forEach(p => {
    if (!categoryMap.has(p.category)) {
      categoryMap.set(p.category, {
        category: p.category,
        categoryKh: p.categoryKh,
        count: 0,
        image: p.image,
      });
    }
    categoryMap.get(p.category)!.count++;
  });

  res.json(Array.from(categoryMap.values()));
});

// GET /api/products/brands
router.get('/brands', (req, res) => {
  const products = db.getProducts();
  const brands = Array.from(new Set(products.map(p => p.brand))).sort();
  res.json(brands);
});

// GET /api/products/featured
router.get('/featured', (req, res) => {
  const products = db.getProducts();
  const featured = products.filter(p => p.isFeatured);
  res.json(featured);
});

// GET /api/products
router.get('/', (req, res) => {
  try {
    let list = [...db.getProducts()];
    const { category, brand, search, minPrice, maxPrice, inStock, isNew, isFeatured, sort, page = '1', limit = '50' } = req.query;

    // Filter by search
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.nameKh.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (category && typeof category === 'string' && category !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by brand
    if (brand && typeof brand === 'string' && brand !== 'all') {
      list = list.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }

    // Filter by price
    if (minPrice) {
      list = list.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      list = list.filter(p => p.price <= Number(maxPrice));
    }

    // Filter by boolean flags
    if (inStock === 'true') {
      list = list.filter(p => p.inStock);
    }
    if (isNew === 'true') {
      list = list.filter(p => p.isNew);
    }
    if (isFeatured === 'true') {
      list = list.filter(p => p.isFeatured);
    }

    // Sort
    if (sort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'discount') {
      list.sort((a, b) => b.discount - a.discount);
    } else if (sort === 'newest') {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    // Pagination
    const total = list.length;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = list.slice(startIndex, startIndex + limitNum);

    res.json({
      products: paginated,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch products' });
  }
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  const product = db.getProductById(id);
  if (!product) {
    return res.status(404).json({ error: 'រកមិនឃើញទំនិញនេះទេ (Product not found)' });
  }

  // Also find related products in the same category
  const related = db.getProducts()
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  res.json({
    product,
    related,
  });
});

export default router;

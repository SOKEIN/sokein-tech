import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { products as fallbackProducts, type Product } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();

  // Instant synchronous lookup so clicking to view renders in 0ms without blank spinner flashes
  const targetId = Number(id);
  const initialProduct = fallbackProducts.find(p => p.id === targetId) || null;
  const initialRelated = initialProduct
    ? fallbackProducts.filter(p => p.category === initialProduct.category && p.id !== initialProduct.id).slice(0, 4)
    : [];

  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [related, setRelated] = useState<Product[]>(initialRelated);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [error, setError] = useState('');

  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (!id) return;
    setSelectedImg(0);
    setQty(1);

    const local = fallbackProducts.find(p => p.id === Number(id));
    if (local) {
      setProduct(local);
      setRelated(fallbackProducts.filter(p => p.category === local.category && p.id !== local.id).slice(0, 4));
      setIsLoading(false);
      setError('');
    } else {
      setIsLoading(true);
    }

    // Silent background fetch to guarantee latest stock/prices without blocking UI rendering
    let isMounted = true;
    api.products
      .getById(id)
      .then(res => {
        if (!isMounted) return;
        setProduct(res.product);
        if (res.related && res.related.length > 0) {
          setRelated(res.related);
        }
        setIsLoading(false);
      })
      .catch(err => {
        if (!isMounted) return;
        console.warn('Backend sync notice:', err);
        if (!local) {
          setError(err.message || 'រកមិនឃើញទំនិញ');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="flex flex-col items-center justify-center text-blue-600 dark:text-blue-400">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
          <span className="font-bold text-sm text-slate-700 dark:text-slate-300">កំពុងផ្ទុកព័ត៌មានទំនិញ...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{error || 'រកមិនឃើញទំនិញ'}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">ទំនិញដែលអ្នកកំពុងស្វែងរកប្រហែលជាត្រូវបានលុប ឬមិនត្រឹមត្រូវ។</p>
        <Link to="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
          ត្រឡប់ទៅហាងទំនិញ
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'description', label: 'ការពិពណ៌នា' },
    { id: 'specs', label: 'លក្ខណៈបច្ចេកទេស' },
    { id: 'reviews', label: 'ការវាយតម្លៃ' },
    { id: 'shipping', label: 'ការដឹកជញ្ជូន និងការធានា' },
  ];

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 overflow-x-auto pb-1 whitespace-nowrap">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">ទំព័រដើម</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">ហាងទំនិញ</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{product.categoryKh}</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Image Gallery */}
        <div>
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 mb-3.5 shadow-xs">
            <img
              src={imagesList[selectedImg] || product.image}
              alt={product.name}
              loading="eager"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=450&fit=crop&auto=format';
              }}
              className="w-full h-72 sm:h-96 md:h-[450px] object-cover transition-opacity duration-200"
            />
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {imagesList.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedImg(i)}
                className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImg === i ? 'border-blue-600 dark:border-blue-500 scale-98 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=450&fit=crop&auto=format';
                  }}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1.5">{product.brand}</div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3 leading-tight">{product.nameKh || product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map(s => (
                <span
                  key={s}
                  className={`text-base ${s <= Math.round(product.rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{product.rating}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">({product.reviews} ការវាយតម្លៃ)</span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-xs mb-4 text-slate-500 dark:text-slate-400">
            <span>
              លេខកូដទំនិញ: <strong className="text-slate-800 dark:text-slate-200">KT-{product.id.toString().padStart(5, '0')}</strong>
            </span>
            <span>
              ស្ថានភាព: <strong className={product.inStock ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                {product.inStock ? '✓ មានក្នុងស្តុក' : '✗ អស់ពីស្តុក'}
              </strong>
            </span>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3 mb-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
            <span className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">${product.price.toLocaleString()}</span>
            <span className="text-sm sm:text-base font-bold text-slate-500 dark:text-slate-400">
              ≈ {(product.price * 4100).toLocaleString()} ៛
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-base sm:text-xl text-slate-400 dark:text-slate-600 line-through">${product.originalPrice.toLocaleString()}</span>
                <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-lg border border-rose-200/60 dark:border-rose-900/60">
                  បញ្ចុះ {product.discount}%
                </span>
              </>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">ជ្រើសរើសពណ៌</label>
              <div className="flex gap-2">
                {['ខ្មៅ', 'ស', 'ប្រាក់'].map(c => (
                  <button key={c} type="button" className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-2 text-xs font-bold hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer">
                    {c}
                  </button>
                ))}
              </div>
            </div>
            {product.specs?.RAM && (
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">ជ្រើសរើស RAM</label>
                <div className="flex gap-2">
                  {['8GB', '16GB', '32GB'].map(r => (
                    <button key={r} type="button" className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-2 text-xs font-bold hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer">
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">ចំនួន</label>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl w-fit overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-lg transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-slate-900 dark:text-white text-sm">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-lg transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <button
              type="button"
              onClick={() => product.inStock && addToCart(product, qty)}
              disabled={!product.inStock}
              className={`flex-1 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                product.inStock
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>🛒 បន្ថែមទៅកន្ត្រក</span>
            </button>
            <Link
              to="/checkout"
              onClick={() => addToCart(product, qty)}
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm sm:text-base bg-slate-950 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-center flex items-center justify-center shadow-md transition-colors"
            >
              ⚡ ទិញឥឡូវនេះ
            </Link>
          </div>
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            className={`w-full py-3 rounded-2xl border font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
              isWishlisted(product.id)
                ? 'border-rose-500 text-rose-500 bg-rose-50 dark:bg-rose-950/30'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-400 hover:text-rose-500 bg-white dark:bg-slate-900'
            }`}
          >
            ♥ {isWishlisted(product.id) ? 'បានបន្ថែមទៅចំណូលចិត្ត' : 'បន្ថែមទៅទំនិញដែលចូលចិត្ត'}
          </button>

          {/* Info cards */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mt-6">
            {[['🚚', 'ការដឹកជញ្ជូន', 'ដឹកជញ្ជូនដល់ផ្ទះ'], ['🛡️', 'ការធានា', product.specs?.['ការធានា'] || '1 ឆ្នាំ'], ['↩️', 'ប្ដូរ/មកវិញ', '30 ថ្ងៃ']].map(([icon, label, desc]) => (
              <div key={label} className="text-center p-3 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="text-lg sm:text-xl mb-1">{icon}</div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white">{label}</div>
                <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 mb-12 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200/80 dark:border-slate-800 overflow-x-auto bg-slate-50/50 dark:bg-slate-950/40">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 bg-white dark:bg-slate-900' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-5 sm:p-7">
          {activeTab === 'description' && (
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">{product.description}</p>
          )}
          {activeTab === 'specs' && product.specs && (
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="flex items-center gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 text-xs sm:text-sm">
                  <span className="w-40 font-bold text-slate-500 dark:text-slate-400">{key}</span>
                  <span className="text-slate-900 dark:text-white font-medium flex-1">{val}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {[
                { name: 'សុខ រ៉ានី', rating: 5, comment: 'ទំនិញល្អណាស់ ដឹកជញ្ជូនរហ័ស ផលិតផលសុទ្ធ 100%' },
                { name: 'ជា ដាវីន', rating: 4, comment: 'ព្រមព្រៀងនឹងការពណ៌នា តម្លៃសមរម្យ គុណភាពខ្ពស់' },
              ].map((r, i) => (
                <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center text-xs font-bold">
                      {r.name[0]}
                    </div>
                    <strong className="text-xs sm:text-sm text-slate-900 dark:text-white">{r.name}</strong>
                    <div className="flex ml-auto text-amber-400 text-xs">
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} className={s <= r.rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <p>🚚 <strong className="text-slate-900 dark:text-white">ដឹកជញ្ជូន:</strong> ២-៣ ថ្ងៃការងារ ក្នុងភ្នំពេញ, ៣-៥ ថ្ងៃក្រៅរាជធានី</p>
              <p>🛡️ <strong className="text-slate-900 dark:text-white">ការធានា:</strong> {product.specs?.['ការធានា'] || '1 ឆ្នាំ'} ការធានាផលិតផលផ្លូវការ</p>
              <p>↩️ <strong className="text-slate-900 dark:text-white">គោលការណ៍ប្ដូរ:</strong> ប្ដូរ/ត្រឡប់ក្នុងរយៈពេល ៣០ ថ្ងៃ</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="heavy-section-deferred">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6">ទំនិញដែលពាក់ព័ន្ធ</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

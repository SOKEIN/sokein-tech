import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError('');
    setSelectedImg(0);

    api.products
      .getById(id)
      .then(res => {
        setProduct(res.product);
        setRelated(res.related);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch product details:', err);
        setError(err.message || 'រកមិនឃើញទំនិញ');
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="flex flex-col items-center justify-center text-[#2563EB]">
          <span className="animate-spin text-4xl mb-3">⏳</span>
          <span className="font-medium text-sm">កំពុងផ្ទុកព័ត៌មានទំនិញ...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-[#1E293B] mb-2">{error || 'រកមិនឃើញទំនិញ'}</h2>
        <p className="text-sm text-[#64748B] mb-6">ទំនិញដែលអ្នកកំពុងស្វែងរកប្រហែលជាត្រូវបានលុប ឬមិនត្រឹមត្រូវ។</p>
        <Link to="/shop" className="bg-[#2563EB] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#1D4ED8]">
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#64748B] mb-6">
        <Link to="/" className="hover:text-[#2563EB]">ទំព័រដើម</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#2563EB]">ហាងទំនិញ</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-[#2563EB]">{product.categoryKh}</Link>
        <span>/</span>
        <span className="text-[#1E293B] font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 mb-12">
        {/* Image Gallery */}
        <div>
          <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC] mb-3">
            <img
              src={imagesList[selectedImg] || product.image}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=450&fit=crop&auto=format';
              }}
              className="w-full h-64 sm:h-80 md:h-96 object-cover"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {imagesList.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImg(i)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImg === i ? 'border-[#2563EB]' : 'border-[#E2E8F0]'
                }`}
              >
                <img
                  src={img}
                  alt=""
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
        <div>
          <div className="text-sm text-[#2563EB] font-semibold mb-1">{product.brand}</div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(s => (
                <span
                  key={s}
                  className={`text-lg ${s <= Math.round(product.rating) ? 'text-[#F59E0B]' : 'text-[#E2E8F0]'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-[#2563EB] font-medium">{product.rating}</span>
            <span className="text-sm text-[#64748B]">({product.reviews} ការវាយតម្លៃ)</span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm mb-4 text-[#64748B]">
            <span>
              លេខកូដទំនិញ: <strong className="text-[#1E293B]">KT-{product.id.toString().padStart(5, '0')}</strong>
            </span>
            <span>
              ស្ថានភាព: <strong className={product.inStock ? 'text-[#16A34A]' : 'text-[#DC2626]'}>
                {product.inStock ? 'មានក្នុងស្តុក' : 'អស់ពីស្តុក'}
              </strong>
            </span>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3 mb-6 pb-6 border-b border-[#E2E8F0]">
            <span className="text-3xl sm:text-4xl font-black text-[#2563EB]">${product.price}</span>
            <span className="text-sm sm:text-base font-bold text-slate-500">
              ≈ {(product.price * 4100).toLocaleString()} ៛
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-base sm:text-xl text-[#94A3B8] line-through">${product.originalPrice}</span>
                <span className="bg-[#FEF2F2] text-[#DC2626] text-xs sm:text-sm font-bold px-2 py-0.5 rounded-lg">
                  បញ្ចុះ {product.discount}%
                </span>
              </>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-semibold text-[#1E293B] block mb-2">ជ្រើសរើសពណ៌</label>
              <div className="flex gap-2">
                {['ខ្មៅ', 'ស', 'ប្រាក់'].map(c => (
                  <button key={c} className="border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm hover:border-[#2563EB] hover:text-[#2563EB]">
                    {c}
                  </button>
                ))}
              </div>
            </div>
            {product.specs?.RAM && (
              <div>
                <label className="text-sm font-semibold text-[#1E293B] block mb-2">ជ្រើសរើស RAM</label>
                <div className="flex gap-2">
                  {['8GB', '16GB', '32GB'].map(r => (
                    <button key={r} className="border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm hover:border-[#2563EB] hover:text-[#2563EB]">
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-[#1E293B] block mb-2">ចំនួន</label>
              <div className="flex items-center border border-[#E2E8F0] rounded-xl w-fit overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] text-lg"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold text-[#1E293B]">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] text-lg"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button
              onClick={() => addToCart(product, qty)}
              disabled={!product.inStock}
              className={`flex-1 py-3.5 rounded-xl font-semibold text-lg transition-colors ${
                product.inStock ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]' : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
              }`}
            >
              🛒 បន្ថែមទៅកន្ត្រក
            </button>
            <Link
              to="/checkout"
              onClick={() => addToCart(product, qty)}
              className="flex-1 py-3.5 rounded-xl font-semibold text-lg bg-[#0F172A] text-white hover:bg-[#1E293B] text-center"
            >
              ⚡ ទិញឥឡូវនេះ
            </Link>
          </div>
          <button
            onClick={() => toggleWishlist(product)}
            className={`w-full py-3 rounded-xl border font-medium text-sm transition-colors ${
              isWishlisted(product.id) ? 'border-red-500 text-red-500 bg-red-50' : 'border-[#E2E8F0] text-[#64748B] hover:border-red-400 hover:text-red-500'
            }`}
          >
            ♥ {isWishlisted(product.id) ? 'បានបន្ថែមទៅចំណូលចិត្ត' : 'បន្ថែមទៅទំនិញដែលចូលចិត្ត'}
          </button>

          {/* Info cards */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[['🚚', 'ការដឹកជញ្ជូន', 'ដឹកជញ្ជូនដល់ផ្ទះ'], ['🛡️', 'ការធានា', product.specs?.['ការធានា'] || '1 ឆ្នាំ'], ['↩️', 'ប្ដូរ/មកវិញ', '30 ថ្ងៃ']].map(([icon, label, desc]) => (
              <div key={label} className="text-center p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <div className="text-xl mb-1">{icon}</div>
                <div className="text-xs font-semibold text-[#1E293B]">{label}</div>
                <div className="text-xs text-[#64748B]">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] mb-10 shadow-sm">
        <div className="flex border-b border-[#E2E8F0] overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'text-[#2563EB] border-b-2 border-[#2563EB]' : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === 'description' && (
            <p className="text-[#64748B] leading-relaxed">{product.description}</p>
          )}
          {activeTab === 'specs' && product.specs && (
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="flex items-center gap-3 py-2 border-b border-[#F1F5F9]">
                  <span className="w-40 text-sm font-medium text-[#64748B]">{key}</span>
                  <span className="text-sm text-[#1E293B]">{val}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {[
                { name: 'សុខ រ៉ានី', rating: 5, comment: 'ទំនិញល្អណាស់ ដឹកជញ្ជូនរហ័ស' },
                { name: 'ជា ដាវីន', rating: 4, comment: 'ព្រមព្រៀងនឹងការពណ៌នា តម្លៃសមរម្យ' },
              ].map((r, i) => (
                <div key={i} className="border-b border-[#E2E8F0] pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-[#2563EB] rounded-full text-white flex items-center justify-center text-sm font-bold">
                      {r.name[0]}
                    </div>
                    <strong className="text-sm text-[#1E293B]">{r.name}</strong>
                    <div className="flex ml-auto">
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} className={`text-sm ${s <= r.rating ? 'text-[#F59E0B]' : 'text-[#E2E8F0]'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-[#64748B]">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="space-y-3 text-sm text-[#64748B]">
              <p>🚚 <strong className="text-[#1E293B]">ដឹកជញ្ជូន:</strong> ២-៣ ថ្ងៃការងារ ក្នុងភ្នំពេញ, ៣-៥ ថ្ងៃក្រៅរាជធានី</p>
              <p>🛡️ <strong className="text-[#1E293B]">ការធានា:</strong> {product.specs?.['ការធានា'] || '1 ឆ្នាំ'} ការធានាផលិតផល</p>
              <p>↩️ <strong className="text-[#1E293B]">គោលការណ៍ប្ដូរ:</strong> ប្ដូរ/ត្រឡប់ក្នុងរយៈពេល ៣០ ថ្ងៃ</p>
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-6">ទំនិញដែលពាក់ព័ន្ធ</h2>
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

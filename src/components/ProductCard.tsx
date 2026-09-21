import { Link } from 'react-router';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { HeartIcon, ShoppingBagIcon } from './Icons';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const wishlisted = isWishlisted(product.id);

  const currency = (typeof window !== 'undefined' && localStorage.getItem('esokein_currency')) || 'USD';
  const KHR_RATE = 4100;
  const formatPrice = (usd: number) => {
    if (currency === 'KHR') {
      return `${(usd * KHR_RATE).toLocaleString()} ៛`;
    }
    return `$${usd.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
      {/* Product Image & Badges */}
      <div className="relative overflow-hidden bg-slate-50 aspect-[4/3]">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=450&fit=crop&auto=format';
            }}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.isNew && (
            <span className="bg-emerald-500 text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold shadow-xs">
              ថ្មី
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-rose-500 text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold shadow-xs">
              -{product.discount}%
            </span>
          )}
          {!product.inStock && (
            <span className="bg-slate-800/90 backdrop-blur-xs text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold">
              អស់ស្តុក
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-2xl flex items-center justify-center shadow-md backdrop-blur-xs transition-all duration-200 cursor-pointer ${
            wishlisted
              ? 'bg-rose-500 text-white shadow-rose-500/30'
              : 'bg-white/90 text-slate-500 hover:bg-white hover:text-rose-500'
          }`}
          title={wishlisted ? 'ដកចេញពីទំនិញចូលចិត្ត' : 'ដាក់ចូលទំនិញចូលចិត្ត'}
        >
          <HeartIcon size={18} filled={wishlisted} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Brand & Category */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            {product.brand}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {product.categoryKh}
          </span>
        </div>

        {/* Title */}
        <Link to={`/product/${product.id}`} className="group-hover:text-blue-600 transition-colors">
          <h3 className="text-[15px] font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
            {product.nameKh || product.name}
          </h3>
        </Link>

        {/* Rating Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex text-amber-400 text-xs">
            {[1, 2, 3, 4, 5].map(s => (
              <span key={s}>{s <= Math.round(product.rating) ? '★' : '☆'}</span>
            ))}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            ({product.reviews})
          </span>
        </div>

        {/* Price Row */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between mb-3">
          <div>
            <div className="text-lg font-black text-slate-900 tracking-tight">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-xs text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          <div
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              product.inStock
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {product.inStock ? '✓ មានស្តុក' : '✗ អស់ស្តុក'}
          </div>
        </div>

        {/* Actions Button */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => product.inStock && addToCart(product)}
            disabled={!product.inStock}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              product.inStock
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBagIcon size={15} />
            <span>បន្ថែមទៅកន្ត្រក</span>
          </button>
          <Link
            to={`/product/${product.id}`}
            className="p-2.5 border border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-600 rounded-2xl transition-colors flex items-center justify-center"
            title="មើលលម្អិត"
          >
            <span className="text-sm font-bold">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

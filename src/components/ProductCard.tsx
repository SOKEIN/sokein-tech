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
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
      {/* Product Image & Badges */}
      <div className="relative overflow-hidden bg-slate-50 aspect-[4/3]">
        <Link
          to={`/product/${product.id}`}
          onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
          className="block w-full h-full"
        >
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
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 pointer-events-none">
          {product.isNew && (
            <span className="bg-emerald-500 text-white text-[9.5px] sm:text-[11px] px-2 py-0.5 rounded-full font-bold shadow-xs">
              ថ្មី
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-rose-500 text-white text-[9.5px] sm:text-[11px] px-2 py-0.5 rounded-full font-bold shadow-xs">
              -{product.discount}%
            </span>
          )}
          {!product.inStock && (
            <span className="bg-slate-800/90 backdrop-blur-xs text-white text-[9.5px] sm:text-[11px] px-2 py-0.5 rounded-full font-bold">
              អស់ស្តុក
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={`absolute top-2 sm:top-3 right-2 sm:right-3 w-7.5 h-7.5 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md backdrop-blur-xs transition-all duration-200 cursor-pointer ${
            wishlisted
              ? 'bg-rose-500 text-white shadow-rose-500/30'
              : 'bg-white/90 text-slate-500 hover:bg-white hover:text-rose-500'
          }`}
          title={wishlisted ? 'ដកចេញពីទំនិញចូលចិត្ត' : 'ដាក់ចូលទំនិញចូលចិត្ត'}
        >
          <HeartIcon size={16} filled={wishlisted} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-5 flex flex-col flex-1">
        {/* Brand & Category */}
        <div className="flex items-center justify-between gap-1.5 mb-1 sm:mb-1.5">
          <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-md truncate max-w-[90px]">
            {product.brand}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">
            {product.categoryKh}
          </span>
        </div>

        {/* Title */}
        <Link
          to={`/product/${product.id}`}
          onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
          className="group-hover:text-blue-600 transition-colors"
        >
          <h3 className="text-xs sm:text-[15px] font-bold text-slate-900 leading-snug line-clamp-2 mb-1.5 sm:mb-2">
            {product.nameKh || product.name}
          </h3>
        </Link>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-2 sm:mb-3">
          <div className="flex text-amber-400 text-[10px] sm:text-xs">
            {[1, 2, 3, 4, 5].map(s => (
              <span key={s}>{s <= Math.round(product.rating) ? '★' : '☆'}</span>
            ))}
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
            ({product.reviews})
          </span>
        </div>

        {/* Price Row */}
        <div className="mt-auto pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between mb-2.5 sm:mb-3">
          <div>
            <div className="text-sm sm:text-lg font-black text-slate-900 tracking-tight">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-[10px] sm:text-xs text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          <div
            className={`text-[9.5px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${
              product.inStock
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {product.inStock ? '✓ មានស្តុក' : '✗ អស់'}
          </div>
        </div>

        {/* Actions Button */}
        <div className="flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => product.inStock && addToCart(product)}
            disabled={!product.inStock}
            className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
              product.inStock
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/20'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBagIcon size={14} />
            <span>ដាក់កន្ត្រក</span>
          </button>
          <Link
            to={`/product/${product.id}`}
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
            className="p-2 sm:p-2.5 border border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-600 rounded-xl sm:rounded-2xl transition-colors flex items-center justify-center"
            title="មើលលម្អិត"
          >
            <span className="text-xs sm:text-sm font-bold">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

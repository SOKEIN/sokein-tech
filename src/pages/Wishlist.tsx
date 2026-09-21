import { Link } from 'react-router';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlist } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-[#64748B] mb-6">
        <Link to="/" className="hover:text-[#2563EB]">ទំព័រដើម</Link>
        <span>/</span>
        <span className="text-[#1E293B] font-medium">ទំនិញដែលចូលចិត្ត</span>
      </nav>

      <h1 className="text-2xl font-bold text-[#0F172A] mb-6">ទំនិញដែលខ្ញុំចូលចិត្ត ({wishlist.length})</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">❤️</div>
          <h2 className="text-xl font-bold text-[#1E293B] mb-2">អ្នកមិនទាន់បានរក្សាទំនិញណាមួយ</h2>
          <p className="text-[#64748B] mb-6">ចូលទៅហាងហើយបន្ថែមទំនិញដែលអ្នកចូលចិត្ត</p>
          <Link to="/shop" className="bg-[#2563EB] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#1D4ED8]">
            ចូលទៅហាងទំនិញ
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {wishlist.map(({ product }) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}

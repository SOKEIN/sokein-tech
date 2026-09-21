import { Link } from 'react-router';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const shipping = cartTotal > 50 ? 0 : 5;
  const discount = cartTotal > 100 ? Math.round(cartTotal * 0.05) : 0;
  const total = cartTotal + shipping - discount;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-[#1E293B] mb-2">កន្ត្រកទំនិញរបស់អ្នកទទេ</h2>
        <p className="text-[#64748B] mb-6">ចូលទៅមើលទំនិញ និងបន្ថែមទៅកន្ត្រក</p>
        <Link to="/shop" className="bg-[#2563EB] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#1D4ED8]">
          ចូលទៅហាងទំនិញ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-[#64748B] mb-6">
        <Link to="/" className="hover:text-[#2563EB]">ទំព័រដើម</Link>
        <span>/</span>
        <span className="text-[#1E293B] font-medium">កន្ត្រកទំនិញ</span>
      </nav>

      <h1 className="text-2xl font-bold text-[#0F172A] mb-6">កន្ត្រកទំនិញ ({cartItems.length})</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header row */}
          <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-semibold text-[#64748B] uppercase tracking-wide px-4">
            <div className="col-span-6">ទំនិញ</div>
            <div className="col-span-2 text-center">តម្លៃ</div>
            <div className="col-span-2 text-center">ចំនួន</div>
            <div className="col-span-2 text-center">សរុប</div>
          </div>

          {cartItems.map(({ product, quantity }) => (
            <div key={product.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
              <div className="flex items-center gap-4">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} className="w-20 h-16 object-cover rounded-xl bg-[#F8FAFC]" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[#2563EB] font-medium">{product.brand}</div>
                  <Link to={`/product/${product.id}`} className="text-sm font-semibold text-[#1E293B] hover:text-[#2563EB] line-clamp-1">{product.name}</Link>
                  <div className="text-sm text-[#2563EB] font-bold mt-1 md:hidden">${product.price}</div>
                </div>
                <div className="hidden md:block text-sm font-medium text-[#1E293B] text-center w-16">${product.price}</div>
                {/* Qty */}
                <div className="flex items-center border border-[#E2E8F0] rounded-xl overflow-hidden">
                  <button onClick={() => updateQuantity(product.id, quantity - 1)} className="w-8 h-8 flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC]">−</button>
                  <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                  <button onClick={() => updateQuantity(product.id, quantity + 1)} className="w-8 h-8 flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC]">+</button>
                </div>
                <div className="hidden md:block text-sm font-bold text-[#2563EB] text-center w-16">${product.price * quantity}</div>
                <button onClick={() => removeFromCart(product.id)} className="text-[#94A3B8] hover:text-[#DC2626] text-lg ml-2">×</button>
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            <Link to="/shop" className="border border-[#E2E8F0] text-[#64748B] px-5 py-2.5 rounded-xl text-sm hover:border-[#2563EB] hover:text-[#2563EB]">
              ← បន្តទិញទំនិញ
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sticky top-24">
            <h2 className="font-bold text-[#0F172A] text-lg mb-5">សង្ខេបការបញ្ជាទិញ</h2>

            {/* Coupon */}
            <div className="mb-4">
              <label className="text-sm font-medium text-[#1E293B] block mb-2">លេខកូដបញ្ចុះតម្លៃ</label>
              <div className="flex gap-2">
                <input type="text" placeholder="KHMER2024" className="flex-1 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                <button className="bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1D4ED8]">ប្រើប្រាស់</button>
              </div>
            </div>

            <div className="space-y-3 border-t border-[#E2E8F0] pt-4">
              {[
                ['តម្លៃទំនិញ', `$${cartTotal.toFixed(2)}`],
                ['ការបញ្ចុះតម្លៃ', discount > 0 ? `-$${discount.toFixed(2)}` : '$0'],
                ['ថ្លៃដឹកជញ្ជូន', shipping === 0 ? 'ឥតគិតថ្លៃ' : `$${shipping}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-[#64748B]">{label}</span>
                  <span className={`font-medium ${value.includes('-') ? 'text-[#16A34A]' : 'text-[#1E293B]'}`}>{value}</span>
                </div>
              ))}
              <div className="flex justify-between text-base font-bold pt-3 border-t border-[#E2E8F0]">
                <span className="text-[#0F172A]">សរុបទាំងអស់</span>
                <span className="text-[#2563EB]">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout" className="w-full bg-[#2563EB] text-white py-3.5 rounded-xl font-semibold mt-5 block text-center hover:bg-[#1D4ED8]">
              បន្តទៅការទូទាត់ →
            </Link>
            <p className="text-xs text-[#64748B] text-center mt-3">🔒 ការទូទាត់មានសុវត្ថិភាព 100%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

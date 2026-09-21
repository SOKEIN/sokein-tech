import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [city, setCity] = useState('ភ្នំពេញ');
  const [district, setDistrict] = useState('');
  const [commune, setCommune] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'khqr' | 'card'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerPhone(user.phone || '');
      setCustomerEmail(user.email || '');
      if (user.address?.street) setAddressDetail(user.address.street);
      if (user.address?.city) setCity(user.address.city);
      if (user.address?.district) setDistrict(user.address.district);
    }
  }, [user]);

  const shipping = cartTotal > 50 || cartTotal === 0 ? 0 : 2;
  const total = cartTotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError('កន្ត្រកទំនិញរបស់អ្នកទទេស្អាត');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const fullShippingAddress = [addressDetail, commune, district, city].filter(Boolean).join(', ');

    try {
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));

      const res = await api.orders.create({
        customerName,
        customerPhone,
        customerEmail: customerEmail || undefined,
        shippingAddress: fullShippingAddress || 'ភ្នំពេញ',
        paymentMethod,
        items: orderItems,
        subtotal: cartTotal,
        shippingFee: shipping,
        discount: 0,
        total,
      });

      clearCart();
      navigate('/order-success', { state: { order: res.order } });
    } catch (err: any) {
      setError(err.message || 'ការបញ្ជាទិញបានបរាជ័យ សូមព្យាយាមម្តងទៀត');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-[#1E293B] mb-2">កន្ត្រករបស់អ្នកទទេស្អាត</h2>
        <p className="text-sm text-[#64748B] mb-6">សូមបន្ថែមទំនិញទៅក្នុងកន្ត្រកមុននឹងបន្តការទូទាត់។</p>
        <Link to="/shop" className="bg-[#2563EB] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#1D4ED8]">
          ទៅកាន់ហាងទំនិញ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-[#64748B] mb-6">
        <Link to="/" className="hover:text-[#2563EB]">ទំព័រដើម</Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-[#2563EB]">កន្ត្រកទំនិញ</Link>
        <span>/</span>
        <span className="text-[#1E293B] font-medium">ការទូទាត់</span>
      </nav>

      <h1 className="text-2xl font-bold text-[#0F172A] mb-8">បំពេញការបញ្ជាទិញ</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left - Form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Customer Info */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
              <h2 className="font-bold text-[#0F172A] mb-4">ព័ត៌មានអតិថិជន</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#1E293B] block mb-1.5">ឈ្មោះពេញ</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="ឈ្មោះ-នាមត្រកូល..."
                    required
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1E293B] block mb-1.5">លេខទូរសព្ទ</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="0XX XXX XXX"
                    required
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-[#1E293B] block mb-1.5">អ៊ីមែល (ស្រេចចិត្ត)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
              <h2 className="font-bold text-[#0F172A] mb-4">អាសយដ្ឋានដឹកជញ្ជូន</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#1E293B] block mb-1.5">រាជធានី / ខេត្ត</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="ភ្នំពេញ..."
                    required
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1E293B] block mb-1.5">ក្រុង / ស្រុក / ខណ្ឌ</label>
                  <input
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    placeholder="ខណ្ឌទួលគោក / ចំការមន..."
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1E293B] block mb-1.5">ឃុំ / សង្កាត់</label>
                  <input
                    type="text"
                    value={commune}
                    onChange={e => setCommune(e.target.value)}
                    placeholder="សង្កាត់..."
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1E293B] block mb-1.5">អាសយដ្ឋានលម្អិត (ផ្ទះ/ផ្លូវ)</label>
                  <input
                    type="text"
                    value={addressDetail}
                    onChange={e => setAddressDetail(e.target.value)}
                    placeholder="#123 ផ្លូវ 271..."
                    required
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
              <h2 className="font-bold text-[#0F172A] mb-4">វិធីទូទាត់</h2>
              <div className="space-y-3">
                {[
                  { id: 'cod', icon: '💵', label: 'បង់ប្រាក់ពេលទទួលទំនិញ (Cash on Delivery)', desc: 'បង់ប្រាក់ដោយផ្ទាល់ពេលទំនិញដល់ដៃលោកអ្នក' },
                  { id: 'khqr', icon: '📱', label: 'ទូទាត់តាម KHQR (Bakong / All Banks)', desc: 'ស្គែន QR កូដរហ័ស ងាយស្រួល ជាមួយគ្រប់កម្មវិធីធនាគារ' },
                  { id: 'card', icon: '💳', label: 'កាតធនាគារ (Visa / MasterCard)', desc: 'ទូទាត់សុវត្ថិភាពតាមកាតឥណទាន ឬឥណពន្ធ' },
                ].map(m => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === m.id ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] hover:border-[#BFDBFE]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id as any)}
                      className="accent-[#2563EB]"
                    />
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <div className="font-semibold text-sm text-[#1E293B]">{m.label}</div>
                      <div className="text-xs text-[#64748B]">{m.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sticky top-24 shadow-sm">
              <h2 className="font-bold text-[#0F172A] mb-4">សង្ខេបការបញ្ជាទិញ</h2>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-14 h-12 object-cover rounded-lg bg-[#F8FAFC] border border-gray-100" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#1E293B] font-medium line-clamp-1">{product.name}</div>
                      <div className="text-xs text-[#64748B]">${product.price} × {quantity}</div>
                    </div>
                    <div className="text-sm font-semibold text-[#1E293B]">${(product.price * quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-[#E2E8F0] pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">តម្លៃទំនិញសរុប</span>
                  <span className="text-[#1E293B] font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">ថ្លៃដឹកជញ្ជូន</span>
                  <span className="text-[#1E293B] font-medium">{shipping === 0 ? 'ឥតគិតថ្លៃ (Free)' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">ការបញ្ចុះតម្លៃ</span>
                  <span className="text-[#16A34A] font-medium">-$0.00</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-[#E2E8F0]">
                  <span>សរុបទាំងអស់</span>
                  <span className="text-[#2563EB] text-xl">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2563EB] text-white py-3.5 rounded-xl font-semibold mt-5 hover:bg-[#1D4ED8] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>កំពុងដំណើរការការបញ្ជាទិញ...</span>
                  </>
                ) : (
                  '✓ បញ្ជាក់ការបញ្ជាទិញ'
                )}
              </button>
              <p className="text-xs text-[#64748B] text-center mt-3">🔒 ព័ត៌មានរបស់អ្នកត្រូវបានការពារយ៉ាងមានសុវត្ថិភាព</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

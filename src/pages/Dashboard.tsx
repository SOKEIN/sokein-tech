import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api, type Order } from '../services/api';

const sidebarLinks = [
  { id: 'overview', label: 'ទិដ្ឋភាពទូទៅ', icon: '📊' },
  { id: 'orders', label: 'ការបញ្ជាទិញរបស់ខ្ញុំ', icon: '📦' },
  { id: 'tracking', label: 'តាមដានការបញ្ជាទិញ', icon: '🚚', to: '/tracking' },
  { id: 'wishlist', label: 'ទំនិញដែលចូលចិត្ត', icon: '❤️', to: '/wishlist' },
  { id: 'profile', label: 'ព័ត៌មានផ្ទាល់ខ្លួន', icon: '👤' },
];

export default function Dashboard() {
  const { user, logout, isAuthenticated, isLoading: authLoading, updateProfile } = useAuth();
  const { wishlist } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Profile form state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileStreet, setProfileStreet] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/dashboard' } } });
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileStreet(user.address?.street || '');
      setProfileCity(user.address?.city || 'ភ្នំពេញ');
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const res = await api.orders.getUserOrders();
      setOrders(res.orders);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMsg('');
    try {
      await updateProfile({
        name: profileName,
        phone: profilePhone,
        address: {
          street: profileStreet,
          city: profileCity,
        },
      });
      setProfileMsg('បានកែប្រែព័ត៌មានជោគជ័យ!');
      setTimeout(() => setProfileMsg(''), 4000);
    } catch (err: any) {
      setProfileMsg(`បរាជ័យ: ${err.message}`);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#2563EB]">
          <span className="animate-spin text-2xl">⏳</span>
          <span className="font-medium">កំពុងផ្ទុកទិន្នន័យ...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const totalOrdersCount = orders.length;
  const processingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'delivered').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="text-xs font-medium px-2.5 py-1 rounded-full text-[#16A34A] bg-[#DCFCE7]">បានដឹកដល់</span>;
      case 'shipped':
        return <span className="text-xs font-medium px-2.5 py-1 rounded-full text-[#2563EB] bg-[#DBEAFE]">កំពុងដឹកជញ្ជូន</span>;
      case 'processing':
        return <span className="text-xs font-medium px-2.5 py-1 rounded-full text-[#F59E0B] bg-[#FEF3C7]">កំពុងដំណើរការ</span>;
      case 'cancelled':
        return <span className="text-xs font-medium px-2.5 py-1 rounded-full text-[#DC2626] bg-[#FEE2E2]">បានលុបចោល</span>;
      default:
        return <span className="text-xs font-medium px-2.5 py-1 rounded-full text-[#64748B] bg-[#F1F5F9]">រង់ចាំការបញ្ជាក់</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
            <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] p-5 text-white">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold mb-3 border border-white/30">
                {user.name ? user.name.charAt(0) : '👤'}
              </div>
              <div className="font-semibold text-base">{user.name}</div>
              <div className="text-blue-100 text-xs truncate mt-0.5">{user.email}</div>
              {user.phone && <div className="text-blue-200 text-xs mt-0.5">📞 {user.phone}</div>}
            </div>
            <nav className="p-2">
              {sidebarLinks.map(link => {
                if (link.to) {
                  return (
                    <Link
                      key={link.id}
                      to={link.to}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-colors mb-0.5 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]"
                    >
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  );
                }
                return (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-colors mb-0.5 text-left ${
                      activeTab === link.id
                        ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold'
                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                    }`}
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-[#DC2626] hover:bg-red-50 w-full mt-2 transition-colors"
              >
                <span>🚪</span>
                <span>ចាកចេញ</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'ការបញ្ជាទិញសរុប', value: totalOrdersCount, icon: '📦', color: 'text-[#2563EB]' },
              { label: 'កំពុងដំណើរការ', value: processingOrdersCount, icon: '⏳', color: 'text-[#F59E0B]' },
              { label: 'បានដឹកជញ្ជូន', value: deliveredOrdersCount, icon: '✅', color: 'text-[#16A34A]' },
              { label: 'ទំនិញចូលចិត្ត', value: wishlist.length, icon: '❤️', color: 'text-[#DC2626]' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-[#64748B] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Section: Overview / Orders */}
          {(activeTab === 'overview' || activeTab === 'orders') && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-lg text-[#0F172A]">
                    {activeTab === 'overview' ? 'ការបញ្ជាទិញថ្មីៗ (Live Backend)' : 'ប្រវត្តិនៃការបញ្ជាទិញទាំងអស់'}
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">ទិន្នន័យត្រូវបានទាញយកផ្ទាល់ពី REST API Server</p>
                </div>
                <button
                  onClick={fetchOrders}
                  className="text-xs text-[#2563EB] hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                >
                  🔄 Refresh
                </button>
              </div>

              {isLoadingOrders ? (
                <div className="py-12 text-center text-sm text-[#64748B]">កំពុងផ្ទុកបញ្ជីបញ្ជាទិញ...</div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="text-4xl mb-2">🛍️</div>
                  <p className="text-[#64748B] text-sm mb-4">អ្នកមិនទាន់មានការបញ្ជាទិញណាមួយនៅឡើយទេ</p>
                  <Link to="/shop" className="bg-[#2563EB] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1D4ED8]">
                    ទៅកាន់ហាងទំនិញ
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E2E8F0]">
                        {['លេខបញ្ជាទិញ', 'កាលបរិច្ឆេទ', 'ទំនិញ', 'សរុប', 'វិធីទូទាត់', 'ស្ថានភាព', 'សកម្មភាព'].map(h => (
                          <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3.5 px-3 font-semibold text-[#1E293B]">
                            <span className="text-[#2563EB]">#{order.id}</span>
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#64748B]">
                            {new Date(order.createdAt).toLocaleDateString('km-KH')}
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#1E293B]">
                            {order.items.length} មុខ ({order.items.map(i => i.name).join(', ').substring(0, 24)}...)
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-[#1E293B]">${order.total.toFixed(2)}</td>
                          <td className="py-3.5 px-3 text-xs uppercase text-[#64748B]">
                            <span className="px-2 py-0.5 rounded bg-gray-100 font-medium">{order.paymentMethod}</span>
                          </td>
                          <td className="py-3.5 px-3">{getStatusBadge(order.status)}</td>
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="text-[#2563EB] hover:underline text-xs font-medium"
                              >
                                មើលលម្អិត
                              </button>
                              <Link
                                to={`/tracking?q=${order.id}`}
                                className="text-xs text-gray-500 hover:text-blue-600 bg-gray-50 px-2 py-1 rounded"
                              >
                                🚚 តាមដាន
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Section: Profile */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
              <h2 className="font-bold text-lg text-[#0F172A] mb-1">ព័ត៌មានផ្ទាល់ខ្លួន</h2>
              <p className="text-xs text-[#64748B] mb-6">កែប្រែព័ត៌មានគណនី និងអាសយដ្ឋានដឹកជញ្ជូនរបស់អ្នក</p>

              {profileMsg && (
                <div className={`p-3 rounded-xl text-sm mb-4 ${profileMsg.includes('ជោគជ័យ') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {profileMsg}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
                <div>
                  <label className="text-sm font-medium text-[#1E293B] block mb-1">ឈ្មោះពេញ</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    required
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1E293B] block mb-1">អ៊ីមែល (មិនអាចកែប្រែបាន)</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full border border-[#E2E8F0] bg-gray-50 text-gray-500 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1E293B] block mb-1">លេខទូរសព្ទ</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    placeholder="0XX XXX XXX"
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1E293B] block mb-1">អាសយដ្ឋានផ្លូវ / ផ្ទះ</label>
                  <input
                    type="text"
                    value={profileStreet}
                    onChange={e => setProfileStreet(e.target.value)}
                    placeholder="#123 ផ្លូវ..."
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1E293B] block mb-1">រាជធានី / ខេត្ត</label>
                  <input
                    type="text"
                    value={profileCity}
                    onChange={e => setProfileCity(e.target.value)}
                    placeholder="ភ្នំពេញ..."
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="bg-[#2563EB] text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-[#1D4ED8] transition-colors disabled:opacity-70"
                >
                  {isUpdatingProfile ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកការកែប្រែ'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <h3 className="font-bold text-lg text-[#0F172A]">ការបញ្ជាទិញ #{selectedOrder.id}</h3>
                <p className="text-xs text-[#64748B]">{new Date(selectedOrder.createdAt).toLocaleString('km-KH')}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-blue-50 p-3.5 rounded-xl flex items-center justify-between">
                <span className="text-xs text-blue-900 font-medium">ស្ថានភាពបច្ចុប្បន្ន:</span>
                {getStatusBadge(selectedOrder.status)}
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">ទំនិញដែលបានទិញ</h4>
                <div className="space-y-2 border border-gray-100 rounded-xl p-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100" />
                      <div className="flex-1">
                        <div className="font-medium text-xs text-gray-800 line-clamp-1">{item.name}</div>
                        <div className="text-xs text-gray-500">${item.price} × {item.quantity}</div>
                      </div>
                      <div className="font-semibold text-xs text-gray-800">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3.5 rounded-xl">
                <div>
                  <span className="text-gray-500 block">អ្នកទទួល:</span>
                  <span className="font-medium text-gray-800">{selectedOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">លេខទូរសព្ទ:</span>
                  <span className="font-medium text-gray-800">{selectedOrder.customerPhone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block">អាសយដ្ឋានដឹកជញ្ជូន:</span>
                  <span className="font-medium text-gray-800">{selectedOrder.shippingAddress}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-center font-bold text-base">
                <span>សរុបទាំងអស់:</span>
                <span className="text-[#2563EB]">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                to={`/tracking?q=${selectedOrder.id}`}
                className="flex-1 bg-[#2563EB] text-white text-center py-2.5 rounded-xl text-sm font-medium hover:bg-[#1D4ED8]"
              >
                🚚 តាមដានការដឹកជញ្ជូន
              </Link>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50"
              >
                បិទ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

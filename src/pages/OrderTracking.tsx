import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { api, type Order } from '../services/api';
import {
  TruckIcon,
  ShoppingBagIcon,
  UserIcon,
  SearchIcon,
  XIcon,
  ShieldCheckIcon,
} from '../components/Icons';

interface TrackedOrder {
  orderId: string;
  status: Order['status'];
  statusTextKh: string;
  createdAt: string;
  customerName: string;
  shippingAddress: string;
  total: number;
  itemCount: number;
  timeline: {
    title: string;
    time: string;
    description: string;
    completed: boolean;
  }[];
  items: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

export default function OrderTracking() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryOrderParam = searchParams.get('q') || '';

  const [orderIdInput, setOrderIdInput] = useState(queryOrderParam);
  const [activeTrackingId, setActiveTrackingId] = useState<string>(queryOrderParam);
  const [orderData, setOrderData] = useState<TrackedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // User's own orders list (if logged in)
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isLoadingUserOrders, setIsLoadingUserOrders] = useState(false);

  // Modal prompt for non-authenticated guests
  const [showAuthModal, setShowAuthModal] = useState(false);

  // 1. Check authentication & load user's real orders
  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated) {
      setIsLoadingUserOrders(true);
      api.orders
        .getUserOrders()
        .then((res) => {
          const list = res.orders || [];
          setUserOrders(list);

          // If no specific query param was given, automatically select and track the latest order!
          if (!queryOrderParam && list.length > 0) {
            const latest = list[0];
            setActiveTrackingId(latest.id);
            setOrderIdInput(latest.id);
            fetchTracking(latest.id);
          }
        })
        .catch((err) => {
          console.warn('Failed to load user orders:', err);
        })
        .finally(() => {
          setIsLoadingUserOrders(false);
        });
    } else {
      // If visitor is NOT logged in and didn't provide a specific ?q= in URL, show the helpful Auth prompt modal!
      if (!queryOrderParam) {
        setShowAuthModal(true);
      }
    }
  }, [isAuthenticated, authLoading, queryOrderParam]);

  // 2. Fetch tracking details when activeTrackingId changes
  const fetchTracking = async (id: string) => {
    if (!id.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const cleanId = id.trim().toUpperCase();
      const res = await api.orders.track(cleanId);
      setOrderData(res);
      setActiveTrackingId(cleanId);
    } catch (err: any) {
      setError(err.message || `មិនអាចស្វែងរកការបញ្ជាទិញ #${id} បានទេ`);
      setOrderData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // If queryOrderParam is set on URL load
  useEffect(() => {
    if (queryOrderParam) {
      setOrderIdInput(queryOrderParam);
      fetchTracking(queryOrderParam);
    }
  }, [queryOrderParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;
    const cleanId = orderIdInput.trim().toUpperCase();
    setSearchParams({ q: cleanId });
    fetchTracking(cleanId);
  };

  const handleSelectUserOrder = (id: string) => {
    setOrderIdInput(id);
    setSearchParams({ q: id });
    fetchTracking(id);
  };

  return (
    <div className="min-h-[85vh] bg-slate-50/50 dark:bg-[#080d1a] py-8 sm:py-12 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            ទំព័រដើម
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-medium">តាមដានការបញ្ជាទិញ</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl">
                🚚
              </span>
              <span>តាមដានស្ថានភាពការបញ្ជាទិញ</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              ពិនិត្យមើលស្ថានភាពនៃការវេចខ្ចប់ និងការដឹកជញ្ជូនទំនិញរបស់អ្នកផ្ទាល់ (Live Tracking)
            </p>
          </div>

          {/* User Status Badge */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs font-semibold text-blue-700 dark:text-blue-300 w-fit">
              <span>{user.avatar || '👤'}</span>
              <span>គណនី: {user.name}</span>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CASE 1: Visitor NOT LOGGED IN -> Prominent Register/Login Suggestion Banner */}
        {/* ========================================================================= */}
        {!authLoading && !isAuthenticated && (
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-7 text-white shadow-lg mb-8 relative overflow-hidden animate-fade-in">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-3">
                  <span>💡 គន្លឹះងាយស្រួល</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black">តើអ្នកមានគណនីរួចហើយឬនៅ?</h2>
                <p className="text-xs sm:text-sm text-blue-100 mt-1.5 leading-relaxed">
                  ចុះឈ្មោះ ឬចូលគណនីរបស់អ្នក ដើម្បីងាយស្រួលតាមដានស្ថានភាពទំនិញ
                  និងពិនិត្យមើលប្រវត្តិនៃការបញ្ជាទិញទាំងអស់របស់អ្នកដោយស្វ័យប្រវត្តិ
                  ដោយមិនបាច់វាយលេខកូដកុម្ម៉ង់ឡើយ។
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 flex-shrink-0">
                <Link
                  to="/register?redirect=/tracking"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserIcon size={16} />
                  <span>ចុះឈ្មោះបង្កើតគណនី</span>
                </Link>
                <Link
                  to="/login?redirect=/tracking"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/30 backdrop-blur-md transition-all active:scale-95 text-center cursor-pointer"
                >
                  <span>ចូលគណនី</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CASE 2: User IS LOGGED IN -> Show their personal orders list or Empty State */}
        {/* ========================================================================= */}
        {isAuthenticated && (
          <div className="mb-8">
            {isLoadingUserOrders ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
                កំពុងផ្ទុកការបញ្ជាទិញរបស់អ្នក...
              </div>
            ) : userOrders.length === 0 ? (
              /* Subcase 2A: Logged in, but 0 orders */
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
                <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400 flex items-center justify-center text-3xl mx-auto mb-4 border border-amber-200/60 dark:border-amber-900/50">
                  🛍️
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  អ្នកមិនទាន់មានការបញ្ជាទិញនៅឡើយទេ
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                  សូមស្វាគមន៍ {user?.name}! អ្នកមិនទាន់បានធ្វើការបញ្ជាទិញទំនិញណាមួយនៅក្នុងគណនីនេះទេ។
                  សូមចូលទៅកាន់ទំព័រទំនិញ ដើម្បីជ្រើសរើសកុំព្យូទ័រ ទូរសព្ទដៃ ឬគ្រឿងបន្លាស់ដែលអ្នកពេញចិត្ត!
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <Link
                    to="/shop"
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <ShoppingBagIcon size={16} />
                    <span>ទៅកាន់ទំព័រទំនិញ (Shop Now)</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Subcase 2B: Logged in, and has orders! Show quick order pills */
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📦</span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      ការបញ្ជាទិញរបស់អ្នក ({userOrders.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    ចុចលើលេខកូដដើម្បីមើល Live Tracking
                  </span>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                  {userOrders.map((ord) => {
                    const isSelected = activeTrackingId === ord.id;
                    return (
                      <button
                        key={ord.id}
                        type="button"
                        onClick={() => handleSelectUserOrder(ord.id)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 whitespace-nowrap cursor-pointer flex-shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span className="font-mono">#{ord.id}</span>
                        <span className="text-[11px] opacity-90">${ord.total.toFixed(2)}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {ord.statusTextKh}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* Search Bar Section (Guest Order ID Search) */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 mb-8 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="order-search-input" className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <SearchIcon size={16} className="text-blue-600 dark:text-blue-400" />
              <span>
                {isAuthenticated ? 'ស្វែងរកលេខកូដបញ្ជាទិញផ្សេងទៀត' : 'ស្វែងរកតាមលេខកូដបញ្ជាទិញ (Guest Tracking)'}
              </span>
            </label>
            <span className="text-[11px] text-slate-400">ឧទាហរណ៍៖ KT00001</span>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                id="order-search-input"
                type="text"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="បញ្ចូលលេខបញ្ជាទិញ (ឧ. KT00001, KT00002...)"
                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 uppercase font-mono transition-all"
              />
              {orderIdInput && (
                <button
                  type="button"
                  onClick={() => setOrderIdInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                >
                  <XIcon size={14} />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !orderIdInput.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-7 py-3 rounded-2xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {isLoading ? <span className="animate-spin">⏳</span> : <SearchIcon size={16} />}
              <span>តាមដានឥឡូវនេះ</span>
            </button>
          </form>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 p-5 rounded-3xl text-sm mb-8 flex items-start gap-3.5 animate-shake">
            <span className="text-xl leading-none">⚠️</span>
            <div>
              <p className="font-bold">{error}</p>
              <p className="text-xs text-rose-600/80 dark:text-rose-400 mt-1">
                សូមពិនិត្យមើលលេខកូដបញ្ជាទិញរបស់អ្នកឡើងវិញ ឬទំនាក់ទំនងមកកាន់ផ្នែកបម្រើអតិថិជន។
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CASE 3: No Active Order Tracked yet (Prompt to Enter or Select) */}
        {/* ========================================================================= */}
        {!orderData && !isLoading && !error && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 text-center shadow-xs">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-4xl mx-auto mb-4 border border-blue-100 dark:border-blue-900/40">
              <TruckIcon size={36} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              បញ្ចូលលេខកូដដើម្បីចាប់ផ្តើមតាមដាន
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
              អ្នកអាចស្វែងរកលេខកូដបញ្ជាទិញ (Order ID) បាននៅលើវិក្កយបត្រអេឡិចត្រូនិច ឬសារ SMS/Telegram ដែលទទួលបានក្រោយពេលកុម្ម៉ង់ជោគជ័យ។
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="text-xs text-slate-400 dark:text-slate-500 self-center">សាកល្បងលេខកូដគំរូ:</span>
              {['KT00001', 'KT00002', 'KT00003'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setOrderIdInput(code);
                    setSearchParams({ q: code });
                    fetchTracking(code);
                  }}
                  className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  #{code}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <div className="inline-block animate-spin text-3xl mb-3">⏳</div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">កំពុងស្វែងរកព័ត៌មានការបញ្ជាទិញ...</div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CASE 4: Display Live Tracking Order Details */}
        {/* ========================================================================= */}
        {orderData && !isLoading && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-7 animate-fade-in">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-black text-slate-900 dark:text-white text-xl sm:text-2xl font-mono">
                    #{orderData.orderId}
                  </h2>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      orderData.status === 'delivered'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                        : orderData.status === 'shipped'
                        ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                        : orderData.status === 'cancelled'
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {orderData.statusTextKh}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                  កាលបរិច្ឆេទបញ្ជាទិញ: {new Date(orderData.createdAt).toLocaleDateString('km-KH', { dateStyle: 'full' })}
                </p>
              </div>

              <div className="text-left sm:text-right bg-slate-50 dark:bg-slate-800/60 sm:bg-transparent sm:dark:bg-transparent p-3 sm:p-0 rounded-2xl">
                <div className="text-xs text-slate-500 dark:text-slate-400">ទឹកប្រាក់សរុប</div>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                  ${orderData.total.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">ឈ្មោះអ្នកទទួល:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {orderData.customerName}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">អាសយដ្ឋានដឹកជញ្ជូន:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {orderData.shippingAddress}
                </span>
              </div>
            </div>

            {/* Step-by-Step Delivery Timeline */}
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base mb-5 flex items-center gap-2">
                <span>📍</span>
                <span>ដំណាក់កាលនៃការដឹកជញ្ជូន</span>
              </h3>

              <div className="space-y-0 pl-2">
                {orderData.timeline.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    {/* Step Icon & Line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                          step.completed
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {step.completed ? '✓' : idx + 1}
                      </div>
                      {idx < orderData.timeline.length - 1 && (
                        <div
                          className={`w-0.5 h-12 transition-colors ${
                            step.completed ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                      )}
                    </div>

                    {/* Step Details */}
                    <div className="pb-6">
                      <div
                        className={`font-bold text-sm ${
                          step.completed
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {step.description}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {step.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ordered Products Items */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm flex items-center justify-between">
                <span>ទំនិញក្នុងកញ្ចប់នេះ ({orderData.items.length})</span>
                <span className="text-xs text-slate-400 font-normal">ចំនួនសរុប {orderData.itemCount} មុខ</span>
              </h3>

              <div className="space-y-3">
                {orderData.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        ចំនួន: <span className="font-bold text-slate-700 dark:text-slate-300">x{item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-bold font-mono">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* AUTH POPUP MODAL (Prompts non-registered visitors when they visit /tracking) */}
      {/* ========================================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-2xl relative animate-scale-up">
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <XIcon size={16} />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl mx-auto mb-4 border border-blue-200/60 dark:border-blue-800">
                📦
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                តាមដានការបញ្ជាទិញ
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                តើអ្នកមានគណនីរួចហើយឬនៅ? ចូលគណនី ឬចុះឈ្មោះ ដើម្បីមើលប្រវត្តិទំនិញ និងតាមដានរាល់ការបញ្ជាទិញរបស់អ្នកដោយស្វ័យប្រវត្តិ។
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <Link
                to="/register?redirect=/tracking"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <UserIcon size={16} />
                <span>ចុះឈ្មោះបង្កើតគណនីថ្មី (Register)</span>
              </Link>

              <Link
                to="/login?redirect=/tracking"
                className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>ចូលគណនី (Login)</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  const searchEl = document.getElementById('order-search-input');
                  searchEl?.focus();
                }}
                className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer text-center"
              >
                ខ្ញុំមានលេខកូដកុម្ម៉ង់រួចហើយ (បន្តតាមដានជាភ្ញៀវ) →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

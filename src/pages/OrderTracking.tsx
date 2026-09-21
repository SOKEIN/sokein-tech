import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { api } from '../services/api';

interface TrackedOrder {
  orderId: string;
  status: string;
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
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || 'KT00001';

  const [orderId, setOrderId] = useState(initialQuery);
  const [orderData, setOrderData] = useState<TrackedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (id: string) => {
    if (!id.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await api.orders.track(id.trim());
      setOrderData(res);
    } catch (err: any) {
      setError(err.message || `មិនអាចស្វែងរកការបញ្ជាទិញ #${id} បានទេ`);
      setOrderData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setOrderId(initialQuery);
      fetchTracking(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderId);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="flex items-center gap-2 text-sm text-[#64748B] mb-6">
        <Link to="/" className="hover:text-[#2563EB]">ទំព័រដើម</Link>
        <span>/</span>
        <span className="text-[#1E293B] font-medium">តាមដានការបញ្ជាទិញ</span>
      </nav>

      <h1 className="text-2xl font-bold text-[#0F172A] mb-6">តាមដានស្ថានភាពការបញ្ជាទិញ (Live Tracking)</h1>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 mb-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            placeholder="បញ្ចូលលេខបញ្ជាទិញ (ឧ. KT00001, KT00002, KT00003)"
            className="flex-1 border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] uppercase font-medium"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#2563EB] text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-[#1D4ED8] transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isLoading ? <span className="animate-spin">⏳</span> : '🔍'}
            <span>តាមដាន</span>
          </button>
        </form>

        <div className="mt-3 flex items-center gap-2 text-xs text-[#64748B]">
          <span>សាកល្បងលេខកូដគំរូ:</span>
          {['KT00001', 'KT00002', 'KT00003'].map(sample => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setOrderId(sample);
                fetchTracking(sample);
              }}
              className="text-[#2563EB] hover:underline font-mono bg-blue-50 px-2 py-0.5 rounded"
            >
              #{sample}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-sm mb-6 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold">{error}</p>
            <p className="text-xs text-red-500 mt-0.5">សូមពិនិត្យលេខកូដបញ្ជាទិញរបស់អ្នកម្តងទៀត។</p>
          </div>
        </div>
      )}

      {orderData && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#E2E8F0] gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-[#0F172A] text-xl font-mono">#{orderData.orderId}</h2>
                <span className="bg-[#DCFCE7] text-[#16A34A] text-xs font-semibold px-2.5 py-1 rounded-full">
                  {orderData.statusTextKh}
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                កាលបរិច្ឆេទ: {new Date(orderData.createdAt).toLocaleDateString('km-KH', { dateStyle: 'full' })}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs text-[#64748B]">ទឹកប្រាក់សរុប</div>
              <div className="text-xl font-bold text-[#2563EB]">${orderData.total.toFixed(2)}</div>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F8FAFC] p-4 rounded-xl text-xs">
            <div>
              <span className="text-gray-500 block">អ្នកទទួល:</span>
              <span className="font-medium text-gray-800 text-sm">{orderData.customerName}</span>
            </div>
            <div>
              <span className="text-gray-500 block">អាសយដ្ឋានដឹកជញ្ជូន:</span>
              <span className="font-medium text-gray-800 text-sm">{orderData.shippingAddress}</span>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-bold text-[#0F172A] text-sm mb-4">ដំណើរការដឹកជញ្ជូន</h3>
            <div className="space-y-0 pl-2">
              {orderData.timeline.map((step, i) => (
                <div key={i} className="flex gap-4">
                  {/* Line & Icon */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        step.completed
                          ? 'bg-[#16A34A] text-white'
                          : 'bg-[#E2E8F0] text-[#94A3B8]'
                      }`}
                    >
                      {step.completed ? '✓' : i + 1}
                    </div>
                    {i < orderData.timeline.length - 1 && (
                      <div className={`w-0.5 h-12 ${step.completed ? 'bg-[#16A34A]' : 'bg-[#E2E8F0]'}`} />
                    )}
                  </div>
                  {/* Step Content */}
                  <div className="pb-6">
                    <div className={`font-semibold text-sm ${step.completed ? 'text-[#1E293B]' : 'text-[#94A3B8]'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-[#64748B] mt-0.5">{step.description}</div>
                    <div className="text-[11px] text-[#94A3B8] mt-0.5">{step.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Items in Order */}
          <div className="border-t border-[#E2E8F0] pt-5">
            <h3 className="font-semibold text-[#1E293B] mb-3 text-sm">ទំនិញក្នុងកញ្ចប់ ({orderData.items.length})</h3>
            <div className="space-y-3">
              {orderData.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <img src={item.image} alt={item.name} className="w-14 h-12 object-cover rounded-lg bg-[#F8FAFC] border border-gray-100" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#1E293B]">{item.name}</div>
                    <div className="text-xs text-[#64748B]">ចំនួន: x{item.quantity}</div>
                  </div>
                  <div className="text-sm text-[#2563EB] font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

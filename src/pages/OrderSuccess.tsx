import { Link, useLocation } from 'react-router';
import type { Order } from '../services/api';

export default function OrderSuccess() {
  const location = useLocation();
  const order: Order | undefined = (location.state as any)?.order;

  const orderId = order?.id || 'KT00101';
  const orderDate = order ? new Date(order.createdAt).toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('km-KH');
  const totalAmount = order ? `$${order.total.toFixed(2)}` : '$754.00';
  const paymentMethodText = order?.paymentMethod === 'khqr' ? 'ទូទាត់តាម KHQR' : order?.paymentMethod === 'card' ? 'កាតធនាគារ' : 'បង់ប្រាក់ពេលទទួល (COD)';

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-8 md:p-12 shadow-sm">
        <div className="w-20 h-20 bg-[#DCFCE7] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-[#16A34A] font-bold">
          ✓
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-2">ការបញ្ជាទិញបានជោគជ័យ!</h1>
        <p className="text-[#64748B] leading-relaxed mb-8">
          អរគុណសម្រាប់ការបញ្ជាទិញ។ ប្រព័ន្ធបានកត់ត្រាការបញ្ជាទិញរបស់អ្នកនៅក្នុងប្រព័ន្ធ Backend រួចរាល់ហើយ។
        </p>

        <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-5 mb-8 text-left">
          <h3 className="font-semibold text-[#1E293B] mb-4 flex items-center justify-between">
            <span>ព័ត៌មានការបញ្ជាទិញ</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-mono">#{orderId}</span>
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-[#64748B] text-xs mb-0.5">លេខបញ្ជាទិញ</div>
              <div className="font-semibold text-[#2563EB]">#{orderId}</div>
            </div>
            <div>
              <div className="text-[#64748B] text-xs mb-0.5">កាលបរិច្ឆេទ</div>
              <div className="font-semibold text-[#1E293B]">{orderDate}</div>
            </div>
            <div>
              <div className="text-[#64748B] text-xs mb-0.5">សរុបទឹកប្រាក់</div>
              <div className="font-semibold text-[#1E293B]">{totalAmount}</div>
            </div>
            <div>
              <div className="text-[#64748B] text-xs mb-0.5">វិធីទូទាត់</div>
              <div className="font-semibold text-[#1E293B]">{paymentMethodText}</div>
            </div>
            <div>
              <div className="text-[#64748B] text-xs mb-0.5">ស្ថានភាព</div>
              <div className="font-semibold text-[#F59E0B]">{order?.statusTextKh || 'កំពុងដំណើរការ'}</div>
            </div>
            <div>
              <div className="text-[#64748B] text-xs mb-0.5">ការដឹកជញ្ជូន</div>
              <div className="font-semibold text-[#1E293B]">2-3 ថ្ងៃការងារ</div>
            </div>
          </div>
        </div>

        {/* Timeline preview */}
        <div className="flex items-center justify-between mb-8 px-2">
          {['✓ បញ្ជាទិញ', '⋯ បញ្ជាក់', '⋯ រៀបចំ', '⋯ ដឹកជញ្ជូន', '⋯ ដល់'].map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-[#16A34A] text-white' : 'bg-[#E2E8F0] text-[#94A3B8]'
                }`}
              >
                {i === 0 ? '✓' : i + 1}
              </div>
              <span className={`text-xs text-center leading-tight ${i === 0 ? 'text-[#16A34A] font-medium' : 'text-[#94A3B8]'}`}>
                {step.replace('✓ ', '').replace('⋯ ', '')}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={`/tracking?q=${orderId}`}
            className="border border-[#2563EB] text-[#2563EB] px-6 py-3 rounded-xl font-semibold hover:bg-[#EFF6FF] transition-colors"
          >
            🚚 តាមដានការបញ្ជាទិញ
          </Link>
          <Link
            to="/shop"
            className="bg-[#2563EB] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1D4ED8] transition-colors"
          >
            🛍️ បន្តទិញទំនិញ
          </Link>
        </div>
      </div>
    </div>
  );
}

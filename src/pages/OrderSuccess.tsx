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

        {/* ACLEDA KHQR Section if KHQR chosen */}
        {order?.paymentMethod === 'khqr' && (
          <div className="bg-gradient-to-b from-red-50/70 to-white border-2 border-red-500/40 rounded-2xl p-6 mb-8 text-left shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-red-100">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                  KHQR
                </span>
                <div>
                  <div className="text-sm font-black text-slate-900">អេស៊ីលីដា (ACLEDA BANK)</div>
                  <div className="text-xs text-slate-500">
                    ឈ្មោះគណនី: <strong className="text-slate-800">NHANH SOKHEIN</strong>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full border border-red-200">
                ស្កេនបានគ្រប់ធនាគារ (Bakong)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200 w-[200px] flex-shrink-0 text-center">
                <img
                  src="/khqr-acleda.png"
                  alt="KHQR ACLEDA - NHANH SOKHEIN"
                  className="w-full h-auto rounded-xl object-contain mx-auto"
                />
                <a
                  href="/khqr-acleda.png"
                  download="KHQR-NHANH-SOKHEIN.png"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2.5 w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>📥</span>
                  <span>ទាញយក QR / ពង្រីកមើល</span>
                </a>
              </div>

              <div className="flex-1 space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-slate-500 text-xs">ចំនួនទឹកប្រាក់ត្រូវទូទាត់:</div>
                  <div className="text-2xl font-black text-red-600 font-mono mt-0.5">
                    ${order?.total ? order.total.toFixed(2) : '0.00'}
                    {order?.total && (
                      <span className="text-xs font-semibold text-slate-500 ml-2 font-sans">
                        (~{(order.total * 4100).toLocaleString('km-KH')} ៛)
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 text-slate-600 text-xs leading-relaxed">
                  <p className="font-semibold text-slate-800">
                    💡 ប្រសិនបើលោកអ្នកមិនទាន់បានស្កេនទូទាត់ សូមស្កេន QR ខាងលើ៖
                  </p>
                  <p>1. បើក App ធនាគារណាមួយ (ACLEDA, ABA, Bakong...)</p>
                  <p>2. ស្កេន KHQR និងបញ្ចូលទឹកប្រាក់ <strong>${order?.total?.toFixed(2)}</strong></p>
                  <p>3. ដាក់ចំណាំលេខបញ្ជាទិញ: <strong className="text-blue-600">#{orderId}</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}

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

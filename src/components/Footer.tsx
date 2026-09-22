import React, { useState } from 'react';
import { Link } from 'react-router';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const shopLinks = [
    { label: 'ទំនិញទាំងអស់', href: '/shop' },
    { label: 'ទំនិញថ្មី', href: '/shop?sort=new' },
    { label: 'ពេញនិយម', href: '/shop?sort=popular' },
    { label: 'ប្រូម៉ូសិន', href: '/shop?sale=true' },
  ];

  const supportLinks = [
    { label: 'ទាក់ទងយើង', href: '/contact' },
    { label: 'ការដឹកជញ្ជូន', href: '/contact' },
    { label: 'ការធានា', href: '/contact' },
    { label: 'គោលការណ៍ប្តូរ', href: '/contact' },
    { label: 'សំណួរញឹកញាប់', href: '/contact' },
  ];

  const accountLinks = [
    { label: 'ចូលគណនី', href: '/login' },
    { label: 'ការបញ្ជាទិញ', href: '/dashboard/orders' },
    { label: 'តាមដានទំនិញ', href: '/tracking' },
    { label: 'ទំនិញចូលចិត្ត', href: '/wishlist' },
  ];

  return (
    <footer className="bg-[#0F172A] text-white mt-10 sm:mt-16 border-t border-slate-800 select-none">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-8 sm:py-12 pb-24 lg:pb-12">
        {/* Main Grid: Brand on Left, 3 Columns on Right (and 3 columns side-by-side on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Brand & Newsletter Column (Full width on mobile, 4-col on desktop) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
                S
              </div>
              <div>
                <div className="font-black text-lg tracking-tight text-white">SOKEINTECH</div>
                <div className="text-[11px] text-[#94A3B8]">ហាងបច្ចេកវិទ្យា និងអេឡិចត្រូនិក</div>
              </div>
            </div>
            <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed mb-4">
              ហាងលក់កុំព្យូទ័រ ទូរសព្ទ កាមេរ៉ា និងគ្រឿងបន្លាស់គុណភាពខ្ពស់ នៅរតនាគ ក្រុងបាត់ដំបង ធានាគុណភាព និងតម្លៃសមរម្យ។
            </p>

            {/* Social Buttons */}
            <div className="flex items-center gap-2.5 mb-5">
              {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-[#1E293B] rounded-lg flex items-center justify-center hover:bg-[#2563EB] hover:scale-105 transition-all text-sm cursor-pointer"
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-[#1E293B]/60 p-3 sm:p-3.5 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-300 font-semibold mb-2">
                📬 ទទួលបានប្រូម៉ូសិនពិសេស
              </p>
              {subscribed ? (
                <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs px-3 py-2 rounded-xl text-center font-medium">
                  ✓ អរគុណសម្រាប់ការចុះឈ្មោះ!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-1.5">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="អ៊ីមែលរបស់អ្នក..."
                    required
                    className="flex-1 min-w-0 bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#2563EB]"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex-shrink-0"
                  >
                    ផ្ញើ
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* 3 Link Columns: Always split into 3 columns side-by-side (grid-cols-3) on mobile and desktop */}
          <div className="lg:col-span-8 grid grid-cols-3 gap-2.5 sm:gap-6 pt-2 lg:pt-0 border-t border-slate-800/80 lg:border-t-0">
            {/* Column 1: ហាងទំនិញ */}
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white mb-2.5 sm:mb-4 pb-1 border-b border-slate-800 sm:border-b-0">
                ហាងទំនិញ
              </h4>
              <ul className="space-y-1.5 sm:space-y-2.5 text-[11px] sm:text-xs text-[#94A3B8]">
                {shopLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      onClick={scrollToTop}
                      className="hover:text-white hover:underline transition-colors block leading-snug py-0.5"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: ជំនួយអតិថិជន */}
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white mb-2.5 sm:mb-4 pb-1 border-b border-slate-800 sm:border-b-0">
                ជំនួយអតិថិជន
              </h4>
              <ul className="space-y-1.5 sm:space-y-2.5 text-[11px] sm:text-xs text-[#94A3B8]">
                {supportLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      onClick={scrollToTop}
                      className="hover:text-white hover:underline transition-colors block leading-snug py-0.5"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: គណនីរបស់ខ្ញុំ */}
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white mb-2.5 sm:mb-4 pb-1 border-b border-slate-800 sm:border-b-0">
                គណនីរបស់ខ្ញុំ
              </h4>
              <ul className="space-y-1.5 sm:space-y-2.5 text-[11px] sm:text-xs text-[#94A3B8]">
                {accountLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      onClick={scrollToTop}
                      className="hover:text-white hover:underline transition-colors block leading-snug py-0.5"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-[#1E293B] mt-8 sm:mt-10 pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-[#64748B] text-[10px] sm:text-xs">
            © 2026 SOKEINTECH. រក្សាសិទ្ធិគ្រប់យ៉ាង។ ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង។
          </p>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
            {['💳', '🏦', '📱', '💵'].map((icon, i) => (
              <span key={i} className="bg-[#1E293B] px-2 py-1 rounded text-xs">
                {icon}
              </span>
            ))}
            <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-2.5 py-1 rounded text-[10px] sm:text-xs font-black shadow-xs">
              KHQR
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

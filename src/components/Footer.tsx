import React, { useState } from 'react';
import { Link } from 'react-router';
import { SokeinLogoIcon } from './Logo';

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
    { label: 'ទំនិញពេញនិយម', href: '/shop?sort=popular' },
    { label: 'ប្រូម៉ូសិន', href: '/shop?sale=true' },
  ];

  const supportLinks = [
    { label: 'ទាក់ទងយើង', href: '/contact' },
    { label: 'ការដឹកជញ្ជូន', href: '/contact' },
    { label: 'ការធានា', href: '/contact' },
    { label: 'គោលការណ៍ប្តូរទំនិញ', href: '/contact' },
    { label: 'សំណួរដែលសួរញឹកញាប់', href: '/contact' },
  ];

  const accountLinks = [
    { label: 'ចូលគណនី', href: '/login' },
    { label: 'ការបញ្ជាទិញ', href: '/dashboard/orders' },
    { label: 'តាមដានការបញ្ជាទិញ', href: '/tracking' },
    { label: 'ទំនិញដែលចូលចិត្ត', href: '/wishlist' },
  ];

  return (
    <footer className="bg-[#0F172A] text-white mt-10 sm:mt-16 border-t border-slate-800 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-24 lg:pb-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-3">
              <SokeinLogoIcon className="w-10 h-10" showStatus={false} />
              <div>
                <div className="font-black text-lg sm:text-xl tracking-tight text-white">SOKEINTECH</div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium">ហាងបច្ចេកវិទ្យា និងអេឡិចត្រូនិកទំនើប</div>
              </div>
            </div>
            <p className="text-slate-300 text-[13.5px] sm:text-[14.5px] leading-relaxed mb-4">
              ហាងលក់កុំព្យូទ័រយួរដៃ កុំព្យូទ័រលើតុ ទូរសព្ទដៃ iPad កាមេរ៉ា DJI និងគ្រឿងបន្លាស់គុណភាពខ្ពស់ នៅរតនៈ ក្រុងបាត់ដំបង ធានាគុណភាព និងតម្លៃសមរម្យ។
            </p>

            {/* Social Buttons */}
            <div className="flex items-center gap-2.5 mb-5">
              {[
                { icon: '📘', label: 'Facebook' },
                { icon: '✈️', label: 'Telegram' },
                { icon: '🎵', label: 'TikTok' },
                { icon: '▶️', label: 'YouTube' },
              ].map((item, i) => (
                <button
                  key={i}
                  type="button"
                  title={item.label}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-[#1E293B] hover:bg-blue-600 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-base cursor-pointer shadow-xs"
                >
                  {item.icon}
                </button>
              ))}
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-[#1E293B]/70 p-4 rounded-2xl border border-slate-700/60 shadow-xs">
              <p className="text-sm font-bold text-white mb-2.5 flex items-center gap-2">
                <span>📬</span>
                <span>ទទួលបានការផ្តល់ជូនពិសេស & ប្រូម៉ូសិន</span>
              </p>
              {subscribed ? (
                <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm px-3.5 py-2.5 rounded-xl text-center font-bold">
                  ✓ អរគុណសម្រាប់ការចុះឈ្មោះ! យើងនឹងផ្ញើព័ត៌មានប្រូម៉ូសិនជូនលោកអ្នក។
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="បញ្ចូលអ៊ីមែលរបស់អ្នក..."
                    required
                    className="flex-1 min-w-0 bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex-shrink-0 shadow-md shadow-blue-600/20"
                  >
                    ផ្ញើ
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* 3 Link Columns: Always split into 3 columns side-by-side */}
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
            className="lg:col-span-7 gap-3 sm:gap-6 pt-4 lg:pt-0 border-t border-slate-800 lg:border-t-0 w-full"
          >
            {/* Column 1: ហាងទំនិញ */}
            <div className="min-w-0">
              <h4 className="font-bold text-[14.5px] sm:text-base text-white mb-3 sm:mb-4 pb-1.5 border-b border-slate-800/80 leading-tight">
                ហាងទំនិញ
              </h4>
              <ul className="space-y-2 sm:space-y-2.5 text-[13px] sm:text-[14px] text-slate-300">
                {shopLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      onClick={scrollToTop}
                      className="hover:text-blue-400 transition-colors block leading-snug py-0.5 break-words font-medium"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: ជំនួយអតិថិជន */}
            <div className="min-w-0">
              <h4 className="font-bold text-[14.5px] sm:text-base text-white mb-3 sm:mb-4 pb-1.5 border-b border-slate-800/80 leading-tight">
                ជំនួយអតិថិជន
              </h4>
              <ul className="space-y-2 sm:space-y-2.5 text-[13px] sm:text-[14px] text-slate-300">
                {supportLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      onClick={scrollToTop}
                      className="hover:text-blue-400 transition-colors block leading-snug py-0.5 break-words font-medium"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: គណនីរបស់ខ្ញុំ */}
            <div className="min-w-0">
              <h4 className="font-bold text-[14.5px] sm:text-base text-white mb-3 sm:mb-4 pb-1.5 border-b border-slate-800/80 leading-tight">
                គណនីរបស់ខ្ញុំ
              </h4>
              <ul className="space-y-2 sm:space-y-2.5 text-[13px] sm:text-[14px] text-slate-300">
                {accountLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      onClick={scrollToTop}
                      className="hover:text-blue-400 transition-colors block leading-snug py-0.5 break-words font-medium"
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
        <div className="border-t border-slate-800 mt-8 sm:mt-12 pt-6 flex items-center justify-center text-center">
          <p className="text-slate-300 text-sm sm:text-[15px] font-medium leading-relaxed">
            © 2026{' '}
            <span className="font-extrabold bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              SOKEINTECH
            </span>
            . រក្សាសិទ្ធិគ្រប់យ៉ាង។ ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង។
          </p>
        </div>
      </div>
    </footer>
  );
}

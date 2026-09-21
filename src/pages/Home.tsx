import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import ProductCard from '../components/ProductCard';
import HeroSlideshow from '../components/HeroSlideshow';
import { products as fallbackProducts, categories as fallbackCategories, brands } from '../data/products';
import { api } from '../services/api';
import type { Product } from '../data/products';

function CountdownTimer() {
  const [time, setTime] = useState({ days: 0, hours: 5, minutes: 23, seconds: 47 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) return prev;
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const units = [
    { value: pad(time.days), label: 'ថ្ងៃ' },
    { value: pad(time.hours), label: 'ម៉ោង' },
    { value: pad(time.minutes), label: 'នាទី' },
    { value: pad(time.seconds), label: 'វិនាទី' },
  ];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {units.map((u, i) => (
        <div key={i} className="flex items-center gap-1.5 sm:gap-2">
          <div className="bg-[#0F172A] text-white rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-center min-w-[44px] sm:min-w-[52px]">
            <div className="text-lg sm:text-2xl font-bold font-mono">{u.value}</div>
            <div className="text-[10px] sm:text-xs text-[#94A3B8]">{u.label}</div>
          </div>
          {i < 3 && <span className="text-lg sm:text-2xl font-bold text-[#DC2626]">:</span>}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    api.products
      .list({ limit: 100 })
      .then(res => {
        if (res.products && res.products.length > 0) {
          setAllProducts(res.products);
        }
      })
      .catch(err => {
        console.warn('Using local products cache:', err);
      });
  }, []);

  const featured = allProducts.filter(p => p.isFeatured);
  const newProducts = allProducts.filter(p => p.isNew);
  const flashSale = allProducts.filter(p => p.discount >= 10);
  const categories = fallbackCategories;

  return (
    <div>
      {/* Dynamic Interactive Hero Slideshow */}
      <HeroSlideshow />

      {/* Store Highlights / Trust Features */}
      <section className="border-y border-slate-100 bg-white py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 text-lg sm:text-xl font-bold">
                🚚
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">ដឹកជញ្ជូន 25 ខេត្ត/ក្រុង</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">ឥតគិតថ្លៃសម្រាប់ $50+</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 text-lg sm:text-xl font-bold">
                🛡️
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">ទំនិញសុទ្ធ 100% ធានា</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">ធានា 1-2 ឆ្នាំផ្លូវការ</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 text-lg sm:text-xl font-bold">
                💳
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">ទូទាត់តាម KHQR</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Bakong, ABA & Wing</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 text-lg sm:text-xl font-bold">
                📞
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">សេវាប្រឹក្សា & ជំនួយ</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Tel: 087 812 643</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0F172A] mb-1 sm:mb-2">ទិញតាមប្រភេទ</h2>
          <p className="text-xs sm:text-sm text-[#64748B]">ស្វែងរកទំនិញតាមប្រភេទដែលអ្នកត្រូវការ</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
          {categories.map(cat => (
            <Link key={cat.id} to={`/shop?category=${cat.id}`} className="group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-lg hover:border-[#2563EB] transition-all">
              <div className="aspect-video bg-[#F8FAFC] overflow-hidden">
                <img src={cat.image} alt={cat.nameKh} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-2.5 sm:p-3 text-center">
                <div className="font-bold text-[#1E293B] text-xs sm:text-sm mb-0.5">{cat.nameKh}</div>
                <div className="text-[11px] sm:text-xs text-[#64748B]">មាន {cat.count.toLocaleString()} ទំនិញ</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0F172A] mb-1">ទំនិញពេញនិយម</h2>
              <p className="text-xs sm:text-sm text-[#64748B]">ទំនិញដែលអតិថិជនចូលចិត្ត និងជ្រើសរើសច្រើន</p>
            </div>
            <Link to="/shop?sort=popular" className="text-[#2563EB] text-xs sm:text-sm hover:underline font-bold">មើលទាំងអស់ →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-[#DC2626] to-[#9333EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div>
              <div className="text-white/80 text-xs sm:text-sm font-medium mb-1">⚡ ប្រូម៉ូសិន</div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-1">ការផ្តល់ជូនពិសេស</h2>
              <p className="text-white/80 text-xs sm:text-sm">ប្រញាប់ឡើង! ការផ្តល់ជូននេះមានពេលកំណត់</p>
            </div>
            <CountdownTimer />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mb-6">
            {flashSale.slice(0, 3).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center">
            <Link to="/shop?sale=true" className="bg-white text-[#DC2626] px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-red-50 inline-block">
              មើលទំនិញទាំងអស់ →
            </Link>
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0F172A] mb-1">ទំនិញថ្មី</h2>
            <p className="text-xs sm:text-sm text-[#64748B]">ទំនិញ និងបច្ចេកវិទ្យាថ្មីៗដែលទើបមកដល់</p>
          </div>
          <Link to="/shop?sort=new" className="text-[#2563EB] text-xs sm:text-sm hover:underline font-bold">មើលទាំងអស់ →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {newProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Promo Banners */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { title: 'កាមេរ៉ាជំនាន់ថ្មី', desc: 'ថតរូបល្អ ច្បាស់ ជាមួយ Mirrorless & Action Cameras', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=200&fit=crop&auto=format', color: 'from-[#0F172A]', link: '/shop?category=cameras' } as const,
            { title: 'ស្មាតហ្វូនជំនាន់ថ្មី', desc: 'បច្ចេកវិទ្យាទំនើបក្នុងដៃអ្នក', img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=200&fit=crop&auto=format', color: 'from-[#1D4ED8]', link: '/shop?category=phones' } as const,
            { title: 'កុំព្យូទ័រ Gaming ជំនាន់ថ្មី', desc: 'ថាមពលខ្លាំង សម្រាប់ការងារ និង Gaming', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=200&fit=crop&auto=format', color: 'from-[#7C3AED]', link: '/shop?category=gaming' } as const,
          ].map((b, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden group cursor-pointer">
              <img src={b.img} alt={b.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className={`absolute inset-0 bg-gradient-to-r ${b.color} to-transparent flex flex-col justify-center p-6`}>
                <h3 className="text-white font-bold text-lg mb-1">{b.title}</h3>
                <p className="text-white/80 text-sm mb-4">{b.desc}</p>
                <Link to={b.link} className="bg-white text-[#1E293B] text-sm font-semibold px-4 py-2 rounded-lg w-fit hover:bg-[#F8FAFC]">
                  មើលឥឡូវនេះ →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brands */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">ម៉ាកពេញនិយម</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {brands.map(b => (
            <Link key={b} to={`/shop?brand=${b}`} className="bg-white border border-[#E2E8F0] rounded-2xl px-8 py-5 text-[#1E293B] font-semibold hover:border-[#2563EB] hover:text-[#2563EB] hover:shadow-md transition-all">
              {b}
            </Link>
          ))}
        </div>
      </section>

      {/* Cameras Section */}
      <section className="py-12 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-1.5 rounded-full mb-5 font-medium">
                📷 ថ្មី — Camera Collection 2024
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ថតរូបល្អ<br />
                <span className="text-[#60A5FA]">ជាមួយកាមេរ៉ាល្អបំផុត</span>
              </h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                Sony, Canon, Nikon, GoPro, DJI — ជ្រើសរើសកាមេរ៉ាដែលសាកសមសម្រាប់អ្នក ពី Mirrorless ដល់ Action Camera ។
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {[['📸 Mirrorless', 'cameras'], ['🎬 Vlog Camera', 'cameras'], ['🏄 Action Camera', 'cameras']].map(([label, cat]) => (
                  <Link key={label} to={`/shop?category=${cat}`} className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-xl transition-colors">
                    {label}
                  </Link>
                ))}
              </div>
              <Link to="/shop?category=cameras" className="bg-[#2563EB] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#1D4ED8] inline-block">
                មើលកាមេរ៉ាទាំងអស់ →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Sony Alpha A7 IV', price: '$2,499', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=220&fit=crop&auto=format', badge: 'ពេញនិយម' },
                { name: 'Canon EOS R50', price: '$699', img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=220&fit=crop&auto=format', badge: 'ថ្មី' },
                { name: 'GoPro HERO13', price: '$399', img: 'https://images.unsplash.com/photo-1565689975096-bde7b9a48a09?w=300&h=220&fit=crop&auto=format', badge: 'Action' },
                { name: 'DJI Osmo Pocket 3', price: '$519', img: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=300&h=220&fit=crop&auto=format', badge: 'Gimbal' },
              ].map(cam => (
                <Link key={cam.name} to="/shop?category=cameras" className="relative rounded-2xl overflow-hidden group">
                  <img src={cam.img} alt={cam.name} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex flex-col justify-end">
                    <span className="text-white text-xs font-semibold leading-tight">{cam.name}</span>
                    <span className="text-[#60A5FA] text-sm font-bold">{cam.price}</span>
                  </div>
                  <span className="absolute top-2 left-2 bg-[#2563EB] text-white text-xs px-2 py-0.5 rounded-full">{cam.badge}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A]">ហេតុអ្វីជ្រើសរើសយើង?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🚀', title: 'ដឹកជញ្ជូនរហ័ស', desc: 'ទទួលបានទំនិញដោយសុវត្ថិភាព និងទាន់ពេលវេលា។' },
              { icon: '🔒', title: 'ការទូទាត់មានសុវត្ថិភាព', desc: 'គាំទ្រវិធីទូទាត់ងាយស្រួល និងមានសុវត្ថិភាព។' },
              { icon: '✅', title: 'ធានាគុណភាព', desc: 'ផលិតផលមានគុណភាព និងការធានាច្បាស់លាស់។' },
              { icon: '💬', title: 'សេវាអតិថិជន', desc: 'ក្រុមការងាររបស់យើងត្រៀមជួយអ្នក 24/7។' },
            ].map(f => (
              <div key={f.title} className="text-center p-6 rounded-2xl border border-[#E2E8F0] hover:shadow-lg hover:border-[#2563EB] transition-all group">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-[#1E293B] mb-2 group-hover:text-[#2563EB]">{f.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

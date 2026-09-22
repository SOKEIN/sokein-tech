import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface Slide {
  id: number;
  tag: string;
  badge: string;
  badgeColor: string;
  title: string;
  highlight: string;
  description: string;
  primaryBtn: { text: string; link: string };
  secondaryBtn: { text: string; link: string };
  image: string;
  features: string[];
  stat: { value: string; label: string };
}

const slides: Slide[] = [
  {
    id: 1,
    tag: '✨ បច្ចេកវិទ្យាថ្មី • តម្លៃពិសេស',
    badge: '🔥 បញ្ចុះតម្លៃរហូតដល់ 30%',
    badgeColor: 'from-rose-600 to-red-600',
    title: 'ស្វែងរកបច្ចេកវិទ្យា',
    highlight: 'ដែលសាកសមសម្រាប់អ្នក',
    description: 'ជ្រើសរើសកុំព្យូទ័រយួរដៃ ASUS, Apple, Dell, Lenovo គុណភាពខ្ពស់ តម្លៃសមរម្យ និងមានការធានាផ្លូវការ ២ឆ្នាំ។',
    primaryBtn: { text: 'ទិញកុំព្យូទ័រឥឡូវនេះ', link: '/shop?category=laptops' },
    secondaryBtn: { text: 'មើលទំនិញទាំងអស់', link: '/shop' },
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&h=600&fit=crop&auto=format',
    features: ['✓ ការធានាគុណភាព', '✓ ដឹកជញ្ជូនរហ័សទូទាំងខេត្ត', '✓ ត្រឡប់ 30 ថ្ងៃ'],
    stat: { value: '+120 ម៉ូដែល', label: 'កុំព្យូទ័រក្នុងស្តុក' },
  },
  {
    id: 2,
    tag: '📱 ស្មាតហ្វូន & ថេប្លេត Flagship',
    badge: '🎁 ថែមជូនកាដូពិសេស $80+',
    badgeColor: 'from-blue-600 to-indigo-600',
    title: 'iPhone 16 Pro &',
    highlight: 'Galaxy S24 Ultra',
    description: 'កាមេរ៉ាកំពូលច្បាស់ បច្ចេកវិទ្យា AI ទំនើប ថ្មកាន់បានយូរ ថែមជូនស្រោមការពារ មេដែកសាក និងធានា ១ឆ្នាំពេញ។',
    primaryBtn: { text: 'ស្វែងរកទូរសព្ទ & ថេប្លេត', link: '/shop?category=phones' },
    secondaryBtn: { text: 'ប្រូម៉ូសិនពិសេស', link: '/shop?sale=true' },
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=900&h=600&fit=crop&auto=format',
    features: ['✓ ទំនិញសុទ្ធ 100%', '✓ គាំទ្របង់រំលស់ 0%', '✓ ធានារយៈពេល 1 ឆ្នាំ'],
    stat: { value: 'Flagship', label: 'ជំនាន់ចុងក្រោយ' },
  },
  {
    id: 3,
    tag: '⚡ Gaming Gear & PC Custom Build',
    badge: '🚀 RTX 40-Series • Core i9',
    badgeColor: 'from-purple-600 to-indigo-600',
    title: 'ថាមពលខ្លាំងគ្មានដែនកំណត់',
    highlight: 'សម្រាប់ Gaming & 3D Render',
    description: 'រៀបចំកុំព្យូទ័រ Gaming PC កម្លាំងខ្លាំង RTX 4070 / 4080 / 4090, Intel Core i9, Liquid Cooling ត្រជាក់ស្ងាត់ និងលឿនរហ័ស។',
    primaryBtn: { text: 'រៀបចំ PC Gaming', link: '/shop?category=gaming' },
    secondaryBtn: { text: 'មើលគ្រឿងបន្លាស់', link: '/shop?category=accessories' },
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=900&h=600&fit=crop&auto=format',
    features: ['✓ Graphic Card កំពូល', '✓ តម្លើងឥតគិតថ្លៃ', '✓ ធានាគ្រឿងបន្លាស់ 3ឆ្នាំ'],
    stat: { value: '240+ FPS', label: 'Ultra High Performance' },
  },
  {
    id: 4,
    tag: '📸 កាមេរ៉ា & ឧបករណ៍ Creators',
    badge: '✨ ការធានាផ្លូវការ 100%',
    badgeColor: 'from-amber-600 to-orange-600',
    title: 'ផ្តិតយករូបភាពកម្រិត 4K/8K',
    highlight: 'Sony, Canon, GoPro, DJI',
    description: 'កាមេរ៉ា Mirrorless, Action Cam, Gimbal លំដាប់អាជីព សម្រាប់ Creators, ថតរូបពិធីការ និង Vlog ការងារកម្សាន្ត។',
    primaryBtn: { text: 'មើលកាមេរ៉ាទាំងអស់', link: '/shop?category=cameras' },
    secondaryBtn: { text: 'មើលគ្រឿងបន្លាស់', link: '/shop' },
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&h=600&fit=crop&auto=format',
    features: ['✓ Sensor ធំច្បាស់', '✓ ស្ថេរភាព 3-Axis', '✓ ថតវីដេអូ 4K 120fps'],
    stat: { value: 'Cinema 4K', label: 'គុណភាពកម្រិតខ្ពស់' },
  },
];

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto slide every 5.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrent(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  const slide = slides[current];

  return (
    <div
      className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/40 to-slate-50 border-b border-slate-100 py-6 sm:py-10 md:py-16 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
          {/* Left Column: Text & Actions */}
          <div className="order-2 md:order-1 transition-all duration-500 ease-out">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 bg-white border border-blue-200/80 text-blue-600 text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 rounded-full mb-3 sm:mb-5 font-semibold shadow-2xs">
              {slide.tag}
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-2.5 sm:mb-4 tracking-tight min-h-[72px] sm:min-h-[110px]">
              {slide.title}
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                {slide.highlight}
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-600 mb-5 sm:mb-7 text-xs sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-none min-h-[48px] sm:min-h-[60px]">
              {slide.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3.5">
              <Link
                to={slide.primaryBtn.link}
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                className="flex-1 sm:flex-none text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-102 active:scale-98"
              >
                {slide.primaryBtn.text} →
              </Link>
              <Link
                to={slide.secondaryBtn.link}
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                className="flex-1 sm:flex-none text-center bg-white text-blue-600 px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm border border-blue-200 hover:bg-blue-50/70 shadow-2xs transition-all hover:scale-102 active:scale-98"
              >
                {slide.secondaryBtn.text}
              </Link>
            </div>

            {/* Trust bullet highlights */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-5 sm:mt-8 text-[11px] sm:text-xs text-slate-500">
              {slide.features.map(f => (
                <span key={f} className="font-semibold text-emerald-600 flex items-center gap-1">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Slide Visual Showcase */}
          <div className="order-1 md:order-2 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 aspect-[4/3] sm:aspect-[16/10] group">
              <img
                key={slide.image}
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Discount / Promo Badge */}
              <div className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-gradient-to-r ${slide.badgeColor} text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-extrabold shadow-lg`}>
                {slide.badge}
              </div>

              {/* Stat Card */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-white/60">
                <div className="text-[10px] text-slate-500 font-semibold">{slide.stat.label}</div>
                <div className="text-xs sm:text-sm font-black text-slate-900">{slide.stat.value}</div>
              </div>

              {/* Arrow Buttons inside Image (visible on hover or mobile) */}
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer backdrop-blur-xs"
                aria-label="Previous Slide"
              >
                <ChevronLeftIcon size={20} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer backdrop-blur-xs"
                aria-label="Next Slide"
              >
                <ChevronRightIcon size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
          {slides.map((s, index) => {
            const isActive = index === current;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrent(index)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-8 h-2.5 bg-blue-600 shadow-xs'
                    : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

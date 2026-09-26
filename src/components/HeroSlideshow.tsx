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
  highlightClass: string;
  accentGlow: string;
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
    tag: '✨ Flagship 2026 • កម្លាំងខ្លាំងបំផុត',
    badge: '🔥 បញ្ចុះតម្លៃរហូតដល់ 30%',
    badgeColor: 'from-blue-600 to-indigo-600',
    title: 'MacBook Pro 16" M5 Max',
    highlight: 'កំពូលកុំព្យូទ័រជំនាន់ថ្មី',
    highlightClass: 'text-blue-600 dark:text-blue-400',
    accentGlow: 'from-blue-500/20 via-blue-500/5 to-transparent',
    description: 'ស្វែងរក MacBook Pro M5, ASUS ROG, Dell XPS កម្លាំងខ្លាំងបំផុតសម្រាប់ការងារ 3D, Render និង Code ជាមួយការធានាផ្លូវការ។',
    primaryBtn: { text: 'ទិញកុំព្យូទ័រឥឡូវនេះ', link: '/shop?category=laptops' },
    secondaryBtn: { text: 'មើលទំនិញទាំងអស់', link: '/shop' },
    image: '/products/macbook-pro-m5.jpg',
    features: ['✓ Chip M5 Max ជំនាន់ថ្មី', '✓ ដឹកជញ្ជូនរហ័សទូទាំងខេត្ត', '✓ ធានាផ្លូវការ ២ឆ្នាំ'],
    stat: { value: '+120 ម៉ូដែល', label: 'កុំព្យូទ័រក្នុងស្តុក' },
  },
  {
    id: 2,
    tag: '🍒 Flagship 2026 • ពណ៌ពេញនិយម',
    badge: '🍒 ពណ៌ Deep Cherry កំពុង Hot',
    badgeColor: 'from-rose-600 to-red-600',
    title: 'iPhone 18 Pro Max',
    highlight: 'ពណ៌ Deep Cherry Titanium',
    highlightClass: 'text-rose-600 dark:text-rose-400',
    accentGlow: 'from-rose-500/20 via-rose-500/5 to-transparent',
    description: 'កំពូលស្មាតហ្វូនជំនាន់ថ្មី ពណ៌ Deep Cherry Titanium គ្រាប់ឈើរីក្រហមស្អាតរលោង តួខ្លួន Titanium កម្រិតអវកាស បំពាក់បន្ទះឈីប A20 Pro Bionic និងកាមេរ៉ា 3D Periscope 100x Zoom។',
    primaryBtn: { text: 'ទិញ iPhone 18 Pro Max', link: '/shop?category=phones' },
    secondaryBtn: { text: 'ប្រូម៉ូសិនពិសេស', link: '/shop?sale=true' },
    image: '/products/iphone-18-pro-max-cherry.jpg?v=20260926b',
    features: ['✓ ពណ៌ Deep Cherry ពេញនិយម', '✓ ទំនិញសុទ្ធ 100%', '✓ ធានារយៈពេល 1 ឆ្នាំ'],
    stat: { value: 'Deep Cherry', label: 'ពណ៌ Hot ពេញនិយម' },
  },
  {
    id: 3,
    tag: '⚡ Gaming Gear & Custom Build',
    badge: '🚀 RTX 40-Series • Core i9',
    badgeColor: 'from-purple-600 to-indigo-600',
    title: 'ASUS ROG Strix Gaming',
    highlight: 'ថាមពលខ្លាំងគ្មានដែនកំណត់',
    highlightClass: 'text-purple-600 dark:text-purple-400',
    accentGlow: 'from-purple-500/20 via-purple-500/5 to-transparent',
    description: 'រៀបចំកុំព្យូទ័រ Gaming PC កម្លាំងខ្លាំង RTX 4070 / 4080 / 4090, Intel Core i9, Liquid Cooling ត្រជាក់ស្ងាត់ និងលឿនរហ័ស។',
    primaryBtn: { text: 'រៀបចំ PC Gaming', link: '/shop?category=gaming' },
    secondaryBtn: { text: 'មើលគ្រឿងបន្លាស់', link: '/shop?category=accessories' },
    image: '/products/asus-rog-strix-pc.jpg',
    features: ['✓ Graphic Card កំពូល', '✓ តម្លើងឥតគិតថ្លៃ', '✓ ធានាគ្រឿងបន្លាស់ 3ឆ្នាំ'],
    stat: { value: '240+ FPS', label: 'Ultra High Performance' },
  },
  {
    id: 4,
    tag: '📸 កាមេរ៉ា & ឧបករណ៍ Creators',
    badge: '✨ ការធានាផ្លូវការ 100%',
    badgeColor: 'from-amber-600 to-orange-600',
    title: 'Sony Alpha A7 IV & DJI',
    highlight: 'ឧបករណ៍ Creators អាជីព',
    highlightClass: 'text-amber-600 dark:text-amber-400',
    accentGlow: 'from-amber-500/20 via-amber-500/5 to-transparent',
    description: 'កាមេរ៉ា Full-Frame Mirrorless, DJI Drones និង Handheld Gimbal លំដាប់អាជីព សម្រាប់ Creators, ថតរូបពិធីការ និង Vlog ការងារកម្សាន្ត។',
    primaryBtn: { text: 'មើលកាមេរ៉ាទាំងអស់', link: '/shop?category=cameras' },
    secondaryBtn: { text: 'មើលគ្រឿងបន្លាស់', link: '/shop' },
    image: '/products/sony-alpha-a7-iv.jpg',
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
      className="relative overflow-hidden bg-slate-50 dark:bg-[#070B14] border-b border-slate-200/80 dark:border-slate-800/80 py-8 sm:py-12 md:py-16 select-none transition-colors"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic ambient spotlight behind device matching slide theme */}
      <div
        className={`absolute top-0 right-0 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full blur-3xl pointer-events-none transition-all duration-700 bg-gradient-to-br ${slide.accentGlow}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column: Text & Actions */}
          <div className="order-2 md:order-1 transition-all duration-500 ease-out">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm px-4 py-1.5 rounded-full mb-4 sm:mb-5 font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{slide.tag}</span>
            </div>

            {/* Headline: Clean, Solid, High-Contrast 2 Lines (No Faded Gray Text) */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white leading-[1.2] mb-3 sm:mb-4 tracking-tight">
              <span className="block">{slide.title}</span>
              <span className={`block mt-1 font-black ${slide.highlightClass}`}>
                {slide.highlight}
              </span>
            </h1>

            {/* Description: Deep, Legible, High-Contrast */}
            <p className="text-slate-700 dark:text-slate-200 mb-6 sm:mb-8 text-xs sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-none font-medium max-w-xl">
              {slide.description}
            </p>

            {/* Action Buttons: Bold, Tactile, Modern */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                to={slide.primaryBtn.link}
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                className="flex-1 sm:flex-none text-center bg-slate-950 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 px-6 sm:px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{slide.primaryBtn.text}</span>
                <span>→</span>
              </Link>
              <Link
                to={slide.secondaryBtn.link}
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                className="flex-1 sm:flex-none text-center bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-5 sm:px-7 py-3.5 rounded-2xl font-bold text-xs sm:text-sm border-2 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 shadow-2xs transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                {slide.secondaryBtn.text}
              </Link>
            </div>

            {/* Trust bullet highlights */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-6 sm:mt-8 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {slide.features.map(f => (
                <span
                  key={f}
                  className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-xl shadow-2xs"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Slide Visual Showcase */}
          <div className="order-1 md:order-2 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 aspect-[4/3] sm:aspect-[16/10] group">
              <img
                key={slide.image}
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
              />

              {/* Stat Card Top Left */}
              <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{slide.stat.label}</div>
                <div className="text-xs sm:text-sm font-black text-slate-950 dark:text-white">{slide.stat.value}</div>
              </div>

              {/* Promo Badge Bottom Right */}
              <div className={`absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 bg-gradient-to-r ${slide.badgeColor} text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black shadow-lg`}>
                {slide.badge}
              </div>

              {/* Arrow Buttons */}
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-white flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer backdrop-blur-xs border border-slate-200 dark:border-slate-700"
                aria-label="Previous Slide"
              >
                <ChevronLeftIcon size={20} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-white flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer backdrop-blur-xs border border-slate-200 dark:border-slate-700"
                aria-label="Next Slide"
              >
                <ChevronRightIcon size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2.5 mt-8 sm:mt-10">
          {slides.map((s, index) => {
            const isActive = index === current;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrent(index)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-10 h-2.5 bg-slate-950 dark:bg-white shadow-xs'
                    : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
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

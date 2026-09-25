import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { products as fallbackProducts, categories as catalogCategories } from '../data/products';
import {
  PhoneIcon,
  SearchIcon,
  ShoppingBagIcon,
  HeartIcon,
  UserIcon,
  CrownIcon,
  ChevronDownIcon,
  XIcon,
  MenuIcon,
  GridIcon,
  TrashIcon,
  LogoutIcon,
  LaptopIcon,
  SmartphoneIcon,
  CameraIcon,
  HeadphonesIcon,
  WatchIcon,
  SunIcon,
  MoonIcon,
  GamepadIcon,
} from './Icons';
import { SokeinLogoIcon } from './Logo';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity, wishlist } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Search state
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof fallbackProducts>([]);

  // Menu dropdown states
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuTab, setMobileMenuTab] = useState<'categories' | 'pages'>('categories');

  // Currency
  const [currency, setCurrency] = useState<'USD' | 'KHR'>(() => {
    return (localStorage.getItem('esokein_currency') as 'USD' | 'KHR') || 'USD';
  });

  // Refs for click outside
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const KHR_RATE = 4100;
  const formatPrice = (usd: number) => {
    if (currency === 'KHR') {
      return `${(usd * KHR_RATE).toLocaleString()} ៛`;
    }
    return `$${usd.toLocaleString()}`;
  };

  const setCurrencyChoice = (c: 'USD' | 'KHR') => {
    setCurrency(c);
    localStorage.setItem('esokein_currency', c);
  };

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Live search
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    const q = search.toLowerCase().trim();
    const matches = fallbackProducts.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.nameKh.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.categoryKh.toLowerCase().includes(q)
    );
    setSearchResults(matches.slice(0, 5));
  }, [search]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedDesktopSearch = searchRef.current && searchRef.current.contains(target);
      const clickedMobileSearch = mobileSearchRef.current && mobileSearchRef.current.contains(target);
      if (!clickedDesktopSearch && !clickedMobileSearch) {
        setSearchFocused(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(target)) {
        setCategoryMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(target)) {
        setCartDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchFocused(false);
    setCategoryMenuOpen(false);
    setCartDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname, location.search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?q=${encodeURIComponent(search.trim())}`);
      setSearchFocused(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'ទំព័រដើម', icon: null },
    { to: '/shop', label: 'ទំនិញទាំងអស់', icon: null },
    { to: '/shop?category=laptops', label: 'កុំព្យូទ័រយួរដៃ', icon: '💻' },
    { to: '/shop?category=desktops', label: 'កុំព្យូទ័រលើតុ', icon: '🖥️' },
    { to: '/shop?category=phones', label: 'ទូរសព្ទដៃ', icon: '📱' },
    { to: '/shop?category=tablets', label: 'iPad & ថេប្លេត', icon: '📟' },
    { to: '/shop?category=cameras', label: 'កាមេរ៉ា & DJI', icon: '📷' },
    { to: '/shop?sale=true', label: 'ប្រូម៉ូសិនពិសេស', icon: '🔥', highlight: true },
    { to: '/tracking', label: 'តាមដានការកុម្ម៉ង់', icon: '🚚' },
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'គ្រប់គ្រង Admin', icon: '👑', highlight: false }] : []),
    { to: '/contact', label: 'ទំនាក់ទំនង', icon: null },
  ];

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'laptops':
      case 'desktops':
        return <LaptopIcon size={20} className="text-blue-600" />;
      case 'phones':
      case 'tablets':
        return <SmartphoneIcon size={20} className="text-emerald-600" />;
      case 'cameras':
        return <CameraIcon size={20} className="text-rose-600" />;
      case 'audio':
        return <HeadphonesIcon size={20} className="text-purple-600" />;
      case 'gaming':
        return <GamepadIcon size={20} className="text-indigo-600" />;
      default:
        return <WatchIcon size={20} className="text-amber-600" />;
    }
  };

  return (
    <header className="bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800 shadow-xs select-none w-full">
      {/* 0. TOP ANNOUNCEMENT MARQUEE BAR */}
      <div className="bg-slate-950 text-slate-200 border-b border-slate-800/80 overflow-hidden relative select-none py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium">
        {/* Left & Right gradient edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee items-center gap-8 text-slate-300">
          {/* Repeated twice for seamless infinite marquee loop */}
          {[1, 2].map(cycle => (
            <div key={cycle} className="flex items-center gap-8 shrink-0">
              <Link
                to="/shop?sale=true"
                className="flex items-center gap-2 hover:text-amber-300 transition-colors group cursor-pointer"
              >
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                  HOT PROMO
                </span>
                <span className="font-semibold text-white">ប្រូម៉ូសិនពិសេស:</span>
                <span>បញ្ចុះតម្លៃរហូតដល់ 30% លើកុំព្យូទ័រ & គ្រឿងបន្លាស់!</span>
              </Link>

              <span className="text-blue-500/70 select-none">✦</span>

              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">🚚</span>
                <span className="font-semibold text-white">ដឹកជញ្ជូនឥតគិតថ្លៃ:</span>
                <span>សម្រាប់រាល់ការកុម្ម៉ង់ចាប់ពី $50 ឡើងទៅ ២៥ ខេត្ត-ក្រុង</span>
              </div>

              <span className="text-blue-500/70 select-none">✦</span>

              <div className="flex items-center gap-1.5">
                <span className="text-blue-400">🛡️</span>
                <span className="font-semibold text-white">ការធានាផ្លូវការ 100%:</span>
                <span>ផលិតផលសុទ្ធ មានការធានាត្រឹមត្រូវ 1 ទៅ 2 ឆ្នាំពីក្រុមហ៊ុន</span>
              </div>

              <span className="text-blue-500/70 select-none">✦</span>

              <div className="flex items-center gap-1.5">
                <span className="text-purple-400">🎁</span>
                <span className="font-semibold text-white">កាដូថែមជូន:</span>
                <span>ទទួលបាន Mouse, កាតាប និង Mousepad ឥតគិតថ្លៃពេលទិញ Laptop</span>
              </div>

              <span className="text-blue-500/70 select-none">✦</span>

              <a
                href="tel:087812643"
                className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <span className="text-cyan-400">📞</span>
                <span className="font-semibold text-white">ផ្នែកលក់ & ពិគ្រោះ:</span>
                <span className="font-bold text-cyan-300">087 812 643 / 092 123 456</span>
              </a>

              <span className="text-blue-500/70 select-none">✦</span>

              <Link
                to="/contact"
                className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <span className="text-amber-400">📍</span>
                <span className="font-semibold text-white">ទីតាំងហាង:</span>
                <span>ភូមិរតនៈ ក្រុងបាត់ដំបង (8:00 AM - 8:00 PM)</span>
              </Link>

              <span className="text-blue-500/70 select-none">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* 1. TOP SIGNATURE ACCENT LINE */}
      <div className="h-0.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

      {/* 2. MAIN HEADER ROW */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6">
        <div className="flex items-center justify-between gap-2.5 sm:gap-4 md:gap-6 py-2.5 sm:py-3.5">
          {/* Logo with Modern Tech Badge & Glow */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group">
            <SokeinLogoIcon className="w-10 h-10 sm:w-12 sm:h-12" showStatus={true} />
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
                <span className="font-black text-lg sm:text-2xl text-slate-900 dark:text-white tracking-tight">SOKEIN</span>
                <span className="font-black text-lg sm:text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                  TECH
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400 font-medium tracking-normal mt-1 leading-tight">
                <span>📍 រតនៈ បាត់ដំបង</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">ហាងបច្ចេកវិទ្យា</span>
              </div>
            </div>
          </Link>

          {/* Interactive Search Capsule with Embedded Button (Desktop only) */}
          <div ref={searchRef} className="relative flex-1 max-w-xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="absolute left-4 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors">
                <SearchIcon size={19} />
              </div>
              <input
                type="text"
                value={search}
                onFocus={() => setSearchFocused(true)}
                onChange={e => setSearch(e.target.value)}
                placeholder="ស្វែងរកកុំព្យូទ័រ, ទូរសព្ទ, កាមេរ៉ា, គ្រឿងបន្លាស់..."
                className={`w-full pl-11 pr-24 py-2.5 bg-slate-100/80 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-[15px] text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-full border transition-all duration-200 focus:outline-none focus:bg-white dark:focus:bg-slate-900 ${
                  searchFocused
                    ? 'border-blue-600 ring-4 ring-blue-500/10 shadow-xs'
                    : 'border-slate-200/80 dark:border-slate-700'
                }`}
              />

              {/* Clear button */}
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-20 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <XIcon size={15} />
                </button>
              )}

              {/* Embedded Sleek Search Action */}
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                ស្វែងរក
              </button>
            </form>

            {/* Live Search Suggestion Dropdown */}
            {searchFocused && search.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-fade-in-down">
                <div className="p-2 divide-y divide-slate-50 dark:divide-slate-800">
                  {searchResults.length > 0 ? (
                    searchResults.map(item => (
                      <Link
                        key={item.id}
                        to={`/product/${item.id}`}
                        onClick={() => setSearchFocused(false)}
                        className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-blue-50/60 dark:hover:bg-slate-800/70 transition-colors group"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.nameKh || item.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.brand} • {item.categoryKh}
                          </div>
                        </div>
                        <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400 text-right">
                          {formatPrice(item.price)}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                      មិនមានទំនិញដែលត្រូវនឹង &ldquo;{search}&rdquo;
                    </div>
                  )}
                </div>
                {searchResults.length > 0 && (
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full py-2.5 bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50 dark:hover:bg-slate-800 text-center text-sm font-bold text-blue-600 dark:text-blue-400 border-t border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
                  >
                    មើលលទ្ធផលទាំងអស់សម្រាប់ &ldquo;{search}&rdquo; →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Action Center */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 flex-shrink-0">
            {/* 1. Hotline Pill (Desktop only) */}
            <a
              href="tel:+855087812643"
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50/70 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700 hover:border-blue-200 transition-all group"
              title="សេវាកម្មអតិថិជន"
            >
              <div className="w-7 h-7 rounded-xl bg-blue-100/70 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <PhoneIcon size={14} />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                  <span>ជំនួយ</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="font-extrabold text-xs text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  087 812 643
                </div>
              </div>
            </a>

            {/* 2. Segmented Currency Switcher (Optimized for small mobile) */}
            <div className="flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700 text-[11px] sm:text-xs font-bold">
              <button
                type="button"
                onClick={() => setCurrencyChoice('USD')}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg transition-all cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="ដុល្លារអាមេរិក"
              >
                USD
              </button>
              <button
                type="button"
                onClick={() => setCurrencyChoice('KHR')}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg transition-all cursor-pointer ${
                  currency === 'KHR'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="រៀលខ្មែរ"
              >
                ៛ KHR
              </button>
            </div>

            {/* Theme Toggle Button (Light / Dark Mode) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
              title={theme === 'dark' ? 'ប្ដូរទៅ Light Mode' : 'ប្ដូរទៅ Dark Mode'}
              aria-label="ប្ដូរពន្លឺ / ងងឹត (Theme)"
            >
              {theme === 'dark' ? <SunIcon size={19} className="text-amber-400" /> : <MoonIcon size={19} className="text-slate-700 dark:text-slate-200" />}
            </button>

            {/* 3. Wishlist Button (Tablet & desktop only, mobile uses bottom nav) */}
            <Link
              to="/wishlist"
              className="hidden md:flex relative p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 hover:border-rose-300 hover:bg-rose-50/60 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 hover:text-rose-600 transition-all items-center justify-center"
              title="ទំនិញចូលចិត្ត"
            >
              <HeartIcon size={20} filled={wishlist.length > 0} className={wishlist.length > 0 ? 'text-rose-500' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* 4. Cart Button (Compact icon badge on mobile, full text on tablet/desktop) */}
            <div className="relative" ref={cartRef}>
              <button
                type="button"
                onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white transition-all shadow-xs cursor-pointer group"
                title="កន្ត្រកទំនិញ"
              >
                <div className="relative">
                  <ShoppingBagIcon size={18} className="text-white group-hover:scale-105 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-slate-900">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-extrabold tracking-tight hidden sm:inline">
                  {formatPrice(cartTotal)}
                </span>
              </button>

              {/* Cart Dropdown Preview */}
              {cartDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-92 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in-down">
                  <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                    <span className="text-sm font-bold text-slate-900">
                      កន្ត្រកទំនិញ ({cartCount})
                    </span>
                    <button onClick={() => setCartDropdownOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                      <XIcon size={16} />
                    </button>
                  </div>

                  {cartItems.length > 0 ? (
                    <div>
                      <div className="max-h-72 overflow-y-auto p-3.5 space-y-3 divide-y divide-slate-50">
                        {cartItems.map(item => (
                          <div key={item.product.id} className="pt-2.5 first:pt-0 flex items-center gap-3">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded-xl bg-slate-100 border border-slate-100 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0 text-left">
                              <h5 className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                                {item.product.nameKh || item.product.name}
                              </h5>
                              <div className="text-xs sm:text-sm font-bold text-blue-600 mt-0.5">
                                {formatPrice(item.product.price)}
                              </div>
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="flex items-center border border-slate-200 rounded-lg text-xs">
                                  <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                                  >
                                    -
                                  </button>
                                  <span className="px-2 font-bold text-slate-900">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="text-slate-400 hover:text-rose-500 p-1"
                                >
                                  <TrashIcon size={14} />
                                </button>
                              </div>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-900 text-right">
                              {formatPrice(item.product.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600 font-medium">តម្លៃសរុប៖</span>
                          <span className="text-base font-extrabold text-slate-900">{formatPrice(cartTotal)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <Link
                            to="/cart"
                            onClick={() => setCartDropdownOpen(false)}
                            className="py-2.5 text-center text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                          >
                            មើលកន្ត្រក
                          </Link>
                          <Link
                            to="/checkout"
                            onClick={() => setCartDropdownOpen(false)}
                            className="py-2.5 text-center text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20"
                          >
                            ទូទាត់ប្រាក់ →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm text-slate-500 mb-4">មិនទាន់មានទំនិញក្នុងកន្ត្រកនៅឡើយទេ</p>
                      <Link
                        to="/shop"
                        onClick={() => setCartDropdownOpen(false)}
                        className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-sm"
                      >
                        ទៅកាន់ហាងទំនិញ
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 5. User / Admin Pill (HIDDEN on mobile (< md) to prevent overflow; mobile uses BottomNav & Drawer) */}
            <div className="relative hidden md:flex items-center gap-2" ref={userRef}>
              {user && user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs hover:bg-amber-500/20 transition-all shadow-xs"
                >
                  <CrownIcon size={14} className="text-amber-500" />
                  <span>គ្រប់គ្រង Admin</span>
                </Link>
              )}
              {user ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all cursor-pointer ${
                      user.role === 'admin'
                        ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-amber-400/40 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center flex-shrink-0 ${
                        user.role === 'admin'
                          ? 'bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold leading-tight whitespace-nowrap">
                        {user.name}
                      </div>
                      {user.role === 'admin' && (
                        <div className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                          <CrownIcon size={11} className="text-amber-400" />
                          <span>Admin</span>
                        </div>
                      )}
                    </div>
                    <ChevronDownIcon size={12} className="text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-fade-in-down">
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                      </div>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                        >
                          <CrownIcon size={14} />
                          <span>ផ្ទាំងគ្រប់គ្រង Admin</span>
                        </Link>
                      )}
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                      >
                        គណនី & ការកុម្ម៉ង់
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                      >
                        ទំនិញដែលចូលចិត្ត
                      </Link>
                      <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold text-left cursor-pointer"
                      >
                        <LogoutIcon size={14} />
                        <span>ចាកចេញ</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-3.5 py-2 rounded-2xl shadow-xs transition-all whitespace-nowrap cursor-pointer"
                >
                  <UserIcon size={15} />
                  <span>ចូលគណនី</span>
                </Link>
              )}
            </div>

            {/* 6. Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
              aria-label="បើកម៉ឺនុយ"
            >
              {mobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>

        {/* 7. Mobile Search Input with Instant Autocomplete Dropdown */}
        <div className="pb-3 md:hidden relative" ref={mobileSearchRef}>
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="absolute left-3 text-slate-400 pointer-events-none">
              <SearchIcon size={16} />
            </div>
            <input
              type="text"
              value={search}
              onFocus={() => setSearchFocused(true)}
              onChange={e => setSearch(e.target.value)}
              placeholder="ស្វែងរកកុំព្យូទ័រ, ទូរសព្ទ, គ្រឿងបន្លាស់..."
              className="w-full pl-9 pr-20 py-2 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 border border-slate-200/80 dark:border-slate-700 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-14 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XIcon size={14} />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-bold rounded-lg cursor-pointer"
            >
              ស្វែងរក
            </button>
          </form>

          {/* Mobile search autocomplete suggestions dropdown */}
          {searchFocused && search.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-fade-in-down">
              <div className="p-1.5 divide-y divide-slate-50 dark:divide-slate-800">
                {searchResults.length > 0 ? (
                  searchResults.map(item => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      onClick={() => setSearchFocused(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-blue-50/60 dark:hover:bg-slate-800 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.nameKh || item.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {item.brand} • {item.categoryKh}
                        </div>
                      </div>
                      <div className="text-xs font-extrabold text-blue-600 dark:text-blue-400 text-right">
                        {formatPrice(item.price)}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    មិនមានទំនិញដែលត្រូវនឹង &ldquo;{search}&rdquo;
                  </div>
                )}
              </div>
              {searchResults.length > 0 && (
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-center text-xs font-bold text-blue-600 dark:text-blue-400 border-t border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
                >
                  មើលលទ្ធផលទាំងអស់ ({searchResults.length}) →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. DESKTOP NAVIGATION ROW */}
      <nav className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B1120]/80 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2">
              {/* All Categories Button with Gradient */}
              <div className="relative" ref={categoryRef}>
                <button
                  type="button"
                  onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <GridIcon size={17} />
                  <span className="whitespace-nowrap">ប្រភេទទំនិញ</span>
                  <ChevronDownIcon size={13} className={`transition-transform duration-200 ${categoryMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {categoryMenuOpen && (
                  <div className="absolute top-full left-0 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2.5 z-50 mt-1 animate-fade-in-down">
                    {catalogCategories.map(cat => (
                      <Link
                        key={cat.id}
                        to={`/shop?category=${cat.id}`}
                        onClick={() => setCategoryMenuOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/60 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            {getCategoryIcon(cat.id)}
                          </div>
                          <span className="text-[14.5px] font-semibold text-slate-800 dark:text-slate-100">{cat.nameKh}</span>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{cat.count}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Links with Smooth Pill Styling */}
              <div className="flex items-center gap-1">
                {navLinks.map(link => {
                  const isActive =
                    location.pathname + location.search === link.to ||
                    (link.to !== '/' && location.pathname.startsWith(link.to) && link.to !== '/shop');

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-[14.5px] transition-all whitespace-nowrap rounded-xl ${
                        isActive
                          ? 'font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 shadow-xs ring-1 ring-slate-200/60 dark:ring-slate-700'
                          : link.highlight
                          ? 'font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                          : 'font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/80 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      {link.icon && <span>{link.icon}</span>}
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 4. MOBILE SLIDE-OVER DRAWER (Native App Quality rendered via Portal) */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="lg:hidden fixed inset-0 z-[9999] flex">
          {/* Backdrop with smooth blur */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Container: Full width on small mobile phone, sleek max-w-sm on tablet */}
          <div className="relative w-full sm:w-[400px] sm:max-w-md bg-white dark:bg-[#0B1120] h-[100dvh] shadow-2xl flex flex-col z-10 overflow-hidden animate-fade-in-right">
            {/* Drawer Header (App Bar) */}
            <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#0B1120] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <SokeinLogoIcon className="w-10 h-10" showStatus={false} />
                <div>
                  <div className="font-black text-base text-slate-900 dark:text-white leading-tight">SOKEIN TECH</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">ហាងបច្ចេកវិទ្យា & អេឡិចត្រូនិក</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
                  title={theme === 'dark' ? 'ប្ដូរទៅ Light Mode' : 'ប្ដូរទៅ Dark Mode'}
                  aria-label="ប្ដូរពន្លឺ / ងងឹត (Theme)"
                >
                  {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                  aria-label="បិទម៉ឺនុយ"
                >
                  <XIcon size={18} />
                </button>
              </div>
            </div>

            {/* Top Navigation Tabs inside Drawer */}
            <div className="px-3.5 pt-2.5 pb-2 bg-slate-50/90 dark:bg-slate-900/90 border-b border-slate-100 dark:border-slate-800 flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuTab('categories')}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center text-center cursor-pointer ${
                  mobileMenuTab === 'categories'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                }`}
              >
                <span>ប្រភេទទំនិញ & Model</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuTab('pages')}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center text-center cursor-pointer ${
                  mobileMenuTab === 'pages'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                }`}
              >
                <span>ទំព័រទូទៅ & គណនី</span>
              </button>
            </div>

            {/* Scrollable Drawer Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-4 space-y-4">
              {mobileMenuTab === 'categories' ? (
                /* TAB 1: ALL CATEGORIES, BRANDS & SPECIFIC MODELS */
                <div className="space-y-4">
                  {/* Popular Brand Chips Bar */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>ម៉ាកពេញនិយម (Brands)</span>
                      <span className="text-[10px] text-blue-600 font-semibold">រំកិលមើលបន្ថែម →</span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                      {[
                        'Apple',
                        'ASUS',
                        'Dell',
                        'Lenovo',
                        'Samsung',
                        'MSI',
                        'Acer',
                        'Sony',
                        'DJI',
                        'GoPro',
                        'Logitech',
                        'HP',
                      ].map(brandName => (
                        <Link
                          key={brandName}
                          to={`/shop?brand=${brandName}`}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                          }}
                          className="px-3.5 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 rounded-xl text-xs font-bold text-slate-800 whitespace-nowrap shadow-2xs transition-all flex-shrink-0"
                        >
                          {brandName}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Unified Clean Category Navigation List */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>រុករកតាមប្រភេទ (Categories)</span>
                      <Link
                        to="/shop"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                        }}
                        className="text-xs text-blue-600 font-bold hover:underline"
                      >
                        ទំនិញទាំងអស់ →
                      </Link>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
                      {[
                        {
                          id: 'laptops',
                          nameKh: 'កុំព្យូទ័រយួរដៃ (Laptops)',
                          icon: '💻',
                          iconBg: 'bg-blue-50 text-blue-600 border-blue-100/60',
                          badge: 'ពេញនិយម',
                          badgeColor: 'bg-blue-50 text-blue-600',
                          link: '/shop?category=laptops',
                        },
                        {
                          id: 'desktops',
                          nameKh: 'កុំព្យូទ័រលើតុ & All-in-One',
                          icon: '🖥️',
                          iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-100/60',
                          badge: 'កម្លាំងខ្លាំង',
                          badgeColor: 'bg-cyan-50 text-cyan-700',
                          link: '/shop?category=desktops',
                        },
                        {
                          id: 'phones',
                          nameKh: 'ទូរសព្ទដៃ (Smartphones)',
                          icon: '📱',
                          iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100/60',
                          badge: 'Flagship',
                          badgeColor: 'bg-emerald-50 text-emerald-700',
                          link: '/shop?category=phones',
                        },
                        {
                          id: 'tablets',
                          nameKh: 'iPad & ថេប្លេត (Tablets)',
                          icon: '📟',
                          iconBg: 'bg-purple-50 text-purple-600 border-purple-100/60',
                          badge: 'OLED & M4',
                          badgeColor: 'bg-purple-50 text-purple-700',
                          link: '/shop?category=tablets',
                        },
                        {
                          id: 'cameras',
                          nameKh: 'កាមេរ៉ា & DJI Gear',
                          icon: '🎥',
                          iconBg: 'bg-rose-50 text-rose-600 border-rose-100/60',
                          badge: 'DJI & 4K',
                          badgeColor: 'bg-rose-50 text-rose-700',
                          link: '/shop?category=cameras',
                        },
                        {
                          id: 'monitors',
                          nameKh: 'ម៉ូនីទ័រ (Monitors)',
                          icon: '🖥️',
                          iconBg: 'bg-amber-50 text-amber-600 border-amber-100/60',
                          badge: '4K & 144Hz',
                          badgeColor: 'bg-amber-50 text-amber-700',
                          link: '/shop?category=monitors',
                        },
                        {
                          id: 'gaming',
                          nameKh: 'ឧបករណ៍ Gaming & កាស',
                          icon: '🎮',
                          iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100/60',
                          badge: 'Pro Gear',
                          badgeColor: 'bg-indigo-50 text-indigo-700',
                          link: '/shop?category=gaming',
                        },
                        {
                          id: 'accessories',
                          nameKh: 'គ្រឿងបន្លាស់ & Hardware',
                          icon: '⚡',
                          iconBg: 'bg-slate-100 text-slate-700 border-slate-200/60',
                          badge: '218+ មុខ',
                          badgeColor: 'bg-slate-100 text-slate-700',
                          link: '/shop?category=accessories',
                        },
                      ].map(cat => (
                        <Link
                          key={cat.id}
                          to={cat.link}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                          }}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border shadow-2xs flex-shrink-0 group-hover:scale-105 transition-transform ${cat.iconBg}`}>
                              {cat.icon}
                            </div>
                            <div className="font-bold text-[14px] sm:text-[15px] text-slate-900 group-hover:text-blue-600 transition-colors leading-tight truncate">
                              {cat.nameKh}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${cat.badgeColor}`}>
                              {cat.badge}
                            </span>
                            <span className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all text-sm font-bold">
                              →
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Flash Sale Banner at Bottom of Categories */}
                  <Link
                    to="/shop?sale=true"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    }}
                    className="block p-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-md shadow-rose-500/20 text-center"
                  >
                    <div className="text-xs font-black mb-0.5">⚡ ប្រូម៉ូសិនពិសេសប្រចាំខែ</div>
                    <div className="text-[11px] text-white/90">បញ្ចុះតម្លៃរហូតដល់ 30% លើកុំព្យូទ័រ & ទូរសព្ទ</div>
                  </Link>
                </div>
              ) : (
                /* TAB 2: GENERAL PAGES & ACCOUNT */
                <div className="space-y-4">
                  {/* User Account Card */}
                  <div className="p-3.5 bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-white rounded-2xl border border-blue-100/80 shadow-xs">
                    {user ? (
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-lg shadow-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-slate-900 truncate">{user.name}</div>
                            <div className="text-xs text-slate-500 truncate">{user.email}</div>
                            {user.role === 'admin' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full mt-1">
                                <CrownIcon size={11} /> Admin
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <Link
                            to="/dashboard"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                            }}
                            className="text-center py-2 px-2 bg-white rounded-xl text-xs font-bold text-slate-800 border border-slate-200/80 hover:bg-slate-50 shadow-2xs"
                          >
                            📦 ការកុម្ម៉ង់
                          </Link>
                          {user.role === 'admin' ? (
                            <Link
                              to="/admin"
                              onClick={() => {
                                setMobileMenuOpen(false);
                                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                              }}
                              className="text-center py-2 px-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 shadow-2xs"
                            >
                              👑 ផ្ទាំង Admin
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                logout();
                                setMobileMenuOpen(false);
                              }}
                              className="text-center py-2 px-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 border border-rose-100 cursor-pointer"
                            >
                              🚪 ចាកចេញ
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-1.5">
                        <div className="font-bold text-sm text-slate-900 mb-0.5">សូមស្វាគមន៍មកកាន់ SOKEIN TECH</div>
                        <p className="text-xs text-slate-500 mb-3">ចូលគណនីដើម្បីទទួលបានការបញ្ចុះតម្លៃ និងតាមដានការកុម្ម៉ង់</p>
                        <Link
                          to="/login"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                          }}
                          className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700"
                        >
                          <UserIcon size={15} />
                          <span>ចូលគណនី / ចុះឈ្មោះ</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Currency Switcher */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">រូបិយប័ណ្ណបង្ហាញ៖</span>
                    <div className="flex items-center bg-white dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setCurrencyChoice('USD')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          currency === 'USD' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        $ USD
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrencyChoice('KHR')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          currency === 'KHR' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        ៛ KHR
                      </button>
                    </div>
                  </div>

                  {/* Theme Switcher in Mobile Drawer */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 font-semibold">
                      {theme === 'dark' ? <MoonIcon size={16} className="text-amber-400" /> : <SunIcon size={16} className="text-amber-500" />}
                      <span>ទម្រង់ពន្លឺ (Theme)៖</span>
                    </div>
                    <div className="flex items-center bg-white dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setTheme('light')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          theme === 'light' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <SunIcon size={13} />
                        <span>Light</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme('dark')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          theme === 'dark' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <MoonIcon size={13} />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>

                  {/* Main Site Links */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                      ទំព័រចម្បង
                    </div>
                    {navLinks.map(link => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                        }}
                        className={`flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                          location.pathname + location.search === link.to
                            ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                            : link.highlight
                            ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 bg-rose-50/40 dark:bg-rose-950/20'
                            : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {link.icon && <span className="text-base">{link.icon}</span>}
                          <span>{link.label}</span>
                        </div>
                        {link.highlight && (
                          <span className="text-[10px] font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 px-2 py-0.5 rounded-full">
                            HOT
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Store Contact Footer */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-0.5 flex-shrink-0">
              <a
                href="tel:+855087812643"
                className="flex items-center gap-2 font-black text-blue-600 dark:text-blue-400 text-sm py-0.5"
              >
                <PhoneIcon size={15} />
                <span>087 812 643</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
              </a>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">📍 រតនៈ ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1 mt-0.5">
                <span>🚚</span>
                <span>ដឹកជញ្ជូនឥតគិតថ្លៃទូទាំងខេត្ត $50+</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}

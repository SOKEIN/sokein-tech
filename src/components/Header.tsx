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
  GamepadIcon,
} from './Icons';

export default function Header() {
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity, wishlist } = useCart();
  const { user, logout } = useAuth();
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
  const [expandedCategory, setExpandedCategory] = useState<string>('laptops');

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
    { to: '/shop?category=phones', label: 'ទូរសព្ទ & ថេប្លេត', icon: '📱' },
    { to: '/shop?category=cameras', label: 'កាមេរ៉ា', icon: '📷' },
    { to: '/shop?category=accessories', label: 'គ្រឿងបន្លាស់', icon: '🎧' },
    { to: '/shop?sale=true', label: 'ប្រូម៉ូសិនពិសេស', icon: '🔥', highlight: true },
    { to: '/tracking', label: 'តាមដានការកុម្ម៉ង់', icon: '🚚' },
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
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80 shadow-xs select-none w-full">
      {/* 1. TOP SIGNATURE ACCENT LINE */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

      {/* 2. MAIN HEADER ROW */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6">
        <div className="flex items-center justify-between gap-2.5 sm:gap-4 md:gap-6 py-2.5 sm:py-3.5">
          {/* Logo with Modern Tech Badge & Glow */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group">
            <div className="relative">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-base sm:text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
                S
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
                <span className="font-black text-lg sm:text-2xl text-slate-900 tracking-tight">SOKEIN</span>
                <span className="font-black text-lg sm:text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                  TECH
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[12px] text-slate-500 font-medium tracking-normal mt-1 leading-tight">
                <span>📍 រតនាគ បាត់ដំបង</span>
                <span className="text-slate-300">•</span>
                <span className="text-blue-600 font-semibold">ហាងបច្ចេកវិទ្យា</span>
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
                className={`w-full pl-11 pr-24 py-2.5 bg-slate-100/80 hover:bg-slate-100 text-[15px] text-slate-800 placeholder-slate-400 rounded-full border transition-all duration-200 focus:outline-none focus:bg-white ${
                  searchFocused
                    ? 'border-blue-600 ring-4 ring-blue-500/10 shadow-xs'
                    : 'border-slate-200/80'
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
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in-down">
                <div className="p-2 divide-y divide-slate-50">
                  {searchResults.length > 0 ? (
                    searchResults.map(item => (
                      <Link
                        key={item.id}
                        to={`/product/${item.id}`}
                        onClick={() => setSearchFocused(false)}
                        className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-blue-50/60 transition-colors group"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-xl bg-slate-100 border border-slate-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {item.nameKh || item.name}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {item.brand} • {item.categoryKh}
                          </div>
                        </div>
                        <div className="text-sm font-extrabold text-blue-600 text-right">
                          {formatPrice(item.price)}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="py-8 text-center text-sm text-slate-500">
                      មិនមានទំនិញដែលត្រូវនឹង &ldquo;{search}&rdquo;
                    </div>
                  )}
                </div>
                {searchResults.length > 0 && (
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full py-2.5 bg-slate-50 hover:bg-blue-50 text-center text-sm font-bold text-blue-600 border-t border-slate-100 transition-colors cursor-pointer"
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
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-200 transition-all group"
              title="សេវាកម្មអតិថិជន"
            >
              <div className="w-7 h-7 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <PhoneIcon size={14} />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <span>ជំនួយ</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                  087 812 643
                </div>
              </div>
            </a>

            {/* 2. Segmented Currency Switcher (Optimized for small mobile) */}
            <div className="flex items-center bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/80 text-[11px] sm:text-xs font-bold">
              <button
                type="button"
                onClick={() => setCurrencyChoice('USD')}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg transition-all cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
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
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="រៀលខ្មែរ"
              >
                ៛ KHR
              </button>
            </div>

            {/* 3. Wishlist Button (Tablet & desktop only, mobile uses bottom nav) */}
            <Link
              to="/wishlist"
              className="hidden md:flex relative p-2.5 rounded-2xl border border-slate-200/80 hover:border-rose-300 hover:bg-rose-50/60 text-slate-700 hover:text-rose-600 transition-all items-center justify-center"
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
            <div className="relative hidden md:flex" ref={userRef}>
              {user ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all cursor-pointer ${
                      user.role === 'admin'
                        ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-amber-400/40 shadow-xs'
                        : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200'
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
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-fade-in-down">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <div className="text-sm font-bold text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-500 truncate">{user.email}</div>
                      </div>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-50"
                        >
                          <CrownIcon size={14} />
                          <span>ផ្ទាំងគ្រប់គ្រង Admin</span>
                        </Link>
                      )}
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        គណនី & ការកុម្ម៉ង់
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        ទំនិញដែលចូលចិត្ត
                      </Link>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-semibold text-left cursor-pointer"
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
              className="lg:hidden p-2 rounded-xl text-slate-700 bg-slate-100/90 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
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
              className="w-full pl-9 pr-20 py-2 bg-slate-100/90 hover:bg-slate-100 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 border border-slate-200/80 transition-all"
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
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-fade-in-down">
              <div className="p-1.5 divide-y divide-slate-50">
                {searchResults.length > 0 ? (
                  searchResults.map(item => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      onClick={() => setSearchFocused(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-blue-50/60 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg bg-slate-100 border border-slate-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {item.nameKh || item.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {item.brand} • {item.categoryKh}
                        </div>
                      </div>
                      <div className="text-xs font-extrabold text-blue-600 text-right">
                        {formatPrice(item.price)}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-4 text-center text-xs text-slate-500">
                    មិនមានទំនិញដែលត្រូវនឹង &ldquo;{search}&rdquo;
                  </div>
                )}
              </div>
              {searchResults.length > 0 && (
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-center text-xs font-bold text-blue-600 border-t border-slate-100 transition-colors cursor-pointer"
                >
                  មើលលទ្ធផលទាំងអស់ ({searchResults.length}) →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. DESKTOP NAVIGATION ROW */}
      <nav className="border-t border-slate-100 bg-slate-50/70 hidden lg:block">
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
                  <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2.5 z-50 mt-1 animate-fade-in-down">
                    {catalogCategories.map(cat => (
                      <Link
                        key={cat.id}
                        to={`/shop?category=${cat.id}`}
                        onClick={() => setCategoryMenuOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                            {getCategoryIcon(cat.id)}
                          </div>
                          <span className="text-[14.5px] font-semibold text-slate-800">{cat.nameKh}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">{cat.count}</span>
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
                          ? 'font-bold text-blue-600 bg-white shadow-xs ring-1 ring-slate-200/60'
                          : link.highlight
                          ? 'font-bold text-rose-600 hover:bg-rose-50'
                          : 'font-semibold text-slate-700 hover:text-blue-600 hover:bg-white/80'
                      }`}
                    >
                      {link.icon && <span>{link.icon}</span>}
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Subtle Trust Highlight on Right */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 rounded-full px-3.5 py-1 whitespace-nowrap">
              <span>🚚 ដឹកជញ្ជូនឥតគិតថ្លៃទូទាំងប្រទេស $50+</span>
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
          <div className="relative w-full sm:w-[400px] sm:max-w-md bg-white h-[100dvh] shadow-2xl flex flex-col z-10 overflow-hidden animate-fade-in-right">
            {/* Drawer Header (App Bar) */}
            <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-base shadow-sm shadow-blue-500/25">
                  S
                </div>
                <div>
                  <div className="font-black text-base text-slate-900 leading-tight">SOKEIN TECH</div>
                  <div className="text-[11px] text-slate-500">ហាងបច្ចេកវិទ្យា & អេឡិចត្រូនិក</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                aria-label="បិទម៉ឺនុយ"
              >
                <XIcon size={18} />
              </button>
            </div>

            {/* Top Navigation Tabs inside Drawer */}
            <div className="px-3.5 pt-2.5 pb-2 bg-slate-50/90 border-b border-slate-100 flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuTab('categories')}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileMenuTab === 'categories'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span>💻</span>
                <span>ប្រភេទទំនិញ & Model</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuTab('pages')}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileMenuTab === 'pages'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span>🧭</span>
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
                        { name: 'Apple', icon: '🍏' },
                        { name: 'ASUS', icon: '⚡' },
                        { name: 'Dell', icon: '💼' },
                        { name: 'Lenovo', icon: '🔴' },
                        { name: 'Samsung', icon: '🤖' },
                        { name: 'MSI', icon: '🐉' },
                        { name: 'Acer', icon: '💻' },
                        { name: 'Sony', icon: '📷' },
                        { name: 'DJI', icon: '🎥' },
                        { name: 'GoPro', icon: '🏄' },
                        { name: 'Logitech', icon: '🖱️' },
                        { name: 'HP', icon: '🖥️' },
                      ].map(brand => (
                        <Link
                          key={brand.name}
                          to={`/shop?brand=${brand.name}`}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 rounded-xl text-xs font-bold text-slate-800 whitespace-nowrap shadow-2xs transition-all flex-shrink-0"
                        >
                          <span>{brand.icon}</span>
                          <span>{brand.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Comprehensive Categories Accordion with Models */}
                  <div className="space-y-2.5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      ជ្រើសរើសតាមប្រភេទ & Model
                    </div>

                    {[
                      {
                        id: 'laptops',
                        nameKh: 'កុំព្យូទ័រយួរដៃ (Laptops)',
                        count: 125,
                        icon: '💻',
                        badge: 'ពេញនិយម',
                        badgeColor: 'bg-blue-50 text-blue-600',
                        models: [
                          { name: 'Apple', brand: 'Apple', spec: 'MacBook Pro • MacBook Air', link: '/shop?category=laptops&brand=Apple', badge: 'M3 Series', badgeColor: 'bg-indigo-50 text-indigo-600', icon: '🍎' },
                          { name: 'ASUS', brand: 'ASUS', spec: 'ROG • ZenBook • TUF', link: '/shop?category=laptops&brand=ASUS', badge: 'Gaming & OLED', badgeColor: 'bg-red-50 text-red-600', icon: '⚡' },
                          { name: 'Dell', brand: 'Dell', spec: 'XPS 15 • Inspiron Plus', link: '/shop?category=laptops&brand=Dell', badge: 'Premium', badgeColor: 'bg-blue-50 text-blue-600', icon: '💼' },
                          { name: 'Lenovo', brand: 'Lenovo', spec: 'Legion Pro • ThinkPad X1', link: '/shop?category=laptops&brand=Lenovo', badge: 'Pro Gaming', badgeColor: 'bg-purple-50 text-purple-600', icon: '🎮' },
                          { name: 'Acer', brand: 'Acer', spec: 'Nitro 16 • Predator Helios', link: '/shop?category=laptops&brand=Acer', badge: 'Fast 165Hz', badgeColor: 'bg-emerald-50 text-emerald-600', icon: '🚀' },
                          { name: 'MSI', brand: 'MSI', spec: 'Raider GE78 • Katana 15', link: '/shop?category=laptops&brand=MSI', badge: 'RTX 40-Series', badgeColor: 'bg-rose-50 text-rose-700', icon: '🐉' },
                          { name: 'HP', brand: 'HP', spec: 'Omen 16 • Victus Gaming', link: '/shop?category=laptops&brand=HP', badge: 'QHD Gaming', badgeColor: 'bg-cyan-50 text-cyan-700', icon: '⚡' },
                        ],
                        link: '/shop?category=laptops',
                      },
                      {
                        id: 'desktops',
                        nameKh: 'កុំព្យូទ័រលើតុ & All-in-One',
                        count: 48,
                        icon: '🖥️',
                        badge: 'កម្លាំងខ្លាំង',
                        badgeColor: 'bg-cyan-50 text-cyan-700',
                        models: [
                          { name: 'iMac 24" Retina', brand: 'Apple', spec: 'M3 4.5K Retina', query: 'iMac', badge: '4.5K', badgeColor: 'bg-indigo-50 text-indigo-600', icon: '🍎' },
                          { name: 'Mac Studio & Mini', brand: 'Apple', spec: 'M2/M3 Pro Extreme', query: 'Mac', badge: 'STUDIO', badgeColor: 'bg-slate-100 text-slate-700', icon: '🍎' },
                          { name: 'Gaming PC Custom', brand: 'Custom', spec: 'RTX 40-Series • i9', query: 'Gaming PC', badge: 'CUSTOM', badgeColor: 'bg-red-50 text-red-600', icon: '⚡' },
                          { name: 'Workstation 3D', brand: 'Render', spec: '64GB RAM • Liquid', query: 'Workstation', badge: '3D/CAD', badgeColor: 'bg-purple-50 text-purple-600', icon: '⚙️' },
                        ],
                        link: '/shop?category=desktops',
                      },
                      {
                        id: 'phones',
                        nameKh: 'ទូរសព្ទដៃ & ថេប្លេត',
                        count: 125,
                        icon: '📱',
                        badge: 'Flagship',
                        badgeColor: 'bg-emerald-50 text-emerald-700',
                        models: [
                          { name: 'iPhone 16 Pro Max', brand: 'Apple', spec: 'A18 Pro • 48MP Camera', query: 'iPhone 16', badge: 'NEW', badgeColor: 'bg-rose-50 text-rose-600', icon: '📱' },
                          { name: 'Galaxy S24 Ultra', brand: 'Samsung', spec: 'AI 200MP • S-Pen', query: 'Galaxy S24', badge: 'AI', badgeColor: 'bg-blue-50 text-blue-600', icon: '✨' },
                          { name: 'iPad Pro M4', brand: 'Apple', spec: 'OLED Ultra Retina XDR', query: 'iPad Pro', badge: 'OLED', badgeColor: 'bg-purple-50 text-purple-600', icon: '🖊️' },
                          { name: 'Galaxy Z Fold6', brand: 'Samsung', spec: 'Dual Screen Foldable', query: 'Galaxy Z', badge: 'FOLD', badgeColor: 'bg-cyan-50 text-cyan-600', icon: '📐' },
                        ],
                        link: '/shop?category=phones',
                      },
                      {
                        id: 'cameras',
                        nameKh: 'កាមេរ៉ា & ឧបករណ៍ Creators',
                        count: 64,
                        icon: '📷',
                        badge: '4K/8K Cinema',
                        badgeColor: 'bg-rose-50 text-rose-700',
                        models: [
                          { name: 'Sony Alpha A7 IV', brand: 'Sony', spec: '33MP Full-Frame 4K', query: 'Sony Alpha', badge: 'PRO', badgeColor: 'bg-rose-50 text-rose-600', icon: '📷' },
                          { name: 'DJI Osmo Pocket 3', brand: 'DJI', spec: '1" CMOS • 4K 120fps', query: 'DJI Osmo', badge: 'VLOG', badgeColor: 'bg-blue-50 text-blue-600', icon: '🎥' },
                          { name: 'Canon EOS R50', brand: 'Canon', spec: 'Compact 4K Mirrorless', query: 'Canon', badge: '4K', badgeColor: 'bg-amber-50 text-amber-700', icon: '📸' },
                          { name: 'GoPro HERO 13', brand: 'GoPro', spec: '5.3K HDR Waterproof', query: 'GoPro', badge: 'ACTION', badgeColor: 'bg-emerald-50 text-emerald-600', icon: '🌊' },
                        ],
                        link: '/shop?category=cameras',
                      },
                      {
                        id: 'monitors',
                        nameKh: 'ម៉ូនីទ័រ (Monitors)',
                        count: 42,
                        icon: '🖥️',
                        badge: '4K & 144Hz',
                        badgeColor: 'bg-amber-50 text-amber-700',
                        models: [
                          { name: 'Dell UltraSharp 4K', brand: 'Dell', spec: 'IPS 100% sRGB Color', query: 'Dell UltraSharp', badge: 'DESIGN', badgeColor: 'bg-blue-50 text-blue-600', icon: '🎨' },
                          { name: 'LG UltraGear Gaming', brand: 'LG', spec: '144Hz / 240Hz 1ms', query: 'LG UltraGear', badge: 'FAST', badgeColor: 'bg-purple-50 text-purple-600', icon: '⚡' },
                          { name: 'Samsung Odyssey OLED', brand: 'Samsung', spec: 'Curved Gaming 0.03ms', query: 'Samsung Monitor', badge: 'OLED', badgeColor: 'bg-cyan-50 text-cyan-600', icon: '🎮' },
                          { name: 'Office Monitor 24/27', brand: 'General', spec: 'Full HD Eye-Care', query: 'Monitor 24', badge: 'BIZ', badgeColor: 'bg-slate-100 text-slate-700', icon: '🖥️' },
                        ],
                        link: '/shop?category=monitors',
                      },
                      {
                        id: 'gaming',
                        nameKh: 'ឧបករណ៍ Gaming & កាស',
                        count: 73,
                        icon: '🎮',
                        badge: 'Pro Gear',
                        badgeColor: 'bg-purple-50 text-purple-700',
                        models: [
                          { name: 'Keychron Mechanical', brand: 'Keychron', spec: 'Wireless Hot-swap RGB', query: 'Mechanical Keyboard', badge: 'RGB', badgeColor: 'bg-purple-50 text-purple-600', icon: '⌨️' },
                          { name: 'Logitech G Pro Mouse', brand: 'Logitech', spec: 'HERO 25K Sensor 60g', query: 'Gaming Mouse', badge: 'PRO', badgeColor: 'bg-blue-50 text-blue-600', icon: '🖱️' },
                          { name: 'Gaming Headset 7.1', brand: 'Audio', spec: 'Surround 7.1 Bass', query: 'Gaming Headset', badge: 'AUDIO', badgeColor: 'bg-rose-50 text-rose-600', icon: '🎧' },
                          { name: 'Gaming Chair RGB', brand: 'Comfort', spec: 'Ergonomic 4D Armrest', query: 'Gaming Chair', badge: 'COMFORT', badgeColor: 'bg-emerald-50 text-emerald-600', icon: '💺' },
                        ],
                        link: '/shop?category=gaming',
                      },
                      {
                        id: 'accessories',
                        nameKh: 'គ្រឿងបន្លាស់កុំព្យូទ័រ & Hardware',
                        count: 218,
                        icon: '⚡',
                        badge: '218 មុខ',
                        badgeColor: 'bg-slate-100 text-slate-700',
                        models: [
                          { name: 'SSD NVMe M.2', brand: 'Storage', spec: 'Gen4 5000-7450MB/s', query: 'SSD', badge: 'FAST', badgeColor: 'bg-cyan-50 text-cyan-600', icon: '💾' },
                          { name: 'RAM DDR4 / DDR5', brand: 'Memory', spec: '16GB / 32GB RGB', query: 'RAM', badge: 'SPEED', badgeColor: 'bg-purple-50 text-purple-600', icon: '⚡' },
                          { name: 'NVIDIA RTX 40-Series', brand: 'GPU', spec: 'RTX 4060, 4070, 4080', query: 'RTX', badge: 'GRAPHIC', badgeColor: 'bg-emerald-50 text-emerald-600', icon: '🎮' },
                          { name: 'Type-C Hub 7-in-1', brand: 'Adapter', spec: 'HDMI 4K + 100W PD', query: 'Hub', badge: 'PORT', badgeColor: 'bg-blue-50 text-blue-600', icon: '🔌' },
                        ],
                        link: '/shop?category=accessories',
                      },
                    ].map(cat => {
                      const isExpanded = expandedCategory === cat.id;

                      return (
                        <div
                          key={cat.id}
                          className={`rounded-2xl border transition-all overflow-hidden ${
                            isExpanded
                              ? 'bg-white border-blue-200 shadow-md ring-2 ring-blue-500/10'
                              : 'bg-white border-slate-200/80 shadow-2xs hover:border-slate-300'
                          }`}
                        >
                          {/* Category Header Bar (Accordion Trigger) */}
                          <button
                            type="button"
                            onClick={() => setExpandedCategory(isExpanded ? '' : cat.id)}
                            className={`w-full flex items-center justify-between p-3 sm:p-3.5 text-left transition-colors cursor-pointer ${
                              isExpanded ? 'bg-blue-50/70 border-b border-blue-100' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl">{cat.icon}</span>
                              <div>
                                <div className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                                  {cat.nameKh}
                                </div>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 inline-block ${cat.badgeColor}`}>
                                  {cat.badge} • {cat.count} ទំនិញ
                                </span>
                              </div>
                            </div>
                            <ChevronDownIcon
                              size={16}
                              className={`text-slate-400 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180 text-blue-600' : ''
                              }`}
                            />
                          </button>

                          {/* Expanded Models Section: Modern 2-Column Cards */}
                          {isExpanded && (
                            <div className="p-2.5 sm:p-3 bg-gradient-to-b from-slate-50/80 to-white space-y-2.5">
                              <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-0.5">
                                <span>✨ ម៉ូដែលពេញនិយមក្នុងស្តុក</span>
                                <span className="text-blue-600 font-bold">{cat.models.length} ម៉ូដែល</span>
                              </div>

                              {/* 2-Column Grid Card Layout */}
                              <div className="grid grid-cols-2 gap-2">
                                {cat.models.map(m => (
                                  <Link
                                    key={m.name}
                                    to={(m as any).link || `/shop?category=${cat.id}&q=${encodeURIComponent((m as any).query || m.name)}`}
                                    onClick={() => {
                                      setMobileMenuOpen(false);
                                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                                    }}
                                    className="bg-white hover:bg-blue-50/50 active:scale-97 border border-slate-200/90 hover:border-blue-500 rounded-xl p-2.5 transition-all flex flex-col justify-between shadow-2xs group cursor-pointer"
                                  >
                                    <div>
                                      {/* Top Row: Brand Icon & Spec Badge */}
                                      <div className="flex items-center justify-between gap-1 mb-1">
                                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                          <span>{m.icon || '💻'}</span>
                                          <span className="truncate">{m.brand}</span>
                                        </span>
                                        {m.badge && (
                                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${m.badgeColor || 'bg-blue-50 text-blue-600'} flex-shrink-0`}>
                                            {m.badge}
                                          </span>
                                        )}
                                      </div>

                                      {/* Brand / Model Big Name */}
                                      <div className="text-sm font-black text-slate-900 group-hover:text-blue-600 leading-snug line-clamp-1">
                                        {m.name}
                                      </div>

                                      {/* Spec Subtitle */}
                                      <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                                        {m.spec}
                                      </div>
                                    </div>

                                    {/* Action Footnote */}
                                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
                                      <span>មើលទំនិញ</span>
                                      <span>→</span>
                                    </div>
                                  </Link>
                                ))}
                              </div>

                              {/* Primary View All in Category Button */}
                              <Link
                                to={cat.link}
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                                }}
                                className="flex items-center justify-center gap-1.5 w-full py-2.5 mt-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white rounded-xl text-xs font-bold text-center shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                              >
                                <span>{cat.icon} មើល{cat.nameKh} ទាំងអស់ ({cat.count})</span>
                                <span>→</span>
                              </Link>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-semibold">រូបិយប័ណ្ណបង្ហាញ៖</span>
                    <div className="flex items-center bg-white p-0.5 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setCurrencyChoice('USD')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          currency === 'USD' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        $ USD
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrencyChoice('KHR')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          currency === 'KHR' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        ៛ KHR
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
                            ? 'bg-blue-50 text-blue-600 font-bold'
                            : link.highlight
                            ? 'text-rose-600 hover:bg-rose-50 bg-rose-50/40'
                            : 'text-slate-800 hover:bg-slate-100 hover:text-blue-600'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {link.icon && <span className="text-base">{link.icon}</span>}
                          <span>{link.label}</span>
                        </div>
                        {link.highlight && (
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">
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
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 space-y-0.5 flex-shrink-0">
              <a
                href="tel:+855087812643"
                className="flex items-center gap-2 font-black text-blue-600 text-sm py-0.5"
              >
                <PhoneIcon size={15} />
                <span>087 812 643</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
              </a>
              <div className="text-slate-500 text-[11px]">📍 រតនាគ ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង</div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}

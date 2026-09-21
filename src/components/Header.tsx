import React, { useState, useEffect, useRef } from 'react';
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

  // Currency
  const [currency, setCurrency] = useState<'USD' | 'KHR'>(() => {
    return (localStorage.getItem('esokein_currency') as 'USD' | 'KHR') || 'USD';
  });

  // Refs for click outside
  const searchRef = useRef<HTMLDivElement>(null);
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
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setCartDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
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
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/80 shadow-xs select-none">
      {/* 1. TOP SIGNATURE ACCENT LINE */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

      {/* 2. MAIN HEADER ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 md:gap-6 py-3.5 sm:py-4">
          {/* Logo with Modern Tech Badge & Glow */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3.5 flex-shrink-0 group">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md shadow-blue-500/20 ring-1 ring-white/20 group-hover:scale-105 group-hover:shadow-blue-500/35 transition-all duration-300">
                S
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight">SOKEIN</span>
                <span className="font-black text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                  TECH
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[12.5px] text-slate-500 font-medium tracking-normal mt-1 leading-tight">
                <span>📍 រតនាគ បាត់ដំបង</span>
                <span className="text-slate-300">•</span>
                <span className="text-blue-600 font-semibold">ហាងបច្ចេកវិទ្យា</span>
              </div>
            </div>
          </Link>

          {/* Interactive Search Capsule with Embedded Button */}
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
                    className="w-full py-2.5 bg-slate-50 hover:bg-blue-50 text-center text-sm font-bold text-blue-600 border-t border-slate-100 transition-colors"
                  >
                    មើលលទ្ធផលទាំងអស់សម្រាប់ &ldquo;{search}&rdquo; →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Action Center: Hotline, Currency Switcher, Wishlist, Cart, Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* 1. Hotline Pill */}
            <a
              href="tel:+855087812643"
              className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-200 transition-all group"
              title="សេវាកម្មអតិថិជន"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <PhoneIcon size={15} />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <span>ជំនួយអតិថិជន</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  087 812 643
                </div>
              </div>
            </a>

            {/* 2. Segmented Currency Switcher */}
            <div className="flex items-center bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/80 text-xs font-bold">
              <button
                onClick={() => setCurrencyChoice('USD')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="ដុល្លារអាមេរិក"
              >
                $ USD
              </button>
              <button
                onClick={() => setCurrencyChoice('KHR')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currency === 'KHR'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="រៀលខ្មែរ"
              >
                ៛ KHR
              </button>
            </div>

            {/* 3. Wishlist Button (Visible on tablet & desktop, mobile uses bottom nav) */}
            <Link
              to="/wishlist"
              className="hidden md:flex relative p-2.5 rounded-2xl border border-slate-200/80 hover:border-rose-300 hover:bg-rose-50/60 text-slate-700 hover:text-rose-600 transition-all duration-200 items-center justify-center"
              title="ទំនិញចូលចិត្ត"
            >
              <HeartIcon size={21} filled={wishlist.length > 0} className={wishlist.length > 0 ? 'text-rose-500' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* 4. High-Contrast Tactile Cart Button */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-2 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white transition-all duration-300 shadow-sm shadow-slate-900/10 hover:shadow-blue-600/25 cursor-pointer group"
              >
                <div className="relative">
                  <ShoppingBagIcon size={19} className="text-white group-hover:scale-105 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-blue-500 text-white text-[10px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center ring-2 ring-slate-900">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-extrabold tracking-tight hidden xs:inline">
                  {formatPrice(cartTotal)}
                </span>
              </button>

              {/* Cart Dropdown Preview */}
              {cartDropdownOpen && (
                <div className="absolute right-0 mt-2 w-84 sm:w-92 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in-down">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                    <span className="text-sm font-bold text-slate-900">
                      កន្ត្រកទំនិញ ({cartCount})
                    </span>
                    <button onClick={() => setCartDropdownOpen(false)} className="text-slate-400 hover:text-slate-600">
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
                              className="w-13 h-13 object-cover rounded-xl bg-slate-100 border border-slate-100 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0 text-left">
                              <h5 className="text-sm font-semibold text-slate-800 truncate">
                                {item.product.nameKh || item.product.name}
                              </h5>
                              <div className="text-sm font-bold text-blue-600 mt-0.5">
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
                                  <span className="px-2.5 font-bold text-slate-900">{item.quantity}</span>
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
                            <div className="text-sm font-bold text-slate-900 text-right">
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
                            className="py-2.5 text-center text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                          >
                            មើលកន្ត្រក
                          </Link>
                          <Link
                            to="/checkout"
                            onClick={() => setCartDropdownOpen(false)}
                            className="py-2.5 text-center text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20"
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

            {/* 5. User / Admin Pill (No truncation, beautiful styling) */}
            <div className="relative" ref={userRef}>
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border transition-all cursor-pointer ${
                      user.role === 'admin'
                        ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-amber-400/40 shadow-xs'
                        : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center flex-shrink-0 ${
                        user.role === 'admin'
                          ? 'bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-bold leading-tight whitespace-nowrap">
                        {user.name}
                      </div>
                      {user.role === 'admin' && (
                        <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1 mt-0.5">
                          <CrownIcon size={12} className="text-amber-400" />
                          <span>Admin</span>
                        </div>
                      )}
                    </div>
                    <ChevronDownIcon size={13} className="text-slate-400 hidden sm:inline" />
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
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-semibold text-left"
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
                  className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-2 rounded-2xl shadow-sm shadow-blue-500/20 transition-all hover:scale-102"
                >
                  <UserIcon size={16} />
                  <span>ចូលគណនី</span>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="pb-3.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400">
              <SearchIcon size={16} />
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ស្វែងរកទំនិញ..."
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-100 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </form>
        </div>
      </div>

      {/* 3. NAVIGATION ROW (Clean, stylish, high-fashion Khmer typography) */}
      <nav className="border-t border-slate-100 bg-slate-50/70 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2">
              {/* All Categories Button with Gradient */}
              <div className="relative" ref={categoryRef}>
                <button
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

      {/* 4. MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-base">
                  S
                </div>
                <div>
                  <div className="font-black text-base text-slate-900">SOKEIN TECH</div>
                  <div className="text-xs text-slate-500">ហាងបច្ចេកវិទ្យា & អេឡិចត្រូនិក</div>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-slate-400">
                <XIcon size={20} />
              </button>
            </div>

            <div className="p-3.5 space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">ទំព័រចម្បង</div>
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2.5 text-[15px] font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600 rounded-xl"
                >
                  {link.icon && <span>{link.icon}</span>}
                  <span>{link.label}</span>
                </Link>
              ))}

              <div className="pt-3.5 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">ប្រភេទទំនិញ</div>
                {catalogCategories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
                  >
                    <span>{cat.nameKh}</span>
                    <span className="text-xs text-slate-400">{cat.count}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-auto p-4 bg-slate-50 border-t border-slate-100 text-sm text-slate-600">
              <a href="tel:+855087812643" className="font-extrabold text-blue-600 block mb-1">
                📞 087 812 643
              </a>
              <div className="text-xs text-slate-500">រតនាគ ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង</div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

import { Link, useLocation } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  GridIcon,
  ShoppingBagIcon,
  HeartIcon,
  UserIcon,
} from './Icons';

export default function MobileBottomNav() {
  const location = useLocation();
  const { cartCount, wishlist } = useCart();
  const { user } = useAuth();

  const currentPath = location.pathname;

  const navItems = [
    {
      to: '/',
      label: 'ទំព័រដើម',
      icon: (active: boolean) => <HomeIcon size={20} className={active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'} />,
      badge: null,
      isActive: currentPath === '/',
    },
    {
      to: '/shop',
      label: 'ហាងទំនិញ',
      icon: (active: boolean) => <GridIcon size={20} className={active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'} />,
      badge: null,
      isActive: currentPath.startsWith('/shop') && currentPath !== '/shop?sale=true',
    },
    {
      to: '/cart',
      label: 'កន្ត្រក',
      icon: (active: boolean) => (
        <ShoppingBagIcon size={20} className={active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'} />
      ),
      badge: cartCount > 0 ? cartCount : null,
      badgeColor: 'bg-blue-600',
      isActive: currentPath === '/cart' || currentPath === '/checkout',
    },
    {
      to: '/wishlist',
      label: 'ចូលចិត្ត',
      icon: (active: boolean) => (
        <HeartIcon size={20} filled={wishlist.length > 0} className={active || wishlist.length > 0 ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400'} />
      ),
      badge: wishlist.length > 0 ? wishlist.length : null,
      badgeColor: 'bg-rose-500',
      isActive: currentPath === '/wishlist',
    },
    {
      to: user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login',
      label: user ? (user.role === 'admin' ? 'Admin' : 'គណនី') : 'ចូលគណនី',
      icon: (active: boolean) => <UserIcon size={20} className={active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'} />,
      badge: null,
      isActive: currentPath.startsWith('/dashboard') || currentPath.startsWith('/admin') || currentPath === '/login',
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 fixed-bottom-nav bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] select-none">
      <div className="max-w-md mx-auto grid grid-cols-5 h-15 px-1 items-center">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
              item.isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="relative">
              {item.icon(item.isActive)}
              {item.badge !== null && (
                <span
                  className={`absolute -top-1.5 -right-2.5 text-white text-[10px] font-black min-w-4 h-4 px-1 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 ${item.badgeColor || 'bg-blue-600'}`}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10.5px] mt-1 leading-tight truncate ${item.isActive ? 'font-extrabold text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
              {item.label}
            </span>
            {item.isActive && (
              <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

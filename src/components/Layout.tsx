import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#090D16] overflow-x-hidden w-full max-w-full">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pb-16 lg:pb-0 w-full max-w-full">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

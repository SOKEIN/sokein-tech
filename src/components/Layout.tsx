import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

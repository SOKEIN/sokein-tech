import { Suspense } from 'react';
import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import ScrollToTop from './ScrollToTop';

function PageFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2.5">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-medium">កំពុងផ្ទុក...</span>
      </div>
    </div>
  );
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#090D16] overflow-x-hidden w-full max-w-full">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pb-16 lg:pb-0 w-full max-w-full">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { SokeinLogoIcon } from '../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const defaultDestination = (location.state as any)?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      // If admin, navigate to /admin unless specific path was requested
      if (email.toLowerCase().includes('admin')) {
        navigate(defaultDestination || '/admin', { replace: true });
      } else {
        navigate(defaultDestination || '/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'ការចូលគណនីបានបរាជ័យ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoCustomer = () => {
    setEmail('soksouvann@gmail.com');
    setPassword('password123');
    setError('');
  };

  const handleDemoAdmin = () => {
    setEmail('admin@esokein.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 sm:py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6 sm:mb-8">
            <SokeinLogoIcon className="w-14 h-14 mx-auto mb-4" showStatus={false} />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">ចូលគណនី</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">សូមស្វាគមន៍មកកាន់ E-SOKEIN!</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-sm rounded-2xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Login Helpers */}
          <div className="mb-6 p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 rounded-2xl sm:rounded-3xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <span>🔑</span>
                <span>គណនីតេស្តសាកល្បង:</span>
              </span>
              <span className="text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-900/60">
                ចុចបំពេញភ្លាមៗ
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={handleDemoCustomer}
                className="bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/50 border-2 border-blue-200/90 dark:border-blue-800/80 hover:border-blue-500 text-blue-700 dark:text-blue-400 py-3 px-3.5 rounded-2xl font-medium transition-all shadow-xs hover:shadow-md cursor-pointer text-left group"
              >
                <span className="block text-sm sm:text-[15px] font-black text-blue-700 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                  👤 Customer
                </span>
                <span className="block text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">
                  soksouvann@...
                </span>
              </button>

              <button
                type="button"
                onClick={handleDemoAdmin}
                className="bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-950/50 border-2 border-amber-300/90 dark:border-amber-800/80 hover:border-amber-500 text-amber-800 dark:text-amber-400 py-3 px-3.5 rounded-2xl font-medium transition-all shadow-xs hover:shadow-md cursor-pointer text-left group"
              >
                <span className="block text-sm sm:text-[15px] font-black text-amber-800 dark:text-amber-300 group-hover:translate-x-0.5 transition-transform">
                  👑 Admin Panel
                </span>
                <span className="block text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">
                  admin@esokein...
                </span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 block mb-1.5">អ៊ីមែល ឬលេខទូរសព្ទ</label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@gmail.com ឬ 0XX XXX XXX"
                required
                className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 block mb-1.5">ពាក្យសម្ងាត់</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-100 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-lg cursor-pointer"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-blue-600 rounded" />
                <span className="text-slate-600 dark:text-slate-400 font-medium">ចងចាំខ្ញុំ</span>
              </label>
              <Link to="#" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">ភ្លេចពាក្យសម្ងាត់?</Link>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all text-base sm:text-lg mt-2 disabled:opacity-70 flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>កំពុងចូល...</span>
                </>
              ) : (
                'ចូលគណនី'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              មិនទាន់មានគណនី?{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">បង្កើតគណនីថ្មី</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

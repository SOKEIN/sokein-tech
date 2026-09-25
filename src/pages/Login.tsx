import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { SokeinLogoIcon } from '../components/Logo';

export default function Login() {
  const [loginRole, setLoginRole] = useState<'customer' | 'admin'>('customer');
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
      const loggedInUser = await login({ email: email.trim(), password });

      // If user is admin or selected Admin tab
      if (loggedInUser.role === 'admin') {
        navigate(defaultDestination || '/admin', { replace: true });
      } else {
        if (loginRole === 'admin') {
          setError('គណនីនេះមិនមានសិទ្ធិជា Admin ទេ (Account does not have admin role)');
          return;
        }
        navigate(defaultDestination || '/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'ការចូលគណនីបានបរាជ័យ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 sm:py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <SokeinLogoIcon className="w-14 h-14 mx-auto mb-3" showStatus={false} />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {loginRole === 'admin' ? 'ចូលគ្រប់គ្រងប្រព័ន្ធ' : 'ចូលគណនី'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
              {loginRole === 'admin'
                ? 'សូមបញ្ចូលគណនី និងពាក្យសម្ងាត់ Admin ដើម្បីគ្រប់គ្រង'
                : 'សូមបញ្ចូលលេខទូរសព្ទ ឬអ៊ីមែល និងពាក្យសម្ងាត់'}
            </p>
          </div>

          {/* Account Type Selector (Customer vs Admin) */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginRole('customer');
                setError('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginRole === 'customer'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>👤</span>
              <span>អតិថិជន (Customer)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginRole('admin');
                setError('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginRole === 'admin'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              <span>👑</span>
              <span>អ្នកគ្រប់គ្រង (Admin)</span>
            </button>
          </div>

          {loginRole === 'admin' && (
            <div className="mb-4 px-3.5 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <span>🔒</span>
              <span>តំបន់សុវត្ថិភាពសម្រាប់តែ Admin (ទាមទារវាយពាក្យសម្ងាត់ដោយផ្ទាល់)</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-sm rounded-2xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                {loginRole === 'admin' ? 'អ៊ីមែល ឬលេខទូរសព្ទ Admin' : 'អ៊ីមែល ឬលេខទូរសព្ទ'}
              </label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={
                  loginRole === 'admin'
                    ? 'admin@esokein.com ឬ 087 812 643'
                    : '0XX XXX XXX ឬ example@gmail.com'
                }
                required
                className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                {loginRole === 'admin' ? 'ពាក្យសម្ងាត់ Admin' : 'ពាក្យសម្ងាត់'}
              </label>
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
              <Link to="/contact" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                ភ្លេចពាក្យសម្ងាត់?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm sm:text-base shadow-md transition-all disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-white ${
                loginRole === 'admin'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>កំពុងផ្ទៀងផ្ទាត់...</span>
                </>
              ) : loginRole === 'admin' ? (
                <span>👑 ចូលផ្ទាំងគ្រប់គ្រង Admin</span>
              ) : (
                <span>ចូលគណនី</span>
              )}
            </button>
          </form>

          {loginRole === 'customer' && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                មិនទាន់មានគណនី?{' '}
                <Link
                  to={defaultDestination ? `/register?redirect=${encodeURIComponent(defaultDestination)}` : '/register'}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  បង្កើតគណនីថ្មី
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

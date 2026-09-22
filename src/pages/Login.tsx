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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-8 shadow-sm">
          <div className="text-center mb-8">
            <SokeinLogoIcon className="w-14 h-14 mx-auto mb-4" showStatus={false} />
            <h1 className="text-2xl font-bold text-[#0F172A]">ចូលគណនី</h1>
            <p className="text-[#64748B] text-sm mt-1">សូមស្វាគមន៍មកកាន់ E-SOKEIN!</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Login Helpers */}
          <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">គណនីតេស្តសាកល្បង:</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDemoCustomer}
                className="flex-1 bg-white hover:bg-blue-50 border border-blue-200 text-blue-700 text-xs py-2 px-2.5 rounded-xl font-medium transition-colors text-left"
              >
                <span className="block font-bold">👤 Customer</span>
                <span className="text-[10px] text-gray-500">soksouvann@...</span>
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="flex-1 bg-white hover:bg-amber-50 border border-amber-300 text-amber-800 text-xs py-2 px-2.5 rounded-xl font-medium transition-colors text-left"
              >
                <span className="block font-bold">👑 Admin Panel</span>
                <span className="text-[10px] text-gray-500">admin@esokein...</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#1E293B] block mb-1.5">អ៊ីមែល ឬលេខទូរសព្ទ</label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@gmail.com ឬ 0XX XXX XXX"
                required
                className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1E293B] block mb-1.5">ពាក្យសម្ងាត់</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-100 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1E293B] text-lg"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#2563EB]" />
                <span className="text-[#64748B]">ចងចាំខ្ញុំ</span>
              </label>
              <Link to="#" className="text-[#2563EB] hover:underline font-medium">ភ្លេចពាក្យសម្ងាត់?</Link>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2563EB] text-white py-3.5 rounded-xl font-semibold hover:bg-[#1D4ED8] transition-colors text-base mt-2 disabled:opacity-70 flex items-center justify-center gap-2"
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

          <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
            <p className="text-sm text-[#64748B]">
              មិនទាន់មានគណនី?{' '}
              <Link to="/register" className="text-[#2563EB] font-semibold hover:underline">បង្កើតគណនីថ្មី</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

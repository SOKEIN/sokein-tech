import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { SokeinLogoIcon } from '../components/Logo';

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក');
      return;
    }

    if (!phone.trim() && !email.trim()) {
      setError('សូមបញ្ចូលលេខទូរសព្ទ ឬអ៊ីមែលរបស់អ្នក');
      return;
    }

    if (password !== confirmPassword) {
      setError('ពាក្យសម្ងាត់ និងការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ');
      return;
    }

    if (password.length < 6) {
      setError('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច 6 តួអក្សរ');
      return;
    }

    if (!agreed) {
      setError('សូមយល់ព្រមនឹងលក្ខខណ្ឌប្រើប្រាស់');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err.message || 'ការបង្កើតគណនីបានបរាជ័យ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 sm:py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6 sm:mb-8">
            <SokeinLogoIcon className="w-14 h-14 mx-auto mb-4" showStatus={false} />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">បង្កើតគណនីថ្មី</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">ចូលរួមជាសមាជិក E-SOKEIN</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-sm rounded-2xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                ឈ្មោះពេញ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="ឈ្មោះ-នាមត្រកូល..."
                required
                className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                លេខទូរសព្ទ <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0XX XXX XXX (ប្រើសម្រាប់ទាក់ទង និងចូលគណនី)"
                required
                className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                អ្នកអាចប្រើប្រាស់លេខទូរសព្ទនេះដើម្បីចូលគណនី (Login) នាពេលក្រោយបាន។
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  អ៊ីមែល
                </label>
                <span className="text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  ស្រេចចិត្ត (Optional)
                </span>
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@gmail.com (ប្រសិនបើមាន)"
                className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                ពាក្យសម្ងាត់ <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="យ៉ាងហោចណាស់ 6 តួអក្សរ"
                  required
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-100 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                បញ្ជាក់ពាក្យសម្ងាត់ <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="បញ្ចូលពាក្យសម្ងាត់ម្តងទៀត"
                required
                className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-start gap-2.5 text-xs sm:text-sm pt-1">
              <input
                id="terms-checkbox"
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                required
                className="accent-blue-600 mt-1 cursor-pointer w-4 h-4 rounded"
              />
              <label htmlFor="terms-checkbox" className="text-slate-600 dark:text-slate-400 cursor-pointer">
                ខ្ញុំយល់ព្រមនឹង{' '}
                <Link to="/contact" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  លក្ខខណ្ឌប្រើប្រាស់
                </Link>{' '}
                និង{' '}
                <Link to="/contact" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  គោលការណ៍ភាពឯកជន
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-md shadow-blue-500/25 transition-all disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>កំពុងបង្កើតគណនី...</span>
                </>
              ) : (
                'បង្កើតគណនីថ្មី'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              មានគណនីរួចហើយ?{' '}
              <Link
                to={redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login'}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                ចូលគណនី (Login)
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

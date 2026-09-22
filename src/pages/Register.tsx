import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
      await register({ name, email, phone, password });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'ការបង្កើតគណនីបានបរាជ័យ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-8 shadow-sm">
          <div className="text-center mb-8">
            <SokeinLogoIcon className="w-14 h-14 mx-auto mb-4" showStatus={false} />
            <h1 className="text-2xl font-bold text-[#0F172A]">បង្កើតគណនីថ្មី</h1>
            <p className="text-[#64748B] text-sm mt-1">ចូលរួមជាអ្នកប្រើប្រាស់ E-SOKEIN</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#1E293B] block mb-1.5">ឈ្មោះពេញ</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="ឈ្មោះ-នាមត្រកូល..."
                required
                className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1E293B] block mb-1.5">លេខទូរសព្ទ</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0XX XXX XXX"
                required
                className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1E293B] block mb-1.5">អ៊ីមែល</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
                className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]"
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
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#1E293B] block mb-1.5">បញ្ជាក់ពាក្យសម្ងាត់</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                required
                className="accent-[#2563EB] mt-0.5"
              />
              <span className="text-[#64748B]">ខ្ញុំយល់ព្រមនឹង <Link to="#" className="text-[#2563EB] hover:underline">លក្ខខណ្ឌ</Link> និង <Link to="#" className="text-[#2563EB] hover:underline">គោលការណ៍ភាពឯកជន</Link></span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2563EB] text-white py-3.5 rounded-xl font-semibold hover:bg-[#1D4ED8] transition-colors text-base disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>កំពុងបង្កើត...</span>
                </>
              ) : (
                'បង្កើតគណនី'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
            <p className="text-sm text-[#64748B]">
              មានគណនីរួចហើយ?{' '}
              <Link to="/login" className="text-[#2563EB] font-semibold hover:underline">ចូលគណនី</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

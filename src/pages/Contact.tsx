import { useState } from 'react';
import { Link } from 'react-router';
import { api } from '../services/api';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.contact.submit({ name, email, phone, subject, message });
      setSuccessMsg(res.message);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'មិនអាចផ្ញើសារបានទេ សូមព្យាយាមម្តងទៀត');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <nav className="flex items-center gap-2 text-sm text-[#64748B] mb-6">
        <Link to="/" className="hover:text-[#2563EB]">ទំព័រដើម</Link>
        <span>/</span>
        <span className="text-[#1E293B] font-medium">ទំនាក់ទំនង</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">ទាក់ទងមកយើង</h1>
        <p className="text-[#64748B] max-w-lg mx-auto">ប្រសិនបើអ្នកមានសំណួរ ឬត្រូវការជំនួយ សូមទាក់ទងមកក្រុមការងាររបស់យើង។</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Info */}
        <div className="space-y-4">
          {[
            { icon: '📞', label: 'លេខទូរសព្ទ', value: '087 812 643', sub: 'ខ្មែរ / English' },
            { icon: '📧', label: 'អ៊ីមែល', value: 'Nhanhsokin168@gmail.com', sub: 'ឆ្លើយតបក្នុង 24ម៉ោង' },
            { icon: '📍', label: 'អាសយដ្ឋាន', value: 'រតនាគ, រតនាគ', sub: 'បាត់ដំបង, បាត់ដំបង' },
            { icon: '🕐', label: 'ម៉ោងធ្វើការ', value: 'ច័ន្ទ - សៅរ៍: 8:00 - 18:00', sub: 'អាទិត្យ: 9:00 - 17:00' },
          ].map(info => (
            <div key={info.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex items-start gap-4 shadow-sm">
              <div className="w-11 h-11 bg-[#EFF6FF] rounded-xl flex items-center justify-center text-xl flex-shrink-0">{info.icon}</div>
              <div>
                <div className="font-semibold text-[#1E293B] text-sm mb-1">{info.label}</div>
                <div className="text-[#64748B] text-sm">{info.value}</div>
                <div className="text-[#94A3B8] text-xs mt-0.5">{info.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <h2 className="font-bold text-[#0F172A] mb-5">ផ្ញើសារមកកាន់យើង</h2>

          {successMsg && (
            <div className="mb-5 p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2">
              <span>✅</span>
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
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
                <label className="text-sm font-medium text-[#1E293B] block mb-1.5">លេខទូរសព្ទ</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0XX XXX XXX"
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#1E293B] block mb-1.5">ប្រធានបទ</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="សំណួរអំពីការបញ្ជាទិញ..."
                  required
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#1E293B] block mb-1.5">សារ</label>
              <textarea
                rows={5}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="សូមសរសេរសារ ឬសំណួររបស់អ្នកនៅទីនេះ..."
                required
                className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#2563EB] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#1D4ED8] transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>កំពុងផ្ញើ...</span>
                </>
              ) : (
                '📤 ផ្ញើសារ'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

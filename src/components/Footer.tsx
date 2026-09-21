import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center text-white font-bold text-lg">S</div>
              <div>
                <div className="font-bold text-lg">SOKEINTECH</div>
                <div className="text-xs text-[#94A3B8]">ហាងបច្ចេកវិទ្យា និងអេឡិចត្រូនិក</div>
              </div>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed">ហាងលក់ទំនិញអេឡិចត្រូនិកល្អ នៅរតនាគ បាត់ដំបង ជាមួយតម្លៃសមរម្យ និងសេវាកម្មល្អ។</p>
            <div className="flex items-center gap-3 mt-4">
              {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
                <button key={i} className="w-9 h-9 bg-[#1E293B] rounded-lg flex items-center justify-center hover:bg-[#2563EB] transition-colors text-base">{icon}</button>
              ))}
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-semibold mb-4 text-white">ហាងទំនិញ</h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              {[['ទំនិញទាំងអស់', '/shop'], ['ទំនិញថ្មី', '/shop?sort=new'], ['ទំនិញពេញនិយម', '/shop?sort=popular'], ['ប្រូម៉ូសិន', '/shop?sale=true']].map(([label, href]) => (
                <li key={label}><Link to={href} className="hover:text-white hover:underline">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-semibold mb-4 text-white">ជំនួយអតិថិជន</h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              {[['ទាក់ទងយើង', '/contact'], ['ការដឹកជញ្ជូន', '/contact'], ['ការធានា', '/contact'], ['គោលការណ៍ប្តូរទំនិញ', '/contact'], ['សំណួរដែលសួរញឹកញាប់', '/contact']].map(([label, href]) => (
                <li key={label}><Link to={href} className="hover:text-white hover:underline">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-semibold mb-4 text-white">គណនីរបស់ខ្ញុំ</h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              {[['ចូលគណនី', '/login'], ['ការបញ្ជាទិញ', '/dashboard/orders'], ['តាមដានការបញ្ជាទិញ', '/tracking'], ['ទំនិញដែលចូលចិត្ត', '/wishlist']].map(([label, href]) => (
                <li key={label}><Link to={href} className="hover:text-white hover:underline">{label}</Link></li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-xs text-[#64748B] mb-2">ទទួលបានការផ្តល់ជូន</p>
              <div className="flex">
                <input type="email" placeholder="អ៊ីមែលរបស់អ្នក" className="flex-1 bg-[#1E293B] border border-[#334155] rounded-l-lg px-3 py-2 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#2563EB]" />
                <button className="bg-[#2563EB] px-3 py-2 rounded-r-lg hover:bg-[#1D4ED8] text-sm">→</button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1E293B] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#64748B] text-xs">© 2024 SOKEINTECH. រក្សាសិទ្ធិទាំងអស់។</p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {['💳', '🏦', '📱', '💵'].map((icon, i) => (
              <span key={i} className="bg-[#1E293B] px-3 py-1.5 rounded text-sm">{icon}</span>
            ))}
            <span className="bg-[#2563EB] px-3 py-1.5 rounded text-xs font-medium">KHQR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

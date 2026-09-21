import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { api, type Order, type User } from '../services/api';

type AdminUser = User & { ordersCount: number; totalSpent: number };

export default function AdminDashboard() {
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders' | 'messages'>('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalProducts: 0,
  });

  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & search
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Selected for modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');

  // Protect Admin route
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: { pathname: '/admin' } } });
      } else if (user?.role !== 'admin') {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const loadAdminData = async () => {
    if (!user || user.role !== 'admin') return;
    setIsLoading(true);
    try {
      const [statsRes, usersRes, ordersRes, contactsRes] = await Promise.all([
        api.admin.stats(),
        api.admin.getUsers(),
        api.admin.getOrders(),
        api.admin.getContacts(),
      ]);

      setStats(statsRes);
      setUsersList(usersRes.users);
      setOrdersList(ordersRes.orders);
      setMessagesList(contactsRes.messages);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      setActionErrorMsg(err.message || 'មិនអាចទាញយកទិន្នន័យ Admin');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadAdminData();
    }
  }, [isAuthenticated, user]);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'customer') => {
    try {
      await api.admin.updateUserRole(userId, newRole);
      setActionSuccessMsg('បានផ្លាស់ប្តូរសិទ្ធិដោយជោគជ័យ!');
      setTimeout(() => setActionSuccessMsg(''), 3000);
      loadAdminData();
    } catch (err: any) {
      setActionErrorMsg(err.message || 'មិនអាចផ្លាស់ប្តូរសិទ្ធិបានទេ');
      setTimeout(() => setActionErrorMsg(''), 4000);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`តើអ្នកពិតជាចង់លុបគណនី "${userName}" មែនទេ?`)) return;

    try {
      await api.admin.deleteUser(userId);
      setActionSuccessMsg(`បានលុបគណនី ${userName} ជោគជ័យ!`);
      setTimeout(() => setActionSuccessMsg(''), 3000);
      loadAdminData();
    } catch (err: any) {
      setActionErrorMsg(err.message || 'មិនអាចលុបគណនីបានទេ');
      setTimeout(() => setActionErrorMsg(''), 4000);
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await api.admin.updateOrderStatus(orderId, newStatus);
      setActionSuccessMsg(`បានកែប្រែស្ថានភាពការបញ្ជាទិញ #${orderId} ជោគជ័យ!`);
      setTimeout(() => setActionSuccessMsg(''), 3000);
      loadAdminData();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      setActionErrorMsg(err.message || 'មិនអាចកែប្រែស្ថានភាពបានទេ');
      setTimeout(() => setActionErrorMsg(''), 4000);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="flex items-center gap-3 text-[#2563EB]">
          <span className="animate-spin text-3xl">⏳</span>
          <span className="font-semibold text-lg">កំពុងដំណើរការ Admin Dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const filteredUsers = usersList.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.phone && u.phone.includes(userSearch))
  );

  const filteredOrders = ordersList.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);

    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-[#16A34A] bg-[#DCFCE7]">បានដឹកដល់ (Delivered)</span>;
      case 'shipped':
        return <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-[#2563EB] bg-[#DBEAFE]">កំពុងដឹកជញ្ជូន (Shipped)</span>;
      case 'processing':
        return <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-[#F59E0B] bg-[#FEF3C7]">កំពុងរៀបចំ (Processing)</span>;
      case 'cancelled':
        return <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-[#DC2626] bg-[#FEE2E2]">បានលុបចោល (Cancelled)</span>;
      default:
        return <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-[#64748B] bg-[#F1F5F9]">រង់ចាំការបញ្ជាក់ (Pending)</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Top Admin Header Bar */}
      <div className="bg-[#0F172A] text-white border-b border-gray-800 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-xl shadow-lg">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-white">SOKEIN Admin Center</h1>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-mono border border-amber-500/30">
                  SYSTEM ADMIN
                </span>
              </div>
              <p className="text-xs text-gray-400">ផ្ទាំងគ្រប់គ្រងអ្នកប្រើប្រាស់ ការបញ្ជាទិញ និងទិន្នន័យប្រព័ន្ធ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminData}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs px-3.5 py-2 rounded-xl border border-gray-700 transition-colors flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span>ផ្ទុកទិន្នន័យឡើងវិញ</span>
            </button>
            <Link
              to="/dashboard"
              className="bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-xs px-3.5 py-2 rounded-xl border border-blue-500/30 transition-colors"
            >
              👤 ទៅកាន់ Dashboard ផ្ទាល់ខ្លួន
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs px-3 py-2 rounded-xl border border-red-500/30 transition-colors"
            >
              ចាកចេញ
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Toast Alerts */}
        {actionSuccessMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-sm shadow-sm animate-fade-in">
            <span>✅</span>
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {actionErrorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-2 text-sm shadow-sm">
            <span>⚠️</span>
            <span>{actionErrorMsg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-gray-200">
          {[
            { id: 'overview', label: '📊 ស្ថិតិ & ទិដ្ឋភាពទូទៅ', count: null },
            { id: 'users', label: '👥 គ្រប់គ្រងអ្នកប្រើប្រាស់', count: stats.totalUsers },
            { id: 'orders', label: '📦 គ្រប់គ្រងការបញ្ជាទិញ', count: stats.totalOrders },
            { id: 'messages', label: '💬 សារទំនាក់ទំនង', count: messagesList.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="text-xs text-gray-500 font-medium">ចំណូលសរុប (Total Revenue)</div>
                <div className="text-3xl font-extrabold text-emerald-600 mt-2 font-mono">
                  ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
                  <span>📈</span> ការបញ្ជាទិញដែលមិនត្រូវបានលុប
                </div>
                <div className="absolute top-4 right-4 text-4xl opacity-10">💰</div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="text-xs text-gray-500 font-medium">អ្នកប្រើប្រាស់សរុប (Users)</div>
                <div className="text-3xl font-extrabold text-blue-600 mt-2 font-mono">{stats.totalUsers}</div>
                <div className="text-xs text-blue-600 mt-2 flex items-center gap-1 font-medium">
                  <span>👥</span> គណនីបានចុះឈ្មោះ
                </div>
                <div className="absolute top-4 right-4 text-4xl opacity-10">👤</div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="text-xs text-gray-500 font-medium">ការបញ្ជាទិញសរុប (Orders)</div>
                <div className="text-3xl font-extrabold text-purple-600 mt-2 font-mono">{stats.totalOrders}</div>
                <div className="text-xs text-purple-600 mt-2 flex items-center gap-1 font-medium">
                  <span>📦</span> ក្នុងប្រព័ន្ធទាំងមូល
                </div>
                <div className="absolute top-4 right-4 text-4xl opacity-10">📦</div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="text-xs text-gray-500 font-medium">កំពុងដំណើរការ (Pending)</div>
                <div className="text-3xl font-extrabold text-amber-500 mt-2 font-mono">{stats.pendingOrders}</div>
                <div className="text-xs text-amber-600 mt-2 flex items-center gap-1 font-medium">
                  <span>⏳</span> រង់ចាំការវេចខ្ចប់ និងដឹកជញ្ជូន
                </div>
                <div className="absolute top-4 right-4 text-4xl opacity-10">⏳</div>
              </div>
            </div>

            {/* Quick Overview Tables */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <span className="text-xl">📦</span>
                    <span>ការបញ្ជាទិញថ្មីៗ</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-sm font-bold text-blue-600 hover:underline"
                  >
                    មើលទាំងអស់ ({ordersList.length}) →
                  </button>
                </div>
                <div className="space-y-3.5">
                  {ordersList.slice(0, 5).map(o => (
                    <div
                      key={o.id}
                      onClick={() => {
                        setSelectedOrder(o);
                      }}
                      className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50/40 transition-all cursor-pointer shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="text-blue-600 font-mono font-bold text-sm bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                            #{o.id}
                          </span>
                          <span className="text-gray-900 font-bold text-base md:text-lg">
                            {o.customerName}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span>📅 {new Date(o.createdAt).toLocaleDateString('km-KH')}</span>
                          <span>•</span>
                          <span>🛍️ {o.items.length} មុខ</span>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-extrabold text-base md:text-lg text-gray-900 font-mono">
                          ${o.total.toFixed(2)}
                        </div>
                        <div>{getStatusBadge(o.status)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Registered Users */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <span className="text-xl">👥</span>
                    <span>អ្នកប្រើប្រាស់ថ្មីៗ</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="text-sm font-bold text-blue-600 hover:underline"
                  >
                    មើលទាំងអស់ ({usersList.length}) →
                  </button>
                </div>
                <div className="space-y-3.5">
                  {usersList.slice(0, 5).map(u => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors shadow-xs"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                          {u.name.charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base md:text-lg text-gray-900">{u.name}</span>
                            {u.role === 'admin' && (
                              <span className="bg-amber-100 text-amber-900 text-xs px-2 py-0.5 rounded-md font-bold border border-amber-200">
                                👑 ADMIN
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                      </div>
                      <div className="text-right space-y-0.5">
                        <div className="font-bold text-sm text-gray-800 bg-gray-100 px-2.5 py-0.5 rounded-lg inline-block">
                          {u.ordersCount} ការបញ្ជាទិញ
                        </div>
                        <div className="text-xs text-emerald-600 font-bold font-mono">
                          ${u.totalSpent.toFixed(2)} សរុប
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-bold text-xl text-gray-900">បញ្ជីអ្នកប្រើប្រាស់ទាំងអស់ (User Management)</h2>
                <p className="text-sm text-gray-500 mt-1">អ្នកអាចគ្រប់គ្រង សិទ្ធិ (Role) និងពិនិត្យមើលការបញ្ជាទិញរបស់អតិថិជនម្នាក់ៗ</p>
              </div>

              <div className="w-full sm:w-80">
                <input
                  type="text"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="🔍 ស្វែងរកតាម ឈ្មោះ អ៊ីមែល លេខទូរសព្ទ..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/70">
                    <th className="py-3.5 px-4 text-xs font-bold text-gray-600 uppercase">អ្នកប្រើប្រាស់</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-gray-600 uppercase">លេខទូរសព្ទ</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-gray-600 uppercase">សិទ្ធិ (Role)</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-gray-600 uppercase">ការបញ្ជាទិញ</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-gray-600 uppercase">ចំណាយសរុប</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-gray-600 uppercase">កាលបរិច្ឆេទចុះឈ្មោះ</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-gray-600 uppercase text-right">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-base">{u.name}</div>
                            <div className="text-xs text-gray-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-800">{u.phone || '-'}</td>
                      <td className="py-4 px-4">
                        <select
                          value={u.role}
                          disabled={u.id === 'usr_admin_root' || u.id === user.id}
                          onChange={e => handleRoleChange(u.id, e.target.value as any)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                            u.role === 'admin'
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-gray-50 text-gray-800 border-gray-300'
                          } disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                          <option value="customer">👤 Customer</option>
                          <option value="admin">👑 Admin</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-mono border border-blue-100">
                          {u.ordersCount} កញ្ចប់
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm font-extrabold text-emerald-600 font-mono">
                        ${u.totalSpent.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-600 font-medium">
                        {new Date(u.createdAt).toLocaleDateString('km-KH')}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {u.id !== 'usr_admin_root' && u.id !== user.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            title="លុបគណនី"
                            className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-red-200 transition-colors"
                          >
                            🗑️ លុប
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-bold text-xl text-gray-900">គ្រប់គ្រងការបញ្ជាទិញ (Order Management)</h2>
                <p className="text-sm text-gray-500 mt-1">
                  ផ្លាស់ប្តូរស្ថានភាពបញ្ជាទិញ វានឹងធ្វើបច្ចុប្បន្នភាពទៅកាន់ការតាមដាន (Live Tracking) របស់អតិថិជនភ្លាមៗ
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <select
                  value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="all">ស្ថានភាពទាំងអស់</option>
                  <option value="pending">⏳ រង់ចាំការបញ្ជាក់ (Pending)</option>
                  <option value="processing">📦 កំពុងរៀបចំ (Processing)</option>
                  <option value="shipped">🚚 កំពុងដឹកជញ្ជូន (Shipped)</option>
                  <option value="delivered">✅ បានដឹកដល់ (Delivered)</option>
                  <option value="cancelled">❌ បានលុបចោល (Cancelled)</option>
                </select>

                <input
                  type="text"
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  placeholder="🔍 លេខបញ្ជាទិញ, ឈ្មោះ, ទូរសព្ទ..."
                  className="border border-gray-300 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500 flex-1 sm:w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/70">
                    <th className="py-3.5 px-4 text-xs font-bold text-gray-600 uppercase">លេខកូដ</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-gray-600 uppercase">អតិថិជន / អ្នកបញ្ជាទិញ</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-gray-600 uppercase">ទំនិញ</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-gray-600 uppercase">ទឹកប្រាក់សរុប</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-gray-600 uppercase">វិធីទូទាត់</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-gray-600 uppercase">ស្ថានភាព</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-gray-600 uppercase">ផ្លាស់ប្តូរស្ថានភាព</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-gray-600 uppercase text-right">លម្អិត</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-sm text-blue-600 font-mono">
                        <span className="bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                          #{o.id}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900 text-base">{o.customerName}</div>
                        <div className="text-xs text-gray-500 font-medium">{o.customerPhone}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800">
                        {o.items.length} មុខ ({o.items.map(i => i.name).join(', ').substring(0, 24)}...)
                      </td>
                      <td className="py-4 px-4 text-base font-extrabold text-gray-900 font-mono">
                        ${o.total.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700">
                          {o.paymentMethod}
                        </span>
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(o.status)}</td>
                      <td className="py-4 px-4">
                        <select
                          value={o.status}
                          onChange={e => handleOrderStatusUpdate(o.id, e.target.value as any)}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs"
                        >
                          <option value="pending">⏳ រង់ចាំ (Pending)</option>
                          <option value="processing">📦 កំពុងរៀបចំ (Processing)</option>
                          <option value="shipped">🚚 កំពុងដឹកជញ្ជូន (Shipped)</option>
                          <option value="delivered">✅ បានដឹកដល់ (Delivered)</option>
                          <option value="cancelled">❌ លុបចោល (Cancelled)</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors"
                        >
                          👁️ មើលលម្អិត
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-1">សារទំនាក់ទំនងពីអតិថិជន (Inquiries)</h2>
            <p className="text-xs text-gray-500 mb-6">សារដែលអតិថិជនបានផ្ញើតាមរយៈទំព័រទំនាក់ទំនង (Contact Us)</p>

            {messagesList.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">មិនទាន់មានសារទំនាក់ទំនងនៅឡើយទេ</div>
            ) : (
              <div className="space-y-4">
                {messagesList.map((m, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                        <span>👤 {m.name}</span>
                        <span className="text-xs text-blue-600 font-normal">({m.email})</span>
                        {m.phone && <span className="text-xs text-gray-500 font-normal">📞 {m.phone}</span>}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {new Date(m.createdAt).toLocaleString('km-KH')}
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-gray-800">ប្រធានបទ: {m.subject}</div>
                    <p className="text-xs text-gray-600 leading-relaxed bg-white p-3 rounded-xl border border-gray-100">
                      {m.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <span>ការបញ្ជាទិញ</span>
                  <span className="text-blue-600 font-mono">#{selectedOrder.id}</span>
                </h3>
                <p className="text-xs text-gray-400">{new Date(selectedOrder.createdAt).toLocaleString('km-KH')}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-blue-50 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-blue-900 block font-medium">ស្ថានភាពបច្ចុប្បន្ន:</span>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>

                <div>
                  <label className="text-[11px] text-blue-900 block mb-1">ប្តូរស្ថានភាព:</label>
                  <select
                    value={selectedOrder.status}
                    onChange={e => handleOrderStatusUpdate(selectedOrder.id, e.target.value as any)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-blue-200 bg-white"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="processing">📦 Processing</option>
                    <option value="shipped">🚚 Shipped</option>
                    <option value="delivered">✅ Delivered</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer details */}
              <div className="bg-gray-50 p-4 rounded-2xl grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block">អតិថិជន:</span>
                  <span className="font-bold text-gray-800 text-sm">{selectedOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">លេខទូរសព្ទ:</span>
                  <span className="font-bold text-gray-800 text-sm">{selectedOrder.customerPhone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 block">អាសយដ្ឋានដឹកជញ្ជូន:</span>
                  <span className="font-medium text-gray-800">{selectedOrder.shippingAddress}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">វិធីទូទាត់:</span>
                  <span className="font-semibold uppercase text-gray-800">{selectedOrder.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">ការទូទាត់:</span>
                  <span className="font-semibold text-gray-800">{selectedOrder.paymentStatus}</span>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">ទំនិញក្នុងកញ្ចប់</h4>
                <div className="space-y-2 border border-gray-100 rounded-2xl p-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-gray-50 border border-gray-100" />
                      <div className="flex-1">
                        <div className="font-semibold text-xs text-gray-800 line-clamp-1">{item.name}</div>
                        <div className="text-[11px] text-gray-500">${item.price} × {item.quantity}</div>
                      </div>
                      <div className="font-bold text-xs text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-center font-bold text-base">
                <span>ទឹកប្រាក់សរុប:</span>
                <span className="text-blue-600 font-mono text-xl">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                to={`/tracking?q=${selectedOrder.id}`}
                target="_blank"
                className="flex-1 bg-gray-900 text-white text-center py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-800"
              >
                🚚 មើលទំព័រ Tracking
              </Link>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold hover:bg-gray-50"
              >
                បិទ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

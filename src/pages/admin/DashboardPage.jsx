import React, { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../../services/adminApi';
import { Users, Package, ShoppingCart, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, gradient, prefix = '' }) => (
  <div className="rounded-2xl p-5 transition-all duration-300 group hover:scale-[1.02]"
    style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.08)' }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(228,185,74,0.6)' }}>{label}</p>
        <p className="text-2xl font-bold text-white mt-2">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</p>
      </div>
      <div className={`p-2.5 rounded-xl ${gradient} transition-transform duration-300 group-hover:scale-110`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    PENDING: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    CONFIRMED: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    SHIPPED: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    DELIVERED: 'bg-green-500/15 text-green-400 border-green-500/20',
    CANCELLED: 'bg-red-500/15 text-red-400 border-red-500/20',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${colors[status] || 'bg-gray-500/15 text-gray-400 border-gray-500/20'}`}>
      {status}
    </span>
  );
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" style={{ borderColor: '#e4b94a' }}></div></div>;
  if (!stats) return <div className="text-gray-400 text-center py-12">Failed to load dashboard.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(228,185,74,0.5)' }}>Overview of your fitness store</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={stats.totalRevenue?.toFixed(2)} gradient="bg-gradient-to-br from-emerald-500 to-emerald-700" prefix="₹" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} gradient="bg-gradient-to-br from-blue-500 to-blue-700" />
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} gradient="bg-gradient-to-br from-purple-500 to-purple-700" />
        <StatCard icon={Package} label="Total Products" value={stats.totalProducts} gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="rounded-2xl p-5" style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.08)' }}>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={18} style={{ color: '#e4b94a' }} />
            <h2 className="text-white font-semibold">Orders by Status</h2>
          </div>
          <div className="space-y-4">
            {stats.ordersByStatus && Object.entries(stats.ordersByStatus).map(([status, count]) => {
              const pct = ((count / (stats.totalOrders || 1)) * 100).toFixed(1);
              const barColors = { PENDING:'#eab308', CONFIRMED:'#3b82f6', SHIPPED:'#a855f7', DELIVERED:'#22c55e', CANCELLED:'#ef4444' };
              return (
                <div key={status}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-gray-400">{status}</span>
                    <span className="text-sm text-white font-medium">{count} <span className="text-gray-500">({pct}%)</span></span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: barColors[status] || '#6b7280' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-2xl p-5" style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.08)' }}>
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={18} className="text-yellow-400" />
            <h2 className="text-white font-semibold">Low Stock Alerts</h2>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {stats.lowStockProducts?.map((p) => (
              <div key={p.productId} className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/[0.03]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <Package size={16} className="text-gray-500" />}
                </div>
                <div className="flex-1 min-w-0"><p className="text-sm text-white font-medium truncate">{p.name}</p><p className="text-xs text-gray-500">{p.brand}</p></div>
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${p.stock===0?'bg-red-500/15 text-red-400':'bg-yellow-500/15 text-yellow-400'}`}>{p.stock===0?'Out of stock':`${p.stock} left`}</span>
              </div>
            ))}
            {(!stats.lowStockProducts||stats.lowStockProducts.length===0)&&<p className="text-gray-500 text-sm text-center py-4">All products well stocked!</p>}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl p-5" style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.08)' }}>
        <h2 className="text-white font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(228,185,74,0.08)' }}>
                {['Order ID','Customer','Amount','Status','Date'].map(h => (
                  <th key={h} className="text-left text-xs font-medium uppercase tracking-wider pb-3 px-3" style={{ color: 'rgba(228,185,74,0.5)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders?.map((o) => (
                <tr key={o.orderId} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td className="py-3 px-3 text-sm font-medium" style={{ color: '#e4b94a' }}>#{o.orderId}</td>
                  <td className="py-3 px-3"><p className="text-sm text-white">{o.customerName}</p><p className="text-xs text-gray-500">{o.customerEmail}</p></td>
                  <td className="py-3 px-3 text-sm text-white font-medium">₹{o.totalAmount?.toLocaleString()}</td>
                  <td className="py-3 px-3"><StatusBadge status={o.status}/></td>
                  <td className="py-3 px-3 text-sm text-gray-400">{o.orderDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

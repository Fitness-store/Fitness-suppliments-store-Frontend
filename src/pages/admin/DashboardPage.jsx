import React, { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../../services/adminApi';
import { Users, Package, ShoppingCart, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, prefix = '' }) => (
  <div className="bg-[#0F1629] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-300 group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white mt-2">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</p>
      </div>
      <div className={`p-2.5 rounded-xl ${color} transition-transform duration-300 group-hover:scale-110`}>
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

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div></div>;
  if (!stats) return <div className="text-gray-400 text-center py-12">Failed to load dashboard.</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Dashboard</h1><p className="text-gray-500 text-sm mt-1">Overview of your fitness store</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={stats.totalRevenue?.toFixed(2)} color="bg-gradient-to-br from-green-500 to-green-700" prefix="₹" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} color="bg-gradient-to-br from-blue-500 to-blue-700" />
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-gradient-to-br from-purple-500 to-purple-700" />
        <StatCard icon={Package} label="Total Products" value={stats.totalProducts} color="bg-gradient-to-br from-orange-500 to-orange-700" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-[#0F1629] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4"><TrendingUp size={18} className="text-primary-400" /><h2 className="text-white font-semibold">Orders by Status</h2></div>
          <div className="space-y-3">
            {stats.ordersByStatus && Object.entries(stats.ordersByStatus).map(([status, count]) => {
              const pct = ((count / (stats.totalOrders || 1)) * 100).toFixed(1);
              const bc = { PENDING:'bg-yellow-500', CONFIRMED:'bg-blue-500', SHIPPED:'bg-purple-500', DELIVERED:'bg-green-500', CANCELLED:'bg-red-500' };
              return (<div key={status}><div className="flex justify-between mb-1"><span className="text-sm text-gray-400">{status}</span><span className="text-sm text-white font-medium">{count} ({pct}%)</span></div><div className="h-2 bg-white/[0.04] rounded-full overflow-hidden"><div className={`h-full rounded-full ${bc[status]||'bg-gray-500'}`} style={{width:`${pct}%`}}/></div></div>);
            })}
          </div>
        </div>
        <div className="bg-[#0F1629] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4"><AlertTriangle size={18} className="text-yellow-400" /><h2 className="text-white font-semibold">Low Stock Alerts</h2></div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stats.lowStockProducts?.map((p) => (
              <div key={p.productId} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04]">
                <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center overflow-hidden flex-shrink-0">
                  {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <Package size={16} className="text-gray-500" />}
                </div>
                <div className="flex-1 min-w-0"><p className="text-sm text-white font-medium truncate">{p.name}</p><p className="text-xs text-gray-500">{p.brand}</p></div>
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${p.stock===0?'bg-red-500/15 text-red-400':'bg-yellow-500/15 text-yellow-400'}`}>{p.stock===0?'Out of stock':`${p.stock} left`}</span>
              </div>
            ))}
            {(!stats.lowStockProducts||stats.lowStockProducts.length===0)&&<p className="text-gray-500 text-sm text-center py-4">All products well stocked!</p>}
          </div>
        </div>
      </div>
      <div className="bg-[#0F1629] border border-white/[0.06] rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full"><thead><tr className="border-b border-white/[0.06]">
            {['Order ID','Customer','Amount','Status','Date'].map(h=><th key={h} className="text-left text-xs text-gray-500 font-medium uppercase tracking-wider pb-3 px-3">{h}</th>)}
          </tr></thead><tbody>
            {stats.recentOrders?.map((o)=>(
              <tr key={o.orderId} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="py-3 px-3 text-sm text-primary-400 font-medium">#{o.orderId}</td>
                <td className="py-3 px-3"><p className="text-sm text-white">{o.customerName}</p><p className="text-xs text-gray-500">{o.customerEmail}</p></td>
                <td className="py-3 px-3 text-sm text-white font-medium">₹{o.totalAmount?.toLocaleString()}</td>
                <td className="py-3 px-3"><StatusBadge status={o.status}/></td>
                <td className="py-3 px-3 text-sm text-gray-400">{o.orderDate}</td>
              </tr>
            ))}
          </tbody></table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

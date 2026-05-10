import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/useAdminAuth';
import {
  LayoutDashboard, Package, Tag, Users, ShoppingCart,
  Warehouse, Shield, LogOut, Menu, X, ChevronDown, Dumbbell
} from 'lucide-react';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/categories', icon: Tag, label: 'Categories' },
  { to: '/admin/users', icon: Users, label: 'Users', roles: ['ADMIN', 'SUPER_ADMIN'] },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/inventory', icon: Warehouse, label: 'Inventory' },
];

const AdminLayout = () => {
  const { adminUser, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isSuperAdmin = adminUser?.role === 'SUPER_ADMIN';

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  const adminRole = adminUser?.role;

  const allNavItems = [
    ...navItems.filter(item => !item.roles || item.roles.includes(adminRole)),
    ...(isSuperAdmin ? [{ to: '/admin/admins', icon: Shield, label: 'Admins' }] : []),
  ];

  return (
    <div className="min-h-screen flex" style={{ background: '#06080f' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-50 w-[260px]
        flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
        style={{ background: '#0c1021', borderRight: '1px solid rgba(228,185,74,0.08)' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5" style={{ borderBottom: '1px solid rgba(228,185,74,0.08)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e4b94a, #f97316)' }}>
            <Dumbbell className="w-5 h-5" style={{ color: '#09090b' }} />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm tracking-wide">IronCore</h1>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: '#e4b94a' }}>Admin Panel</p>
          </div>
          <button className="ml-auto lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest font-semibold px-3 mb-3" style={{ color: 'rgba(228,185,74,0.5)' }}>Navigation</p>
          <div className="space-y-1">
            {allNavItems.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }
                `}
                style={({ isActive }) => isActive ? {
                  background: 'rgba(228,185,74,0.1)',
                  color: '#e4b94a',
                  boxShadow: '0 0 20px rgba(228,185,74,0.05)'
                } : {}}
              >
                {({ isActive }) => (
                  <>
                    <div className="p-1.5 rounded-lg transition-colors" style={isActive ? { background: 'rgba(228,185,74,0.15)' } : { background: 'rgba(255,255,255,0.04)' }}>
                      <Icon size={16} style={isActive ? { color: '#e4b94a' } : {}} />
                    </div>
                    {label}
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#e4b94a' }} />}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(228,185,74,0.08)' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <div className="p-1.5 rounded-lg bg-red-500/10">
              <LogOut size={16} />
            </div>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-16 backdrop-blur-xl flex items-center px-4 lg:px-6 sticky top-0 z-30"
          style={{ background: 'rgba(6,8,15,0.85)', borderBottom: '1px solid rgba(228,185,74,0.06)' }}
        >
          <button
            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.04] mr-3"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex-1" />

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e4b94a, #f97316)' }}>
                <span className="font-bold text-xs" style={{ color: '#09090b' }}>
                  {adminUser?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm text-white font-medium">{adminUser?.fullName || 'Admin'}</p>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: '#e4b94a' }}>{adminUser?.role || 'ADMIN'}</p>
              </div>
              <ChevronDown size={14} className="text-gray-500" />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-2xl z-50 py-1"
                  style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.1)' }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(228,185,74,0.08)' }}>
                    <p className="text-sm text-white font-medium truncate">{adminUser?.email}</p>
                  </div>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.04]"
                    style={{ color: '#e4b94a' }}
                  >
                    View Store
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
